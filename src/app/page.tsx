'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { FiSun, FiMoon, FiMic } from 'react-icons/fi';
import { FaExchangeAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Footer'

const Select = dynamic(() => import('react-select'), { ssr: false });

const languageOptions = [
  { value: 'Afrikaans', label: 'Afrikaans' },
  { value: 'Albanian', label: 'Albanian - shqip' },
  { value: 'Amharic', label: 'Amharic - አማርኛ' },
  { value: 'Arabic', label: 'Arabic - العربية' },
  { value: 'Armenian', label: 'Armenian - հայերեն' },
  { value: 'Chinese', label: 'Chinese - 中文' },
  { value: 'Croatian', label: 'Croatian - hrvatski' },
  { value: 'Czech', label: 'Czech - čeština' },
  { value: 'Danish', label: 'Danish - dansk' },
  { value: 'Dutch', label: 'Dutch - Nederlands' },
  { value: 'English', label: 'English' },
  { value: 'French', label: 'French - français' },
  { value: 'German', label: 'German - Deutsch' },
  { value: 'Greek', label: 'Greek - Ελληνικά' },
  { value: 'Hebrew', label: 'Hebrew - עברית' },
  { value: 'Hindi', label: 'Hindi - हिन्दी' },
  { value: 'Hungarian', label: 'Hungarian - magyar' },
  { value: 'Italian', label: 'Italian - italiano' },
  { value: 'Japanese', label: 'Japanese - 日本語' },
  { value: 'Korean', label: 'Korean - 한국어' },
  { value: 'Persian', label: 'Persian - فارسی' },
  { value: 'Polish', label: 'Polish - polski' },
  { value: 'Portuguese', label: 'Portuguese - português' },
  { value: 'Russian', label: 'Russian - русский' },
  { value: 'Spanish', label: 'Spanish - español' },
  { value: 'Swedish', label: 'Swedish - svenska' },
  { value: 'Turkish', label: 'Turkish - Türkçe' },
  { value: 'Ukrainian', label: 'Ukrainian - українська' },
  { value: 'Urdu', label: 'Urdu - اردو' },
];

export default function TranslatorPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sourceLanguage, setSourceLanguage] = useState(languageOptions[10]);
  const [targetLanguage, setTargetLanguage] = useState(languageOptions[28]);
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [lastDetectedText, setLastDetectedText] = useState('');
  const SpeechRecognition =
    typeof window !== 'undefined'
      ? (window.SpeechRecognition || (window as any).webkitSpeechRecognition)
      : null;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
  const detectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const customSelectStyles = (isDark: boolean) => ({
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      color: isDark ? '#ffffff' : '#000000',
      borderColor: isDark ? '#374151' : '#d1d5db',
      boxShadow: state.isFocused ? (isDark ? '0 0 0 1px #4F46E5' : '0 0 0 1px #6366F1') : null,
      '&:hover': {
        borderColor: isDark ? '#4b5563' : '#9ca3af',
      },
    }),
    input: (base: any) => ({
      ...base,
      color: '#ffffff',
    }),
    singleValue: (base: any) => ({
      ...base,
      color: isDark ? '#ffffff' : '#000000',
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      color: isDark ? '#ffffff' : '#000000',
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused
        ? isDark
          ? '#374151'
          : '#f3f4f6'
        : isDark
          ? '#1f2937'
          : '#ffffff',
      color: isDark ? '#ffffff' : '#000000',
    }),
  });

  const swapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
  };

  const handleTranslate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: targetLanguage.value, text }),
      });
      const data = await response.json();
      if (data.error) {
        setTranslation('');
        toast.error('Translation error occurred.');
      } else {
        setTranslation(data.translation || 'Translation error: no response.');
      }
    } catch {
      setTranslation('');
      toast.error('Translation error occurred.');
    }
    setLoading(false);
  };

  const handleRecord = () => {
    if (!recognition) {
      toast.error('Speech Recognition is not supported in this browser.');
      return;
    }
    if (!recording) {
      setRecording(true);
      recognition.start();
    } else {
      setRecording(false);
      recognition.stop();
    }
  };

  useEffect(() => {
    if (!recognition) return;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onerror = () => {
      setRecording(false);
      toast.error('Speech recognition error.');
    };
    recognition.onend = () => setRecording(false);
  }, [recognition]);

  useEffect(() => {
    if (!text.trim()) {
      setSourceLanguage(languageOptions[10]);
      setLastDetectedText('');
      return;
    }
    if (text.trim() === lastDetectedText.trim()) return;
    if (detectionTimeoutRef.current) clearTimeout(detectionTimeoutRef.current);
    detectionTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/detect-language', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
        const data = await res.json();
        if (data.language) {
          const found = languageOptions.find(
            (lang) => lang.value.toLowerCase() === data.language.toLowerCase()
          );
          if (found) setSourceLanguage(found);
          setLastDetectedText(text);
        }
      } catch {
        toast.error('Language detection failed.');
      }
    }, 2000);
    return () => {
      if (detectionTimeoutRef.current) clearTimeout(detectionTimeoutRef.current);
    };
  }, [text, lastDetectedText]);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <nav className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl md:text-2xl font-bold">Lang Change</h1>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-300"
          >
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>
        </nav>
        <main className="max-w-4xl mx-auto p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Source Language</label>
              <Select
                className="text-black dark:text-white"
                classNamePrefix="langSelect"
                options={languageOptions}
                value={sourceLanguage}
                onChange={(selected) => selected && setSourceLanguage(selected as any)}
                isSearchable
                styles={customSelectStyles(theme === 'dark')}
              />
            </div>
            <div className="flex items-end justify-center md:justify-start">
              <button
                onClick={swapLanguages}
                className="mt-6 px-3 py-2 rounded bg-green-600 hover:bg-green-700 text-white transition-colors duration-300 flex items-center gap-2"
              >
                <FaExchangeAlt />
                Swap
              </button>
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Target Language</label>
              <Select
                className="text-black dark:text-white"
                classNamePrefix="langSelect"
                options={languageOptions}
                value={targetLanguage}
                onChange={(selected) => selected && setTargetLanguage(selected as any)}
                isSearchable
                styles={customSelectStyles(theme === 'dark')}
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-semibold">Enter Text</label>
            <div className="flex gap-2">
              <textarea
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
                placeholder="Type or record your text..."
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRecord}
              className={`px-4 py-2 rounded transition-colors duration-300 flex items-center justify-center ${recording ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                } text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FiMic className="mr-2" />
              {recording ? 'Stop' : 'Record'}
            </button>
            <button
              onClick={handleTranslate}
              disabled={loading || !text.trim()}
              className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-300 disabled:opacity-50"
            >
              {loading ? 'Translating...' : 'Translate'}
            </button>
          </div>
          {translation && (
            <div className="mt-6 p-4 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800">
              <h2 className="mb-2 font-semibold">Translation:</h2>
              <p>{translation}</p>
            </div>
          )}
        </main>
        <Footer />

      </div>
    </div>
  );
}