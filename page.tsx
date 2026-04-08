"use client";

import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
} from "date-fns";

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [note, setNote] = useState("");
  const [savedNotes, setSavedNotes] = useState({});

  // Load from localStorage
  useEffect(() => {
    const data = localStorage.getItem("notes");
    if (data) setSavedNotes(JSON.parse(data));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(savedNotes));
  }, [savedNotes]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const handleClick = (day) => {
    setSelectedDate(day);
    const key = format(day, "yyyy-MM-dd");
    setNote(savedNotes[key] || "");
  };

  const saveNote = () => {
    if (selectedDate && note.trim() !== "") {
      const key = format(selectedDate, "yyyy-MM-dd");
      setSavedNotes({ ...savedNotes, [key]: note });
      setNote("");
    }
  };

  const deleteNote = (date) => {
    const updated = { ...savedNotes };
    delete updated[date];
    setSavedNotes(updated);
    setNote("");
  };

  const selectedKey = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : null;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      
      {/* Header */}
      <h2 style={{ textAlign: "center" }}>
        {format(currentDate, "MMMM yyyy")}
      </h2>

      {/* Month Controls */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <button onClick={() => setCurrentDate(addMonths(currentDate, -1))}>
          ⬅ Prev
        </button>
        <button
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          style={{ marginLeft: "10px" }}
        >
          Next ➡
        </button>
      </div>

      {/* Week Days */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Calendar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          return (
            <div
              key={key}
              onClick={() => handleClick(day)}
              style={{
                padding: "10px",
                textAlign: "center",
                borderRadius: "6px",
                cursor: "pointer",
                background:
                  selectedDate &&
                  key === format(selectedDate, "yyyy-MM-dd")
                    ? "#2196F3"
                    : "#eee",
                color:
                  selectedDate &&
                  key === format(selectedDate, "yyyy-MM-dd")
                    ? "white"
                    : "black",
              }}
            >
              {format(day, "d")}
              {savedNotes[key] && (
                <div style={{ fontSize: "10px", color: "green" }}>
                  • Note
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Notes Section */}
      <div style={{ marginTop: "20px" }}>
        <h3>Add / Edit Note</h3>

        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write something..."
          style={{ padding: "10px", width: "70%" }}
        />

        <button onClick={saveNote} style={{ padding: "10px", marginLeft: "5px" }}>
          Save
        </button>

        {selectedKey && savedNotes[selectedKey] && (
          <button
            onClick={() => deleteNote(selectedKey)}
            style={{ padding: "10px", marginLeft: "5px", background: "red", color: "white" }}
          >
            Delete
          </button>
        )}

        {/* Show Selected Note */}
        {selectedKey && savedNotes[selectedKey] && (
          <div style={{ marginTop: "10px" }}>
            <b>Saved Note:</b> {savedNotes[selectedKey]}
          </div>
        )}
      </div>
    </div>
  );
}