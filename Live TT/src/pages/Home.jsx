import React from "react";
import Timetable from "../components/Timetable";

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Live Timetable</h1>
      <Timetable />
    </div>
  );
}
