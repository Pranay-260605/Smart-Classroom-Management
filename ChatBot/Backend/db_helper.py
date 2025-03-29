import psycopg2
import psycopg2.extras

DB_URL = "postgresql://postgres.iocnbbqkijfuqjuikmfn:pgoel2010@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"

def get_attendance(subject: str, roll: int):
    connection = None
    cursor = None
    try:
        connection = psycopg2.connect(DB_URL, sslmode="require")
        cursor = connection.cursor()
        print("Connected successfully!")

        roll_query = "SELECT DISTINCT roll_no FROM attendance_report"
        cursor.execute(roll_query)
        roll_numbers = {row[0] for row in cursor.fetchall()}

        subject_query = "SELECT DISTINCT subject FROM attendance_report"
        cursor.execute(subject_query)
        print("Query executed")
        subjects = {row[0].lower() for row in cursor.fetchall()}

        if roll not in roll_numbers:
            return f"There is no entry for roll number: {roll}. Please provide the correct roll number."
        if subject.lower() not in subjects:
            return f"No entry found for {subject}. Please provide the correct subject."

        query = "SELECT attendance_percentage FROM attendance_report WHERE roll_no = %s AND LOWER(subject) = LOWER(%s)"
        cursor.execute(query, (roll, subject))
        result = cursor.fetchone()
        print(result)
        return f"Attendance for {subject}: {result[0]}" if result else None

    except psycopg2.Error:
        print("here")
        return None
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def get_instructor_details(subject: str):
    try:
        connection = psycopg2.connect(DB_URL, sslmode="require")
        cursor = connection.cursor(cursor_factory=psycopg2.extras.DictCursor)

        query = '''
            SELECT instructor_name, day, time 
            FROM instructor_details 
            JOIN faculty_slots ON instructor_details.instructor_id = faculty_slots.instructor_id
            WHERE LOWER(subject) = LOWER(%s)
        '''
        cursor.execute(query, (subject,))
        rows = cursor.fetchall()

        return [dict(row) for row in rows] if rows else None

    except psycopg2.Error:
        return None
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def save_appointment_details(instructor: str, time_period: str, day: str):
    try:
        connection = psycopg2.connect(DB_URL, sslmode="require")
        cursor = connection.cursor(cursor_factory=psycopg2.extras.DictCursor)

        print("query execting")
        instructor_id_query = "SELECT instructor_id FROM instructor_details WHERE LOWER(instructor_name) = LOWER(%s)"
        cursor.execute(instructor_id_query, (instructor,))
        print("query executed")
        result = cursor.fetchone()

        if not result:
            return None

        instructor_id = result['instructor_id']
        print(instructor_id)

        query = "SELECT * FROM faculty_slots WHERE instructor_id = %s AND LOWER(day) = LOWER(%s) AND LOWER(time) = LOWER(%s)"
        cursor.execute(query, (instructor_id, day, time_period))
        row = cursor.fetchall()
        print(instructor_id, day, time_period)
        print(row)
        if not row:
            return None

        result_data = [dict(data) for data in row]

        insertion_query = "INSERT INTO appointment_details VALUES (%s, %s, %s)"
        cursor.execute(
            insertion_query,
            (result_data[0]['instructor_id'], result_data[0]['day'], result_data[0]['time'])
        )
        connection.commit()
        print("here")
        return f"Appointment booked with {instructor} on {day} at {time_period}"

    except psycopg2.Error:
        print("iNSIDE EXCEPT")
        return None
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
