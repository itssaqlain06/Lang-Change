'use client';

import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon, FiMic } from 'react-icons/fi';
import { FaExchangeAlt } from 'react-icons/fa';

export default function TranslatorUI() {
  // Theme (light/dark)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Language states
  const [sourceLanguage, setSourceLanguage] = useState('english');
  const [targetLanguage, setTargetLanguage] = useState('spanish');

  // Text input & translation output
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);

  // Voice recording (Web Speech API)
  const [recording, setRecording] = useState(false);
  const SpeechRecognition =
    typeof window !== 'undefined'
      ? (window.SpeechRecognition || (window as any).webkitSpeechRecognition)
      : null;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  // Toggle theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Switch languages
  const switchLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
  };

  // Handle translation
  const handleTranslate = async () => {
    setLoading(true);
    try {
      // Post to your /api/translate route (adjust body if you handle detection differently)
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // This example always uses the targetLanguage as the "language" param
          language: targetLanguage,
          text,
        }),
      });
      const data = await response.json();
      if (data.translation) {
        setTranslation(data.translation);
      } else {
        setTranslation('Translation error: no response.');
      }
    } catch (error) {
      console.error('Translation failed:', error);
      setTranslation('Translation error occurred.');
    }
    setLoading(false);
  };

  // Handle voice recording using the Web Speech API
  const handleRecord = () => {
    if (!recognition) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }

    if (!recording) {
      // Start recording
      setRecording(true);
      recognition.start();
    } else {
      // Stop recording
      setRecording(false);
      recognition.stop();
    }
  };

  // Capture recognized speech and append to text
  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setRecording(false);
    };

    recognition.onend = () => {
      // If it ended unexpectedly, set recording to false
      setRecording(false);
    };
  }, [recognition]);

  return (
    // Apply the `.dark` class at the top level if theme is dark
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        {/* Navbar */}
        <nav className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl md:text-2xl font-bold">Translator</h1>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-300"
          >
            {theme === 'light' ? <FiMoon /> : <FiSun />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </nav>

        {/* Main Container */}
        <main className="max-w-4xl mx-auto p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Source Language */}
            <div className="flex-1">
              <label
                htmlFor="sourceLanguage"
                className="block mb-1 font-semibold"
              >
                Source Language
              </label>
              <select
                id="sourceLanguage"
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
                {/* Add more as needed */}
              </select>
            </div>

            {/* Switch Button */}
            <div className="flex items-end justify-center md:justify-start">
              <button
                onClick={switchLanguages}
                className="mt-6 px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-300 flex items-center gap-2"
              >
                <FaExchangeAlt />
                Swap
              </button>
            </div>

            {/* Target Language */}
            <div className="flex-1">
              <label
                htmlFor="targetLanguage"
                className="block mb-1 font-semibold"
              >
                Target Language
              </label>
              <select
                id="targetLanguage"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
                {/* Add more as needed */}
              </select>
            </div>
          </div>

          {/* Text Input & Record Button */}
          <div className="mb-6">
            <label htmlFor="text" className="block mb-1 font-semibold">
              Enter Text
            </label>
            <div className="flex gap-2">
              <textarea
                id="text"
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
                placeholder="Type or record your text..."
              />
              <button
                onClick={handleRecord}
                className={`px-4 py-2 rounded transition-colors duration-300 flex items-center justify-center ${
                  recording
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                } text-white`}
              >
                <FiMic className="mr-2" />
                {recording ? 'Stop' : 'Record'}
              </button>
            </div>
          </div>

          {/* Translate Button */}
          <button
            onClick={handleTranslate}
            disabled={loading}
            className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? 'Translating...' : 'Translate'}
          </button>

          {/* Translation Output */}
          {translation && (
            <div className="mt-6 p-4 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800">
              <h2 className="mb-2 font-semibold">Translation:</h2>
              <p>{translation}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
