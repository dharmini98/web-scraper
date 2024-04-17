import React, { useState } from 'react';
import './App.css';
import UrlInputForm from './UrlForm';
function ColorPalette({ colors }) {
  return (
    <div>
    <h2>Color Palette</h2>
    <div className="color-palette">
      {colors.map((color, index) => (
        <div key={index} className="color-swatch" style={{ backgroundColor: `rgb(${color.join(',')})` }} />
      ))}
    </div>
    </div>
  );
}
function Logo({ logoData , svgDefinitions}) {
  console.log('Logo Data:', logoData); 
  console.log('SVGDefinitions',svgDefinitions);
  if (!logoData|| logoData.trim() === '') {
    return <p>No logo data provided.</p>;
  }
  const determineLogoType = (data) => {
    if (data.includes('<svg')) {
      return 'svgMarkup';
    } else if (data.startsWith('data:image')) {
      return 'base64';
    } else if (data.startsWith('http')) {
      return 'directUrl';
    } 
    return 'unknown';
  };

  const logoType = determineLogoType(logoData);

  switch (logoType) {
    case 'svgMarkup':
      const combinedSvg = `${svgDefinitions || ''}${logoData}`;
      return <div className='logo-container' dangerouslySetInnerHTML={{ __html: combinedSvg }} />;
    case 'base64':
      return <img className='logo-img' src={logoData} alt="Logo" />;
    case 'directUrl':
      return <img className='logo-img' src={logoData} alt="Logo" />;
    case 'unknown':
        console.error('Unknown logo data type:', logoData);
        return <p>Logo format is not recognized.</p>;
    default:
      return <p>No logo found.</p>;
  }
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
        <Logo logoData={scrapedData.logo} svgDefinitions={scrapedData.svgDefinitions} />
        <pre>{JSON.stringify(scrapedData, null, 2)}</pre> 
      </div>}
    </div>
  );
}

export default App;
