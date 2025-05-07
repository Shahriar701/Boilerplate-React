/**
 * Model input/output type definitions
 */

// Base Model Data Types
export type InputType = 'text' | 'image' | 'audio' | 'json';
export type OutputType = 'text' | 'image' | 'audio' | 'json';

export interface Model {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  lastTested: string;
  imageUrl: string;
  inputType: InputType;
  outputType: OutputType;
  details?: {
    framework: string;
    version: string;
    size: string;
    type: string;
    created: string;
    author: string;
  };
}

// Input Data Types
export interface TextInputData {
  text: string;
}

export interface ImageInputData {
  imageUrl: string;
  file?: File;
  width?: number;
  height?: number;
}

export interface AudioInputData {
  audioUrl: string;
  file?: File;
  duration?: number;
}

export interface JsonInputData {
  data: Record<string, any>;
}

export type ModelInputData = 
  | TextInputData 
  | ImageInputData 
  | AudioInputData 
  | JsonInputData;

// Output Data Types
export interface TextOutputData {
  text: string;
}

export interface Annotation {
  id: number;
  label: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
}

export interface ImageOutputData {
  imageUrl: string;
  annotations?: Annotation[];
  width?: number;
  height?: number;
}

export interface AudioOutputData {
  audioUrl: string;
  transcript?: string;
}

export interface JsonOutputData {
  [key: string]: any;
}

export type ModelOutputData = 
  | TextOutputData 
  | ImageOutputData 
  | AudioOutputData 
  | JsonOutputData;

// Processing Status
export interface ModelProcessingState {
  isProcessing: boolean;
  error: string | null;
  outputData: ModelOutputData | null;
} 