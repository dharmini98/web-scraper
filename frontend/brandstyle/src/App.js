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
 
  const renderLogo = () => {
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
};
return (
  <div>
    <h2>Brand Logo</h2>
    {renderLogo()}
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
  const getUniqueHeadlines = (headlines) => {
    return [...new Set(headlines)];
  };

  return(
    <div>
      <h1 className="website-heading">Welcome to BrandStyle</h1>
      <UrlInputForm onUrlSubmit={handleUrlSubmit} />
      {scrapedData && <div className="results">
        <h2 className="brand-title">Title: {scrapedData.title}</h2>
        <h3 className="brand-headline">Sub-Heading: {getUniqueHeadlines(scrapedData.headlines)[0]}</h3>
        <ColorPalette colors={scrapedData.topColors} />
        <Logo logoData={scrapedData.logo} svgDefinitions={scrapedData.svgDefinitions} />
        <h4 className="brand-typography">Typography: {scrapedData.typography}</h4>
        <div className="brand-cta">
            <h5>Call-To-Action Style:</h5>
            <div style={{
              backgroundColor: scrapedData.ctaStyles.backgroundColor,
              color: scrapedData.ctaStyles.textColor +'!important',
              borderRadius: scrapedData.ctaStyles.borderRadius.includes('px')? scrapedData.ctaStyles.borderRadius: `${scrapedData.ctaStyles.borderRadius}px`,
              padding: '10px', 
              display: 'inline-block', 
              
            }}>
              Example Button
            </div>
          </div>
      </div>}
    </div>
  );
}

export default App;
