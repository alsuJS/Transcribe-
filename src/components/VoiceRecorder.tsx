import React, { forwardRef, useImperativeHandle, useState } from "react";
import { ReactMediaRecorder } from "react-media-recorder";

export type VoiceRecorderHandle = {
  start: () => void;
  stop: () => void;
  getMediaBlobUrl: () => string | null;
};

const VoiceRecorder = forwardRef<VoiceRecorderHandle>((_, ref) => {
  const [mediaBlobUrl, setMediaBlobUrl] = useState<string | null>(null);
  let startRecordingInternal: () => void = () => {};
  let stopRecordingInternal: () => void = () => {};

  useImperativeHandle(ref, () => ({
    start: () => startRecordingInternal(),
    stop: () => stopRecordingInternal(),
    getMediaBlobUrl: () => mediaBlobUrl,
  }));

  return (
    <div>
      <h3>🎙️ Дуу бичиж байна...</h3>
      <ReactMediaRecorder
        audio
        render={({ status, startRecording, stopRecording, mediaBlobUrl }) => {
          startRecordingInternal = startRecording;
          stopRecordingInternal = stopRecording;
          setMediaBlobUrl(mediaBlobUrl || null);

          return (
            <div>
              <p>📟 Төлөв: {status}</p>
              {mediaBlobUrl && (
                <div style={{ marginTop: "1rem" }}>
                  <audio src={mediaBlobUrl} controls />
                  <br />
                  <a href={mediaBlobUrl} download="recording.webm">⬇️ Татаж авах</a>
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
});

export default VoiceRecorder;
