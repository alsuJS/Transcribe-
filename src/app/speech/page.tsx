'use client';

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

import type { VoiceRecorderHandle } from '../../components/VoiceRecorder';
import { compareTexts } from '@/utils/compareTexts';
import ExpectedText from '@/components/ExpectedText';
import ControlButtons from '@/components/ControlButtons';
import TranscriptBox from '@/components/TranscriptBox';
import ResultStats from '@/components/ResultStats';
import { createRecognition } from '@/utils/recognitionHandler';

const VoiceRecorder = dynamic(() => import('../../components/VoiceRecorder'), { ssr: false });

const SpeechToTextMongolian: React.FC = () => {
  const [sentence, setSentence] = useState<{ id: number; text: string; readCount: number } | null>(null);
  const [fullTranscript, setFullTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const recorderRef = useRef<VoiceRecorderHandle>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    recognitionRef.current = createRecognition(setFullTranscript, setInterimTranscript, setListening);
    fetchNextSentence();

    return () => recognitionRef.current?.stop();
  }, []);

  const fetchNextSentence = async () => {
    const res = await fetch('/api/sentences');
    const data = await res.json();
    if (data.success) setSentence({ ...data.sentence, readCount: data.sentence.readCount });
  };

  const handleSaveAndNext = async () => {
    if (!sentence) return;
    await fetch('/api/sentences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: sentence.id }),
    });
    setFullTranscript('');
    setInterimTranscript('');
    setListening(false);
    recognitionRef.current?.stop();
    fetchNextSentence();
  };

  const { matchCount, total, accuracy } = compareTexts(sentence?.text || '', fullTranscript);

  return (
    <div className="max-w-xl mx-auto mt-8 font-sans space-y-6">
      <h1 className="text-center text-2xl font-bold">Монгол яриаг текст рүү</h1>

      {sentence && <ExpectedText expectedText={sentence.text} actualText={fullTranscript} />}

      <ControlButtons listening={listening} onToggle={() => {
          if (listening) {
            recognitionRef.current?.stop();
            recorderRef.current?.stop();
            setListening(false);
          } else {
            recognitionRef.current?.start();
            recorderRef.current?.start();
            setListening(true);
          }
        }} onClear={() => {
          setFullTranscript('');
          setInterimTranscript('');
        }} />

      <TranscriptBox fullTranscript={fullTranscript} interimTranscript={interimTranscript} />

      <ResultStats matchCount={matchCount} total={total} accuracy={accuracy}>
        <VoiceRecorder ref={recorderRef} />
        <button onClick={handleSaveAndNext} className="mt-4 px-5 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition">
          Хадгалах ба Дараагийн
        </button>
      </ResultStats>

      {sentence && (
        <p className="text-sm text-center text-gray-600">
          Энэ өгүүлбэрийг уншсан удаа: <span className="font-bold">{sentence.readCount}</span>
        </p>
      )}
    </div>
  );
};

export default SpeechToTextMongolian;
