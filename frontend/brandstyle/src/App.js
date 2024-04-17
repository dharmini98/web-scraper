import React, { useState } from 'react';
import './App.css';
import UrlInputForm from './UrlForm';
function ColorPalette({ colors }) {
  return (
    <div className="color-palette">
      {colors.map((color, index) => (
        <div key={index} className="color-swatch" style={{ backgroundColor: `rgb(${color.join(',')})` }} />
      ))}
    </div>
  );
}
function App() {
  const [scrapedData, setScrapedData] = useState(null);
  const handleUrlSubmit = (url) => {
    console.log("Submitting URL:", url);
    fetch('http://localhost:5000/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url }) 
    })
    .then(response => response.json()) 
    .then(data => {
      setScrapedData(data);
      console.log("Scraped Data:", data);
    })
    .catch(error => {
      console.error("Error scraping data:", error);
      setScrapedData(null);
    });
  };
  return(
    <div>
      <h1>Welcome to BrandStyle</h1>
      <UrlInputForm onUrlSubmit={handleUrlSubmit} />
      {scrapedData && <div className="results">
        <h2>Scraped Data</h2>
        <ColorPalette colors={scrapedData.topColors} />
        <pre>{JSON.stringify(scrapedData, null, 2)}</pre> 
      </div>}
    </div>
  );
}

export default App;
