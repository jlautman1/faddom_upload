//InputForm.js - a component containing the input form for the ip address, timespan and interval

import React, { useState } from "react";

function InputForm({ onFetchData }) {
  //Initialize and defaults for the variables
  const [ip, setIp] = useState("");
  const [timePeriod, setTimePeriod] = useState("hours");
  const [interval, setInterval] = useState(300);
  const [last, setlast] = useState(1); // Default to last 1 hour
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  //HandleSubmit function, which fetches info from the backend when acitvated when the button is pressed
  const handleSubmit = (e) => {
    e.preventDefault();//To prevent the submission from reloading the entire page

    let startT, endT;
    const now = new Date();
    endT = now.toISOString();

    if (timePeriod === "custom") {//In the case when the time period chosed is custom
      startT = new Date(customStart).toISOString();
      endT = new Date(customEnd).toISOString();
    } else if (timePeriod === "hours") {//In the case when the time period chosen is Last hours
      startT = new Date(now - last * 60 * 60 * 1000).toISOString();
    } else if (timePeriod === "days") {//In the case when the time period chosen is Last days
      startT = new Date(now - last*24 * 60 * 60 * 1000).toISOString();
    }

    onFetchData(ip, startT, endT, interval);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* User input fields for IP, time period, and interval */}
      <label>
        IP Address:
        <input
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          required
        />
      </label>
      <label>
        Time Period:
        <select
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
        >
          <option value="hours">Last Hours</option>
          <option value="days">Last days</option>
          <option value="custom">Custom Period</option>
        </select>
      </label>
       {/* Additional inputs for hours/days/custom time */}
      {timePeriod === "hours" && (
        <label>
          Number of Hours:
          <input
            type="number"
            value={last}
            onChange={(e) => setlast(Number(e.target.value))}
            min="1"
          />
        </label>
      )}
      {timePeriod === "days" && (
        <label>
          Number of Days:
          <input
            type="number"
            value={last}
            onChange={(e) => setlast(Number(e.target.value))}
            min="1"
          />
        </label>
      )}
      {timePeriod === "custom" && (
        <div>
          <label>
            Start Date and Time:
            <input
              type="datetime-local"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              required
            />
          </label>
          <label>
            End Date and Time:
            <input
              type="datetime-local"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              required
            />
          </label>
        </div>
      )}
      <label>
        Interval (Seconds):
        <input
          type="number"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          required
        />
      </label>
      <button type="submit">Load Chart</button>
    </form>
  );
}

export default InputForm;
