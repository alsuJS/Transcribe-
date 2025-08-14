'use client';

import React, { useEffect, useState, useRef } from 'react';

const SpeechToTextMongolian: React.FC = () => {
  const expectedText =
    'Монгол Улс нь төв Азийн зүрхэн цэгт оршдог далайд гарцгүй улс юм. Улаанбаатар хот нь тус улсын нийслэл бөгөөд хүн амын дийлэнх нь тэнд амьдардаг.';
  const [listening, setListening] = useState(false);
  const [fullTranscript, setFullTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognition = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognitionConstructor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      alert('Таны браузер ярианы таних функцийг дэмжихгүй байна!');
      return;
    }

    recognition.current = new SpeechRecognitionConstructor();
    recognition.current.lang = 'mn-MN';
    recognition.current.interimResults = true;
    recognition.current.continuous = true;

    recognition.current.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript + ' ';
        } else {
          interim += result[0].transcript;
        }
      }

      setFullTranscript((prev) => prev + final);
      setInterimTranscript(interim);
    };

    recognition.current.onerror = (event: any) => {
      console.error('Speech recognition error', event);
    };

    recognition.current.onend = () => {
      setListening(false);
    };

    return () => {
      recognition.current?.stop();
    };
  }, []);

  const toggleListening = () => {
    if (!recognition.current) return;

    if (listening) {
      recognition.current.stop();
      setListening(false);
      setInterimTranscript('');
    } else {
      recognition.current.start();
      setListening(true);
    }
  };

  const clearText = () => {
    setFullTranscript('');
    setInterimTranscript('');
  };

  // === 🧠 Харьцуулалт ===
  const compareTexts = () => {
    const expectedWords = expectedText.trim().toLowerCase().split(/\s+/);
    const actualWords = fullTranscript.trim().toLowerCase().split(/\s+/);

    let matchCount = 0;
    expectedWords.forEach((word, index) => {
      if (word === actualWords[index]) {
        matchCount++;
      }
    });

    const accuracy = ((matchCount / expectedWords.length) * 100).toFixed(2);

    return {
      matchCount,
      total: expectedWords.length,
      accuracy,
    };
  };

  const { matchCount, total, accuracy } = compareTexts();

  return (
    <div style={{ maxWidth: 700, margin: '30px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 20 }}>Монгол яриаг текст рүү</h1>

      <div style={{ marginBottom: 20 }}>
        <h3>📌 Унших өгүүлбэр:</h3>
        <p
          style={{
            background: '#161616ff',
            padding: 15,
            borderRadius: 8,
            lineHeight: 1.6,
          }}
        >
          {expectedText}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 15, marginBottom: 20 }}>
        <button
          onClick={toggleListening}
          style={{
            padding: '10px 20px',
            backgroundColor: listening ? '#d9534f' : '#0275d8',
            color: 'white',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {listening ? 'Зогсоох' : 'Ярих'}
        </button>
        <button
          onClick={clearText}
          style={{
            padding: '10px 20px',
            backgroundColor: '#5bc0de',
            color: 'white',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Цэвэрлэх
        </button>
      </div>

      <div
        style={{
          minHeight: 120,
          border: '2px solid #ddd',
          borderRadius: 8,
          padding: 15,
          backgroundColor: '#252525ff',
          boxShadow: 'inset 0 0 5px #ccc',
        }}
      >
        <h3>🗣️ Танигдсан текст:</h3>
        <p>{fullTranscript}</p>
        <p style={{ color: '#111111ff', fontStyle: 'italic' }}>{interimTranscript}</p>
      </div>

      <div style={{ marginTop: 30, padding: 15, backgroundColor: '#1d1c1cff', borderRadius: 8 }}>
        <h3>📊 Үр дүн:</h3>
        <p>Нийт үгс: {total}</p>
        <p>Зөв таарсан үгс: {matchCount}</p>
        <p>
          🎯 Нарийвчлал (Accuracy):{' '}
          <span style={{ fontWeight: 'bold', color: accuracy === '100.00' ? 'green' : 'orange' }}>
            {accuracy}%
          </span>
        </p>
      </div>
    </div>
  );
};

export default SpeechToTextMongolian;
