import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Title);

const StockChart = ({ data, labels }) => {
  if (!data || data.length === 0) return <p>No data available.</p>;

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Forecasted Close Price",
        data,
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Forecasted Stock Prices" },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default StockChart;
  