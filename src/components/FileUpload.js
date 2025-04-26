// src/components/FileUpload.js
import React from 'react';
import Papa from 'papaparse';

const FileUpload = ({ onDataParsed }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          onDataParsed(results.data);
        },
      });
    }
  };

  return (
    <div>
      <h3>Upload Amazon CSV File</h3>
      <input type="file" accept=".csv" onChange={handleFileChange} />
    </div>
  );
};

export default FileUpload;
