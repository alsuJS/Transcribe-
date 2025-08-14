import React from 'react';
import SpeechRecognition, {
  useSpeechRecognition
} from 'react-speech-recognition';

const SpeechToTextMongolian: React.FC = () => {
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <div>Таны браузер ярианы таних функцийг дэмжихгүй байна!</div>;
  }

  const handleToggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ language: 'mn-MN' });
    }
  };

  return (
    <div>
      <h1>Монгол яриаг текст рүү</h1>
      <button onClick={handleToggleListening}>
        {listening ? 'Зогсоох' : 'Ярих'}
      </button>
      <button onClick={resetTranscript}>Цэвэрлэх</button>
      <p>{transcript}</p>
    </div>
  );
};

export default SpeechToTextMongolian;
