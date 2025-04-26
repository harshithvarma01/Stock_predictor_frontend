// src/components/PredictButton.js
import React from 'react';

const PredictButton = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '10px 20px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        marginTop: '20px',
      }}
    >
      Predict Trend 📈
    </button>
  );
};

export default PredictButton;
