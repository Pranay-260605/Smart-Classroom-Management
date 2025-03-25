from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import uvicorn
import generic_helper
import db_helper
import re
from datetime import datetime


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

    # Rich Content format for Dialogflow Messenger
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
                                    "text": f"{instructor['Instructor_Name']} - {instructor['Day']} ({instructor['Time']})"
                                }
                                for instructor in result
                            ]
                        }
                    ]
                ]
            }
        }
    ]

    messages.append({"text": {"text": ["Please select one of the option"]}})
    return {"fulfillmentMessages": messages}

def handle_appointment_save(parameters: dict, session_id: str):
    instructor = parameters.get("instructor")
    time_period = parameters.get("time-period")
    start_time = re.findall(r'.*T(..:..)', time_period.get('startTime'))[0]
    start_time = datetime.strptime(start_time, "%H:%M").strftime("%I:%M").lstrip("0")
    end_time = re.findall(r'.*T(..:..)', time_period.get('endTime'))[0]
    end_time = datetime.strptime(end_time, "%H:%M").strftime("%I:%M").lstrip("0")
    time = start_time + '-' + end_time + " PM"

    day = parameters.get("day")

    if not all([instructor, time, day]):
        return {
            "fulfillmentText": "Error while booking appointment. Please try again."
        }
    
    message = db_helper.save_appointment_details(instructor=instructor.get('name'), time_period=time, day=day)
    
    if message is None:
        return {
            "fulfillmentText": "Error while booking appointment. Please try again."
        }
    
    return {
        "fulfillmentText": message
    }


@app.post("/webhook")
async def webhook_handler(request : Request):
    try:
        body = await request.json()

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
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)