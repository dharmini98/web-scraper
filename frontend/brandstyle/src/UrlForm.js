import React, { useState } from 'react';

function UrlInputForm({ onUrlSubmit }) {
    const [url, setUrl] = useState('');
    
    const handleSubmit = (event) => {
        event.preventDefault();
        onUrlSubmit(url);
      };
      return (
        <form onSubmit={handleSubmit}>
          <label htmlFor="urlInput">Enter Website URL: </label>
          <input
            id="urlInput"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
          />
          <button type="submit">Extract</button>
        </form>
      );
    }
    
    export default UrlInputForm;    