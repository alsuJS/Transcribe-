// components/VoiceRecorder.tsx
import React from "react";
import { ReactMediaRecorder } from "react-media-recorder";

const VoiceRecorder: React.FC = () => {
  return (
    <div>
      <h3>🎙️ Дуу бичиж байна...</h3>
      <ReactMediaRecorder
        audio
        render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
          <div>
            <p>📟 Төлөв: {status}</p>
            <button onClick={startRecording}>Эхлэх</button>
            <button onClick={stopRecording}>Зогсоох</button>

            {mediaBlobUrl && (
              <div style={{ marginTop: "1rem" }}>
                <audio src={mediaBlobUrl} controls />
                <br />
                <a href={mediaBlobUrl} download="recording.webm">⬇️ Татаж авах</a>
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default VoiceRecorder;
