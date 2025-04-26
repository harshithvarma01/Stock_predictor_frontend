import React, { useState } from "react";
import StockChart from "./components/StockChart";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [forecastedPrices, setForecastedPrices] = useState([]);
  const [forecastDates, setForecastDates] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("https://stock-forecasting-backend-1.onrender.com/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start_date: startDate, end_date: endDate }),
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error);
        return;
      }

      setForecastedPrices(result.forecasted_prices);
      setForecastDates(result.forecast_dates);
    } catch (err) {
      setError("Error fetching data");
    }
  };

  const minPrice = forecastedPrices.length > 0 ? Math.min(...forecastedPrices).toFixed(2) : 0;
  const maxPrice = forecastedPrices.length > 0 ? Math.max(...forecastedPrices).toFixed(2) : 0;
  const averagePrice = forecastedPrices.length > 0 ? (forecastedPrices.reduce((a, b) => a + b, 0) / forecastedPrices.length).toFixed(2) : 0;

  // Daily trends for the first 7 days
  const dailyTrends = forecastedPrices.slice(0, 7).map((price, index) => {
    if (index === 0) return { date: forecastDates[0], trend: "-" };
    const prevPrice = forecastedPrices[index - 1];
    return {
      date: forecastDates[index],
      trend: price > prevPrice ? "Up" : "Down",
    };
  });

  // Up/Down ratio for entire interval
  const upDownCount = forecastedPrices.reduce((acc, price, index) => {
    if (index === 0) return acc;
    const prevPrice = forecastedPrices[index - 1];
    if (price > prevPrice) acc.up++;
    else acc.down++;
    return acc;
  }, { up: 0, down: 0 });
  const totalDays = forecastedPrices.length - 1;
  const pieData = {
    labels: ["Up", "Down"],
    datasets: [
      {
        data: [upDownCount.up, upDownCount.down],
        backgroundColor: ["#4CAF50", "#F44336"],
        hoverOffset: 4,
      },
    ],
  };
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Up/Down Ratio" },
    },
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", backgroundColor: "#1a1a1a", color: "#fff" }}>
      <h1 style={{ color: "#fff" }}>STOCKY</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Start Date:
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required style={{ marginLeft: "10px" }} />
        </label>
        <label style={{ marginLeft: "15px" }}>
          End Date:
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required style={{ marginLeft: "10px" }} />
        </label>
        <button type="submit" style={{ marginLeft: "15px", padding: "5px 10px" }}>
          Forecast
        </button>
      </form>

      {error && <p style={{ color: "#F44336" }}>{error}</p>}

      {forecastedPrices.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <div style={{ backgroundColor: "#2c2c2c", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
            <h2 style={{ color: "#fff" }}>Analysis</h2>
            <p>Start Date: {startDate}</p>
            <p>End Date: {endDate}</p>
            <p>Min Price: ${minPrice}</p>
            <p>Max Price: ${maxPrice}</p>
            <p>Average Price: ${averagePrice}</p>
          </div>

          <h2 style={{ color: "#fff" }}>Interactive Price Chart</h2>
          <StockChart data={forecastedPrices} labels={forecastDates} />
          
          <div style={{ marginTop: "20px", backgroundColor: "#2c2c2c", padding: "15px", borderRadius: "8px" }}>
            <h3 style={{ color: "#fff" }}>Daily Trends</h3>
            {dailyTrends.map((trend, index) => (
              <p key={index} style={{ color: trend.trend === "Up" ? "#4CAF50" : trend.trend === "Down" ? "#F44336" : "#fff" }}>
                {trend.date}: {trend.trend}
              </p>
            ))}
          </div>

          <div style={{ marginTop: "20px", width: "300px", backgroundColor: "#2c2c2c", padding: "15px", borderRadius: "8px" }}>
            <h3 style={{ color: "#fff" }}>Up/Down Ratio</h3>
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;