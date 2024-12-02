//chart.js - a component for presenting the chart of the returned data from the backend, using chartjs

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

//register manually the chartJS properties
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


function Chart({ data, title }) {
  //Handle the data from the backend
  const labels = data.map((point) => new Date(point.Timestamp));
  const cpuUsage = data.map((point) => point.Average);

  //Implement the data into the chart
  const chartdata = {
    labels: labels,
    datasets: [
      {
        label: "CPU Usage (%)",
        data: cpuUsage,
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#333",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
          align: "center",
          color: "#333",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        ticks: {
          callback: function (value, index) {
            const date = labels[index];
            const prevDate = labels[index - 1];
            // Show the date for new days, otherwise show time
            if (
              date instanceof Date &&
              prevDate &&
              date.getDate() !== prevDate.getDate()
            ) {
              return date.toLocaleDateString([], { month: "short", day: "numeric" });
            }
            return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          },
          maxRotation: 45, 
          minRotation: 0,
        },
      },
      y: {
        title: {
          display: true,
          text: "CPU Usage (%)",
        },
        min: 0.5,
        max: 5,
        ticks: {
          stepSize: 0.5,
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <Line data={chartdata} options={options} />
    </div>
  );
}

export default Chart;
