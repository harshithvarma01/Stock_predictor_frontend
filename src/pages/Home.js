import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import StockChart from '../components/StockChart';
import PredictButton from '../components/PredictButton';

const Home = () => {
  const [stockData, setStockData] = useState([]);
  const [predictedData, setPredictedData] = useState([]);

  const handlePredict = () => {
    // Simulate prediction using the last close price + some growth
    const last = stockData[stockData.length - 1];
    if (!last) return;

    const base = parseFloat(last.Close);
    const fakePrediction = [];

    for (let i = 1; i <= 7; i++) {
      fakePrediction.push({
        Date: `Predicted Day ${i}`,
        Close: (base * (1 + i * 0.01)).toFixed(2), // +1%, +2%, ...
      });
    }

    setPredictedData(fakePrediction);
  };

  return (
    <div>
      <h1>Amazon Stock Predictor</h1>
      <FileUpload onDataParsed={setStockData} />
      {stockData.length > 0 && (
        <>
          <StockChart data={[...stockData, ...predictedData]} />
          <PredictButton onClick={handlePredict} />
        </>
      )}
    </div>
  );
};

export default Home;
