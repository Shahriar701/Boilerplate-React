import React from 'react';
import ImageOutput from './ImageOutput';
import TextOutput from './TextOutput';
import { 
  OutputType, 
  ModelOutputData,
  TextOutputData,
  ImageOutputData,
  AudioOutputData,
  JsonOutputData
} from '../../types/model.types';
import '../../styles/outputs.css';

interface ModelOutputProps {
  outputType: OutputType;
  data: ModelOutputData | null;
  isLoading?: boolean;
  error?: string | null;
}

const ModelOutput: React.FC<ModelOutputProps> = ({ 
  outputType, 
  data, 
  isLoading = false,
  error = null
}) => {
  
  if (isLoading) {
    return (
      <div className="output-loading">
        <div className="output-spinner"></div>
        <p>Processing results...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="output-error">
        <div className="error-icon">⚠️</div>
        <p>{error}</p>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="output-empty">
        <p>No results to display yet</p>
      </div>
    );
  }
  
  // Type guards to ensure we're working with the right output type
  const isImageOutput = (data: ModelOutputData): data is ImageOutputData => 
    'imageUrl' in data && typeof data.imageUrl === 'string';
  
  const isTextOutput = (data: ModelOutputData): data is TextOutputData => 
    'text' in data && typeof data.text === 'string';
  
  const isAudioOutput = (data: ModelOutputData): data is AudioOutputData => 
    'audioUrl' in data && typeof data.audioUrl === 'string';

  // Render the appropriate output component based on type
  switch (outputType) {
    case 'image':
      if (isImageOutput(data)) {
        return (
          <ImageOutput 
            imageUrl={data.imageUrl}
            annotations={data.annotations}
            width={data.width}
            height={data.height}
          />
        );
      } else {
        return (
          <div className="output-error">
            <p>Invalid data format for image output</p>
          </div>
        );
      }
      
    case 'audio':
      // For audio outputs, display an audio player
      if (isAudioOutput(data)) {
        return (
          <div className="audio-output">
            <audio src={data.audioUrl} controls />
            {data.transcript && (
              <div className="audio-transcript">
                <h3>Transcript</h3>
                <p>{data.transcript}</p>
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div className="output-error">
            <p>Invalid data format for audio output</p>
          </div>
        );
      }
      
    case 'text':
      // For text outputs
      if (isTextOutput(data)) {
        return <TextOutput text={data.text} />;
      } else if (typeof data === 'string') {
        return <TextOutput text={data} />;
      } else {
        return (
          <div className="output-error">
            <p>Invalid data format for text output</p>
          </div>
        );
      }
      
    case 'json':
      // For JSON data, format and display
      return (
        <div className="json-output">
          <pre>{typeof data === 'string' ? data : JSON.stringify(data, null, 2)}</pre>
        </div>
      );
      
    default:
      // Fallback for unknown types
      return (
        <div className="default-output">
          <pre>{typeof data === 'string' ? data : JSON.stringify(data, null, 2)}</pre>
        </div>
      );
  }
};

export default ModelOutput; 