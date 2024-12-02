//This is the main app file for the frontend website.
//To design the frontend I decided to use react and JS due to my knowledge with them
//This website is composed from 3 basic components: 
//1. app.js - the main app file - where the data fetching function from the backend is and the activating of the other components.
//2. InputForm.js - a component containing the input form for the ip address, timespan and interval
//3. chart.js - a component for presenting the chart of the returned data from the backend, using chartjs
//Also, all the styling of the website is processed in the app.css file.

import React, { useState } from "react";
import InputForm from "./InputForm";
import Chart from "./Chart";
import "./App.css";


function App() {
  //Initialize and defaults for the variables
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartTitle, setChartTitle] = useState("");

  //The function for fetching the data from the backend, passed to and activated in the inputform.js file. 
  const fetchData = async (ip, startT, endT, interval) => {
    setLoading(true); //Show loading spinner
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/get-cpu-usage?ip_address=${ip}&start_time=${startT}&end_time=${endT}&interval=${interval}`
      );
      const data = await response.json();
      setChartData(data); // Update the chart with the fetched data

      //Formating of the dates for the chart title
      const startDate = new Date(startT).toLocaleString();
      const endDate = new Date(endT).toLocaleString();
      setChartTitle(`CPU Usage from ${startDate} to ${endDate}`); 
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);//stop showing loading spinner
    }
  };  
  return (
    <div className="App">
      <h1>For CPU Usage Chart - Enter The Following Details</h1>
      <InputForm onFetchData={fetchData} /> {/*The form for the user input */}
      {loading && <div className="loading-spinner"></div>}{/*The loading spinner */}
      {!loading && chartData && <Chart data={chartData} title={chartTitle} />}{/*The chart showing the data */}
    </div>
  );
}

export default App;
