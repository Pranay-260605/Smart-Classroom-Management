import React from "react";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Timetable() {
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    const fetchTimetable = async () => {
      const querySnapshot = await getDocs(collection(db, "timetable"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTimetable(data);
    };
    fetchTimetable();
  }, []);

  return (
    <table className="w-full border-collapse border border-gray-400">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">Day</th>
          <th className="border p-2">Time</th>
          <th className="border p-2">Course</th>
          <th className="border p-2">Instructor</th>
          <th className="border p-2">Room</th>
          <th className="border p-2">Stream</th>
        </tr>
      </thead>
      <tbody>
        {timetable.map((entry) => (
          <tr key={entry.id} className="text-center bg-white">
            <td className="border p-2">{entry.day}</td>
            <td className="border p-2">{entry.time}</td>
            <td className="border p-2">{entry.course}</td>
            <td className="border p-2">{entry.instructor}</td>
            <td className="border p-2">{entry.room}</td>
            <td className="border p-2">{entry.stream}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
