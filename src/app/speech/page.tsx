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
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [sentence, setSentence] = useState<{ id: number; text: string; readCount: number } | null>(null);
  const [fullTranscript, setFullTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const recorderRef = useRef<VoiceRecorderHandle>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);


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

  // const audioUrl = recorderRef.current?.getMediaBlobUrl() || null;

  const payload = {
    sentences: sentence.text,
    accuracy,
    audio: audioUrl, // ✅ Cloudinary URL ашиглаж байна
    startTime: startTime?.toISOString() || null,
    endTime: new Date().toISOString(),
    profileId: 1, // 🟢 Гараас шууд 1 гэж өгч байна
  };

  await fetch('/api/readings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  setFullTranscript('');
  setInterimTranscript('');
  setListening(false);
  setStartTime(null); // 🟢 дараагийнд бэлтгэнэ
  recognitionRef.current?.stop();
  recorderRef.current?.stop();
  fetchNextSentence();
};


  const { matchCount, total, accuracy } = compareTexts(sentence?.text || '', fullTranscript);

  
  return (
    <div className="max-w-md mx-auto mt-6 px-4 py-6 bg-white rounded-2xl shadow-lg font-sans space-y-6">
  <h1 className="text-center text-3xl font-extrabold text-pink-500">
    Монгол яриаг текст рүү
  </h1>

  {sentence && (
    <ExpectedText
      expectedText={sentence.text}
      actualText={fullTranscript}
    />
  )}

  <ControlButtons
  listening={listening}
  onToggle={() => {
    if (listening) {
      recognitionRef.current?.stop();
      recorderRef.current?.stop();
      setListening(false);
    } else {
      setStartTime(new Date()); // 🟢 ЭНЭ
      recognitionRef.current?.start();
      recorderRef.current?.start();
      setListening(true);
    }
  }}
  onClear={() => {
    setFullTranscript('');
    setInterimTranscript('');
  }}
/>


  <TranscriptBox
    fullTranscript={fullTranscript}
    interimTranscript={interimTranscript}
  />

  <ResultStats matchCount={matchCount} total={total} accuracy={accuracy}>
    <VoiceRecorder
  ref={recorderRef}
  onUploadComplete={(url) => {
    console.log("🎤 Upload болсон аудио URL:", url);
    setAudioUrl(url || null); // state-д хадгалах
  }}
/>

    <button
      onClick={handleSaveAndNext}
      className="block w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-lg font-semibold rounded-full shadow transition"
    >
      ✅ Хадгалах ба Дараагийн
    </button>
  </ResultStats>
  {audioUrl && (
  <div className="mt-4 text-center space-y-2">
    <audio src={audioUrl} controls className="w-full rounded" />
    <a
      href={audioUrl}
      download="recording.webm"
      className="text-blue-600 underline text-sm"
    >
      ⬇️ Татаж авах
    </a>
  </div>
)}


  {sentence && (
    <p className="text-center text-sm text-gray-600">
      📚 Энэ өгүүлбэрийг уншсан удаа: <span className="font-bold text-purple-600">{sentence.readCount}</span>
    </p>
  )}
</div>

  );
};

export default SpeechToTextMongolian;
