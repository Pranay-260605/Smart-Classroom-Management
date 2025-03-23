import React, { useEffect, useState } from "react";
import "./LiveTimetable.css";

const Timetable = ({ selectedSection }) => {
    const [timetable, setTimetable] = useState([]);

    useEffect(() => {
        import("./timetable.json")
            .then((data) => {
                setTimetable(data[selectedSection] || []);
            })
            .catch((error) => console.error("Error loading timetable:", error));
    }, [selectedSection]);

    return (
        <div className="timetable-container">
            {timetable.length > 0 ? (
                <table className="timetable-table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Monday</th>
                            <th>Tuesday</th>
                            <th>Wednesday</th>
                            <th>Thursday</th>
                            <th>Friday</th>
                        </tr>
                    </thead>
                    <tbody>
                        {timetable.map((row, index) => (
                            <tr key={index}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Please select a section to view the timetable.</p>
            )}
        </div>
    );
};

export default Timetable;
