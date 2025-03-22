import tkinter as tk
import util  
import cv2
from PIL import Image, ImageTk
import os
import subprocess
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

class App:
    def __init__(self):
        self.main_window = tk.Tk()
        self.main_window.geometry("1050x520+350+100")
        self.main_window.title("Attendance System")

        self.db_dir = './People'  
        self.firebase_init()  # Initialize Firebase

        # Login Button
        self.login_button_main_window = util.get_button(self.main_window, "Sign In", "green", self.login)
        self.login_button_main_window.place(x=750, y=300)

        # Webcam Label
        self.webcam_label = util.get_img_label(self.main_window)
        self.webcam_label.place(x=10, y=0, width=700, height=500)

        # Initialize Webcam
        self.add_webcam()

    def firebase_init(self):
        """Initialize Firebase Firestore connection"""
        cred = credentials.Certificate("firebase_credentials.json")  # Your Firebase credentials
        firebase_admin.initialize_app(cred)
        self.db = firestore.client()  # Firestore database instance

    def add_webcam(self):
        """Start webcam feed"""
        self.cap = cv2.VideoCapture(0)  # Try webcam index 0
        if not self.cap.isOpened():
            print("❌ Webcam not found on index 0, trying index 1...")
            self.cap = cv2.VideoCapture(1)  # Try another index
        
        if not self.cap.isOpened():
            print("❌ Webcam not found on index 1, trying index 2...")
            self.cap = cv2.VideoCapture(2)  # Try another index

        if not self.cap.isOpened():
            util.msg_box("Error", "❌ Could not open webcam!")
            return
        
        print("✅ Webcam successfully opened!")

        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)  # Reduce frame buffering
        self.process_webcam()

    def process_webcam(self):
        """Process and display webcam feed"""
        ret, frame = self.cap.read()
        if not ret:
            print("⚠️ Warning: Failed to capture frame!")
            return

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        img_pil = Image.fromarray(frame_rgb)
        imgtk = ImageTk.PhotoImage(image=img_pil)

        self.webcam_label.imgtk = imgtk
        self.webcam_label.configure(image=imgtk)
        self.webcam_label.after(10, self.process_webcam)  # Faster update time

    def login(self):
        """Perform face recognition and mark attendance"""
        now = datetime.now()
        current_time = now.strftime("%H:%M")
        date_today = now.strftime("%Y-%m-%d")

        # **Only allow attendance between 7:00 AM - 7:15 AM**
        start_time = "07:00"
        end_time = "07:15"
        #if not (start_time <= current_time <= end_time):
            #util.msg_box("Attendance Denied", "Attendance time is over.")
            #return

        # **Capture image for recognition**
        unknown_img_path = './.tmp.jpg'
        ret, frame = self.cap.read()
        if not ret:
            util.msg_box("Error", "Failed to capture image!")
            return

        cv2.imwrite(unknown_img_path, frame)

        # **Recognize face using face_recognition**
        try:
            output = subprocess.check_output(['face_recognition', self.db_dir, unknown_img_path]).decode("utf-8").strip()
        except Exception as e:
            util.msg_box("Error", f"Face recognition failed: {str(e)}")
            return
        finally:
            os.remove(unknown_img_path)

        # **Check recognition result**
        if "unknown_person" in output or output == "":
            util.msg_box("Access Denied", "Unknown person, not in database.")
            return

        recognized_name = output.split(",")[-1].strip()  # Extract matched file name
        name_with_roll = os.path.splitext(recognized_name)[0]

        if "_" in name_with_roll:
            name, roll_number = name_with_roll.rsplit("_", 1)  # Split into Name & Roll No.
            name = name.capitalize()
        else:
            util.msg_box("Error", "Invalid file naming format!")
            return

        # **Check Firebase for duplicate entries**
        attendance_ref = self.db.collection("attendance")
        existing_entries = attendance_ref.where("roll_number", "==", roll_number).where("date", "==", date_today).get()

        if existing_entries:
            util.msg_box("Duplicate Entry", f"{name}, you have already marked attendance today.")
            return

        # **Store attendance in Firebase**
        attendance_ref.add({
            "name": name,
            "roll_number": roll_number,
            "timestamp": now.strftime("%Y-%m-%d %H:%M:%S"),
            "date": date_today
        })

        util.msg_box("Attendance Registered", f"Welcome {name}! Your attendance has been recorded.")

    def start(self):
        self.main_window.mainloop()
        if hasattr(self, "cap") and self.cap.isOpened():
            self.cap.release()  # Release webcam when app closes

if __name__ == "__main__":
    app = App()
    app.start()
