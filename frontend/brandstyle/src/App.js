import './App.css';
import UrlInputForm from './UrlInputForm';

function App() {
  const handleUrlSubmit = (url) => {
    console.log("Submitting URL:", url);
    fetch('http://localhost:3000/scrape', {
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
        <pre>{JSON.stringify(scrapedData, null, 2)}</pre> 
      </div>}
    </div>
  );
}

export default App;
