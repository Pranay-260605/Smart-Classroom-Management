import mysql.connector
global db_config

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'pgoel2010',
    'database': 'school_management_system'
}

def get_attendance(subject : str, roll : int):
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        roll_query = "SELECT DISTINCT roll_no FROM attendance_report"
        cursor.execute(roll_query)
        roll_numbers = {roll[0] for roll in cursor.fetchall()}

        subject_query = "SELECT DISTINCT subject FROM attendance_report"
        cursor.execute(subject_query)
        subjects = {subject[0].lower() for subject in cursor.fetchall()}
        
        if roll not in roll_numbers:
            return f"There is no entry for roll number : {roll}. Please provide correct roll number."
        if subject not in subjects:
            return f"No entry found for {subject}. Please provide correct subject."
        
        query = "SELECT attendance_percentage FROM attendance_report WHERE roll_no = %s AND subject = %s"
        cursor.execute(query, (roll, subject,))
        result = cursor.fetchone()

        if result:
            attendance = result[0]
            return f"Attendance for {subject}: {attendance}"
        else:
            return None


    except mysql.connector.Error as err:
        print(f"Error : {err}")

    finally:
        if cursor:
            cursor.close()

def get_instructor_details(subject : str):
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        query = "SELECT DISTINCT instructor_name, day, time FROM faculty_slots WHERE LOWER(subject) = LOWER(%s)"
        cursor.execute(query, (subject.lower(),))

        rows = cursor.fetchall()
        if not rows:
            print("No data found for the given subject.")
            return None
        columns = ['Instructor_Name', 'Day', 'Time']
        result = [dict(zip(columns, row)) for row in rows]

        return result
    
    except mysql.connector.Error as err:
        print(f"Error : {err}")
    
    finally:
        if cursor:
            cursor.close()

def save_appointment_details(instructor: str, time_period: str, day: str):
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        
        instructor_id_query = "SELECT instructor_id FROM instructor_details WHERE LOWER(instructor_name) = LOWER(%s)"
        cursor.execute(instructor_id_query, (instructor.lower(),))

        result = cursor.fetchone()
        if result:
            id = result[0]
        else:
            return None
        
        query = "SELECT * FROM faculty_slots WHERE instructor_id = %s AND LOWER(day) = LOWER(%s) AND LOWER(time) = Lower(%s)"
        cursor.execute(query, (id, day.lower(), time_period.lower(),))
        
        row = cursor.fetchall()
        if not row:
            return None
        
        columns = ['instructor_id', 'instructor_name', 'subject', 'day', 'time']
        result = [dict(zip(columns, data)) for data in row]
        
        insertion_query = "INSERT INTO appointment_details VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(
            insertion_query,
            (result[0].get(columns[0]), result[0].get(columns[1]), result[0].get(columns[2]), result[0].get(columns[3]), result[0].get(columns[4]))
        )

        message = f"Appointment booked with {result[0].get(columns[1])} on {day} at {time_period}"
        return message

    except mysql.connector.Error as err:
        print(f"Error : {err}]")
    
    finally:
        if cursor:
            cursor.close()