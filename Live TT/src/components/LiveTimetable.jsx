import React, { useState } from "react";
import timetableData from "../data/timetable.json"; // JSON with schedule data
import logo from "./Logo_Black.png";       // Logo image
import "./LiveTimetable.css";                     // Import our custom CSS

const LiveTimetable = () => {
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [day, setDay] = useState("");

  const schedule = timetableData[day]?.[section] || [];

  const handleStart = () => {
    if (year && section && day) {
      setLoading(false);
    }
  };

  return loading ? (
    /* Selection Screen */
    <div className="selection-container">
      {/* Logo */}
      <img src={logo} alt="NEXLEARN" className="logo-image" />

      {/* Box containing the three dropdowns & button */}
      <div className="selection-box">
        {/* Year */}
        <label className="field-label">Select year*</label>
        <select
          className="dropdown-input"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">Select Year</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>

        {/* Section */}
        <label className="field-label">Select section*</label>
        <select
          className="dropdown-input"
          value={section}
          onChange={(e) => setSection(e.target.value)}
          disabled={!year}
        >
          <option value="">Select Section</option>
          {year === "1" && (
            <>
              <option value="s11">S11</option>
              <option value="s22">S22</option>
              <option value="s23">S23</option>
              <option value="g11">G11</option>
              <option value="g12">G12</option>
              <option value="g13">G13</option>
              <option value="g14">G14</option>
            </>
          )}
          {year !== "1" && (
            <>
              <option value="cs21">CS21</option>
              <option value="cs22">CS22</option>
              <option value="ec">EC</option>
            </>
          )}
        </select>

        {/* Day */}
        <label className="field-label">Select day*</label>
        <select
          className="dropdown-input"
          value={day}
          onChange={(e) => setDay(e.target.value)}
        >
          <option value="">Select Day</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
        </select>

        {/* Continue Button */}
        <button
          className="continue-button"
          onClick={handleStart}
          disabled={!year || !section || !day}
        >
          CONTINUE
        </button>
      </div>
    </div>
  ) : (
    /* Timetable Display After Selection */
    <div className="timetable-container">
      <h1 className="timetable-heading">
        {day}'s Timetable ({year} Year - {section})
      </h1>
      {schedule.length > 0 ? (
        <ul className="timetable-list">
          {schedule.map((event, index) => (
            <li key={index} className="timetable-item">
              <h3 className="timetable-subject">{event.subject}</h3>
              <p className="timetable-time">{event.time}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-schedule">No schedule available for {day}.</p>
      )}
    </div>
  );
};

export default LiveTimetable;
