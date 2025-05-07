import React from 'react';
import ImageInput from './ImageInput';
import AudioInput from './AudioInput';
import TextInput from './TextInput';
import JsonInput from './JsonInput';
import { 
  InputType, 
  ModelInputData,
  TextInputData,
  ImageInputData,
  AudioInputData,
  JsonInputData
} from '../../types/model.types';

// Define what kind of data each input will provide
type InputData = File | string | object | null;

interface ModelInputProps {
  inputType: InputType;
  onChange: (data: ModelInputData) => void;
  disabled?: boolean;
  placeholder?: string;
}

const ModelInput: React.FC<ModelInputProps> = ({ 
  inputType, 
  onChange, 
  disabled = false,
  placeholder 
}) => {
  
  // Different placeholders based on input type
  const getPlaceholder = (): string => {
    switch (inputType) {
      case 'text':
        return placeholder || 'Enter text for analysis...';
      case 'image':
        return placeholder || 'Upload an image for processing';
      case 'audio':
        return placeholder || 'Upload or record audio';
      case 'json':
        return placeholder || 'Enter structured data in JSON format';
      default:
        return placeholder || 'Enter input data';
    }
  };
  
  // Render the appropriate input component based on type
  switch (inputType) {
    case 'image':
      return (
        <ImageInput 
          onChange={(file) => {
            if (file) {
              const imageData: ImageInputData = {
                imageUrl: URL.createObjectURL(file),
                file
              };
              onChange(imageData);
            } else {
              onChange(null as any);
            }
          }}
          disabled={disabled}
        />
      );
      
    case 'audio':
      return (
        <AudioInput
          onChange={(file) => {
            if (file) {
              const audioData: AudioInputData = {
                audioUrl: URL.createObjectURL(file),
                file
              };
              onChange(audioData);
            } else {
              onChange(null as any);
            }
          }}
          disabled={disabled}
        />
      );
      
    case 'text':
      return (
        <TextInput
          onChange={(text) => {
            const textData: TextInputData = { text };
            onChange(textData);
          }}
          placeholder={getPlaceholder()}
          disabled={disabled}
        />
      );
      
    case 'json':
      return (
        <JsonInput 
          onChange={(data) => {
            if (data) {
              const jsonData: JsonInputData = { data };
              onChange(jsonData);
            } else {
              onChange(null as any);
            }
          }}
          disabled={disabled}
        />
      );
      
    default:
      // Fallback to text input
      return (
        <TextInput
          onChange={(text) => {
            const textData: TextInputData = { text };
            onChange(textData);
          }}
          placeholder={getPlaceholder()}
          disabled={disabled}
        />
      );
  }
};

export default ModelInput; 