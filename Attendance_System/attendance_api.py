from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Flask app
app = Flask(__name__)

# Firebase setup
cred = credentials.Certificate("firebase_credentials.json")  # Ensure this file exists!
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/')
def home():
    return "Attendance System API is running!"

# API to mark attendance
@app.route('/mark_attendance', methods=['POST'])
def mark_attendance():
    try:
        data = request.json  # Get JSON data from request
        roll_number = data.get("roll_number")
        name = data.get("name")
        date_today = data.get("date")

        if not roll_number or not name or not date_today:
            return jsonify({"error": "Missing required fields"}), 400

        # Reference to Firestore collection
        attendance_ref = db.collection("attendance")
        
        # Check if already marked
        existing_entries = attendance_ref.where("roll_number", "==", roll_number).where("date", "==", date_today).get()

        if existing_entries:
            return jsonify({"message": "Attendance already marked"}), 200

        # Add new attendance entry
        attendance_ref.add({
            "roll_number": roll_number,
            "name": name,
            "date": date_today
        })

        return jsonify({"message": "Attendance marked successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)  # Run on localhost:5000
