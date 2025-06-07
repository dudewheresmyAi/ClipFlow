const express = require('express');
const app = express();
app.use(express.json());

// This is the only route our backend needs for now
app.post('/api/get-clips', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set.");
    }

    const { transcript } = req.body;

    const prompt = `You are an expert viral video producer. Your job is to find catchy, shareable moments in a long video transcript. Here is the transcript: """${transcript}""" Analyze the text and identify the 5 most compelling moments that would work as standalone short-form videos. A great moment is a strong hook, a surprising statement, or a key takeaway. Return your answer ONLY in JSON format. For each moment, provide the start and end timestamps, a suggested catchy title (under 50 characters), and a 1-2 sentence explanation of why it's a good clip. Example format: [{"start_time": "00:01:23", "end_time": "00:01:55", "title": "The Coffee Habit Myth", "reason": "This is a strong, controversial hook."}]`;

    // Using node-fetch requires this dynamic import in modern Node.js
    const fetch = (await import('node-fetch')).default;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("API Error Response:", errorBody);
        throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0].content) {
        console.error("Invalid API response structure:", data);
        throw new Error("Invalid response structure from API.");
    }

    const results = data.candidates[0].content.parts[0].text;
    res.json({ success: true, clips: results });

  } catch (error) {
    console.error("Caught an error in /api/get-clips:", error);
    res.status(500).json({ success: false, message: 'Something went wrong on the server.' });
  }
});

app.listen(3000, () => console.log('Backend server running on port 3000!'));