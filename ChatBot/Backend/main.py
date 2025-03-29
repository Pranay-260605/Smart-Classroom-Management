from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import uvicorn
import generic_helper
import db_helper
import re
from datetime import datetime
import json
import psycopg2
import psygopg2.extras

DB_URL = "postgresql://postgres:pgoel2010@db.iocnbbqkijfuqjuikmfn.supabase.co:5432/postgres"

app = FastAPI()

def handle_attendance_fetch(parameters: dict, session_id: str):
    subjects = parameters.get("subject", [])
    roll = parameters.get("roll_number", [])

    if not roll or not subjects:
        return {"fulfillmentText" : "Could not fetch your attendance. Please provide your roll number and subject to fetch attendance."}
    
    results = []
    missing_subjects = []
    for subject in subjects:
        result = db_helper.get_attendance(subject=subject.lower(), roll=roll[0])

        if "No entry found for" in result:
            missing_subjects.append(subject)
        else:
            results.append(result)

    if missing_subjects:
        return {
            "fulfillmentText": f"There is no entry for {', '.join(missing_subjects)}. Please provide a correct subject."
        }

    if results:
        return {
            "fulfillmentMessages": [{"text": {"text": results}}]
        }
    else:
        return {
            "fulfillmentMessages": [{"text": {"text": ["There was an error while fetching the attendance. Please try again."]}}]
        }

def handle_appointment_booking(parameters: dict, session_id: str):
    subject = parameters.get("subject", [])

    if not subject:
        return {
            "fulfillmentText": "Cannot book an appointment. Please specify the subject in which you are facing an issue."
        }

    result = db_helper.get_instructor_details(subject=subject[0])

    if result is None:
        return {
            "fulfillmentText": "No data found for the given subject. Please try again."
        }

    messages = [
        {"text": {"text": ["Here are the available instructors:"]}},
        {
            "payload": {
                "richContent": [
                    [
                        {
                            "type": "chips",
                            "options": [
                                {
                                    "text": f"{instructor['instructor_name']} - {instructor['day']} ({instructor['time']})"
                                }
                                for instructor in result
                            ]
                        }
                    ]
                ]
            }
        }
    ]
    
    
    messages.append({"text": {"text": ["Please select one of the options"]}})
    
    return {"fulfillmentMessages": messages}


def handle_appointment_save(parameters: dict, session_id: str):
    # Ensure you have valid parameters
    instructor = parameters.get("instructor")
    time_period = parameters.get("time-period")
    day = parameters.get("day")

    # Validate that all required parameters are present
    if not all([instructor, time_period, day]):
        print("Missing required parameters.")
        return {
            "fulfillmentText": "Error while booking appointment. Please provide all the necessary information."
        }

    # Extract start and end times from the time period
    try:
        start_time = re.findall(r'.*T(..:..)', time_period.get('startTime'))[0]
        start_time = datetime.strptime(start_time, "%H:%M").strftime("%I:%M").lstrip("0")
        
        end_time = re.findall(r'.*T(..:..)', time_period.get('endTime'))[0]
        end_time = datetime.strptime(end_time, "%H:%M").strftime("%I:%M").lstrip("0")
        
        time = start_time + '-' + end_time + " PM"
    except Exception as e:
        print(f"Error extracting time: {e}")
        return {
            "fulfillmentText": "Error while processing the time. Please try again."
        }

    # Log the extracted parameters for debugging
    print(f"Booking appointment with instructor: {instructor}, Time: {time}, Day: {day}")

    # Call the DB function to save the appointment
    try:
        message = db_helper.save_appointment_details(instructor=instructor.get('name'), time_period=time, day=day)
    except Exception as e:
        print(f"Error while saving appointment: {e}")
        return {
            "fulfillmentText": "Error while booking appointment. Please try again."
        }
    
    if message is None:
        print("No message returned from the database function.")
        return {
            "fulfillmentText": "Error while booking appointment. Please try again."
        }
    
    # Return the message to Dialogflow
    response = {
        "fulfillmentText": message
    }
    print(f"Response to Dialogflow: {response}")
    return response



@app.post("/webhook")
async def webhook_handler(request : Request):
    try:
        body = await request.json()
        print("Received Webhook Request:", json.dumps(body, indent=2))

        intent = body["queryResult"]["intent"]["displayName"]
        parameters = body["queryResult"]["parameters"]
        session_id = generic_helper.extract_session_id(str(body['session']))

        intent_handler_dict = {
            "attendance.report.fetch - Context: attendance_report" : handle_attendance_fetch,
            "apppointment.booking.helper - context : appointment_booking" : handle_appointment_booking,
            "appointment.details - context : appointment.booking" : handle_appointment_save
        }
        return intent_handler_dict[intent](parameters=parameters, session_id=session_id)
    
    except Exception as e:
        print("Error in Webhook:", str(e))
        raise HTTPException(status_code=400, detail=str(e))

def test_db_connection():
    try:
        print("🔄 Attempting to connect to the database...")
        connection = psycopg2.connect(DB_URL, sslmode="require")
        cursor = connection.cursor()
        cursor.execute("SELECT 1;")  # Simple test query
        result = cursor.fetchone()
        print(f"✅ Database connection successful! Result: {result}")
        cursor.close()
        connection.close()
    except Exception as e:
        print(f"❌ Database Connection Failed: {e}")

# Call this function at startup
test_db_connection()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
