import React, { useState } from 'react';
import './App.css'; // We'll use this later for styling

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [clips, setClips] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    setClips('');

    // This is a placeholder for the transcript for now.
    const transcript = "Hello everyone and welcome to my channel. Today we are going to talk about the science of a perfect cup of coffee. Many people think you need expensive equipment, but that is a complete myth. The real secret is actually the water temperature, it should be precisely 200 degrees Fahrenheit. Any hotter and you burn the grounds, any cooler and you don't extract enough flavor. Let's dive into why that is. Later on, I'll also show you my favorite beans.";

    try {
      const response = await fetch('https://a7526879-bd54-4b86-84fb-afb2601bf33a-00-37ohl6qrqcpf2.pike.replit.dev/api/get-clips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: transcript })
      });

      const data = await response.json();

      if (data.success) {
        // The response from the AI is a string, so we parse it into a real JSON object
        const parsedClips = JSON.parse(data.clips);
        // We format it nicely to display on the page
        setClips(JSON.stringify(parsedClips, null, 2));
      } else {
        setError(data.message || 'An unknown error occurred.');
      }
    } catch (err) {
      setError('Failed to fetch from the API. Is the server running?');
      console.error(err);
    }

    setIsLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>ClipFlow</h1>
        <p>Turn one video into dozens of viral clips.</p>
        <button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Finding Clips...' : '✨ Generate Clips From Demo Video'}
        </button>

        {error && <div className="error-message">{error}</div>}

        {clips && (
          <div className="results-container">
            <h2>Suggested Clips:</h2>
            <pre>{clips}</pre>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;