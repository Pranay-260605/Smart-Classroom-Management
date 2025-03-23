import React from "react";
import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function Admin() {
  const [newEntry, setNewEntry] = useState({
    day: "",
    time: "",
    course: "",
    instructor: "",
    room: "",
    stream: "",
  });

  const handleChange = (e) => {
    setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "timetable"), newEntry);
    alert("Timetable entry added!");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Admin Panel</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        {["day", "time", "course", "instructor", "room", "stream"].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field}
            value={newEntry[field]}
            onChange={handleChange}
            className="block w-full p-2 border rounded my-2"
          />
        ))}
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Add Entry</button>
      </form>
    </div>
  );
}
