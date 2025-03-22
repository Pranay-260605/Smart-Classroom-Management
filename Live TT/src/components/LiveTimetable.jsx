import React from "react";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import timetableData from "../data/timetable.json"; // Store JSON in `src/data/timetable.json`

const LiveTimetable = () => {
  const today = new Date().toLocaleString("en-US", { weekday: "long" }); // Get current day
  const schedule = timetableData[today] || {}; // Get today's schedule

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center text-white mb-6">
        {today}'s Timetable
      </h1>
      <VerticalTimeline>
        {Object.keys(schedule).map((branch) => (
          schedule[branch].map((event, index) => (
            <VerticalTimelineElement
              key={index}
              date={event.time}
              iconStyle={{ background: "#007bff", color: "#fff" }}
            >
              <h3 className="text-lg font-bold">{event.subject}</h3>
              <p className="text-sm">{branch}</p>
            </VerticalTimelineElement>
          ))
        ))}
      </VerticalTimeline>
    </div>
  );
};

export default LiveTimetable;
