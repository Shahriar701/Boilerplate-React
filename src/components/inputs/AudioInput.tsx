import React, { useState, useRef } from 'react';
import '../../styles/inputs.css';

interface AudioInputProps {
  onChange: (file: File | null, audioBlob?: Blob) => void;
  disabled?: boolean;
}

const AudioInput: React.FC<AudioInputProps> = ({ onChange, disabled = false }) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      // Validate file is audio
      if (!file.type.match('audio.*')) {
        alert('Please select an audio file (mp3, wav, etc.)');
        return;
      }

      // Create preview URL
      const url = URL.createObjectURL(file);
      setAudioUrl(url);

      // Pass file to parent
      onChange(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const startRecording = async () => {
    if (disabled) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        
        // Create a File from Blob for consistency
        const file = new File([audioBlob], "recording.webm", { type: 'audio/webm' });
        onChange(file, audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const clearAudio = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      onChange(null);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="input-container">
      <div className={`audio-input-area ${disabled ? 'disabled' : ''}`}>
        <input 
          type="file" 
          ref={fileInputRef}
          accept="audio/*"
          onChange={handleFileChange}
          disabled={disabled}
          style={{ display: 'none' }}
        />
        
        {audioUrl ? (
          <div className="audio-preview">
            <audio src={audioUrl} controls />
            {!disabled && (
              <button 
                className="clear-audio" 
                onClick={clearAudio}
              >
                Clear Audio
              </button>
            )}
          </div>
        ) : (
          <div className="audio-controls">
            {isRecording ? (
              <div className="recording-indicator">
                <div className="recording-dot"></div>
                <span className="recording-time">{formatTime(recordingTime)}</span>
                <button
                  className="stop-recording-button"
                  onClick={stopRecording}
                  disabled={disabled}
                >
                  Stop Recording
                </button>
              </div>
            ) : (
              <div className="audio-buttons">
                <button
                  className="record-button"
                  onClick={startRecording}
                  disabled={disabled}
                >
                  🎤 Record Audio
                </button>
                <div className="or-divider">or</div>
                <button
                  className="upload-button"
                  onClick={triggerFileInput}
                  disabled={disabled}
                >
                  📁 Upload Audio File
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioInput; 