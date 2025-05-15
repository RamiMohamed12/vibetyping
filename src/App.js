import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [lineCount, setLineCount] = useState(1); // Textarea always has at least 1 line
  const [wpm, setWpm] = useState(0);

  const startTimeRef = useRef(null); // To store the time when typing started
  const typingStartedRef = useRef(false); // To track if typing has commenced

  const calculateStats = (currentText) => {
    // Word Count
    const words = currentText.trim() === '' ? [] : currentText.trim().split(/\s+/);
    setWordCount(words.length);

    // Line Count
    const lines = currentText.split('\n');
    setLineCount(lines.length);

    // WPM Calculation
    if (words.length > 0 && typingStartedRef.current && startTimeRef.current) {
      const currentTime = Date.now();
      const timeElapsedMinutes = (currentTime - startTimeRef.current) / (1000 * 60);
      if (timeElapsedMinutes > 0) {
        const calculatedWpm = Math.round(words.length / timeElapsedMinutes);
        setWpm(calculatedWpm);
      } else {
        // If time elapsed is too small, WPM can be very high, or Infinity
        // For the first word, we can estimate based on a typical fast typing speed for a single word
        // or just show a high number if they typed it super fast
        setWpm(0); // Or some placeholder, or just let it calculate on next char
      }
    } else if (words.length === 0) {
      setWpm(0); // Reset WPM if text is empty
      typingStartedRef.current = false; // Reset typing start flag
      startTimeRef.current = null;
    }
  };

  const handleTextChange = (event) => {
    const newText = event.target.value;
    setText(newText);

    if (!typingStartedRef.current && newText.length > 0) {
      typingStartedRef.current = true;
      startTimeRef.current = Date.now();
    }
    
    calculateStats(newText);
  };

  // Optional: Recalculate WPM periodically if needed,
  // but for simplicity, we calculate on each change.
  // If you wanted a more "live" WPM even when not typing, you could use an interval.

  return (
    <div className="app-container">
      <textarea
        className="text-input"
        value={text}
        onChange={handleTextChange}
        placeholder="Start typing here..."
        spellCheck="false" // Optional: disable spell check for a cleaner look
      />
      <div className="status-bar">
        <div>WPM: {wpm}</div>
        <div>Words: {wordCount}</div>
        <div>Lines: {lineCount}</div>
      </div>
    </div>
  );
}

export default App;
