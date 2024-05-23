import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { Chart as ChartJS, registerables } from "chart.js";

ChartJS.register(...registerables);

const WebSocketChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Synthetic",
        data: [],
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        fill: false,
      },
      {
        label: "Symbol Ltp",
        data: [],
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        fill: false,
      },
    ],
  });

  const wsRef = useRef(null);

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:8080/ws");
    wsRef.current.onmessage = (event) => {
      const csvDataString = event.data;
      const csvData = JSON.parse(csvDataString);
      console.log("heklloooooooooooooooooooooooo")
      updateChartData(csvData);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);



  const updateChartData = (csvData) => {
    const timestamps = [];
    const syntheticFutures = [];
    const symbolLTP = [];
    const pePrices = [];
   console.log(csvData,"csvDat-------->>>>>>>.")
    for (let i = 1; i < csvData.length; i++) {
     // console.log(csvData.length,csvData[0][1])
      const row = csvData[i];
      //console.log(row,"row-------------")
      if (row.length < 7) continue; // Ensure there are enough columns
      
      if(!timestamps.includes(row[0]))
        {
          console.log("jjjjjjjjjjjjjjjjjjjjjj",)
      timestamps.push(row[0]); // Assuming timestamp format is in HH:MM:SS
      syntheticFutures.push(parseFloat(row[3]));
      symbolLTP.push(parseFloat(row[2]));
   
        }
    }
    console.log(syntheticFutures,"timestamp-----")
    
    setChartData((prevData) => ({
      labels: [ ...timestamps],
      datasets: [
        {
          ...prevData.datasets[0],
          data: [ ...syntheticFutures],
          borderColor:'red'
        },
        {
          ...prevData.datasets[1],
          data: [ ...symbolLTP],
          borderColor:'black',
        },
      ],
    }));
  };

  const options = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "minute",
        },
        title: {
          display: true,
          text: "Timestamp",
        },
      },
      y: {
        ticks: {
          callback: (value) => value.toLocaleString(),
        },
        title: {
          display: true,
          text: "Price",
        },
      },
    },
  };

  return (
    <div>
      <h1>WebSocket Data Graph</h1>
      <Line data={chartData}/>
    </div>
  );
};

export default WebSocketChart;
