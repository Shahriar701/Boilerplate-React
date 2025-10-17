/**
 * Model input/output type definitions
 */

// Base input/output types that can be extended
export type InputType = 'image' | 'text' | 'audio' | 'video' | 'json' | 'csv' | 'binary';
export type OutputType = 'image' | 'text' | 'audio' | 'video' | 'json' | 'csv' | 'binary';

// Generic model input data interface that can be extended
export interface BaseInputData {
  metadata?: Record<string, any>;
  parameters?: Record<string, any>;
}

// Specific input types
export interface ImageInputData extends BaseInputData {
  imageUrl?: string;
  file?: File;
  format?: 'jpeg' | 'png' | 'webp' | 'tiff';
  width?: number;
  height?: number;
}

export interface TextInputData extends BaseInputData {
  text: string;
  language?: string;
  encoding?: string;
}

export interface AudioInputData extends BaseInputData {
  audioUrl?: string;
  file?: File;
  format?: 'mp3' | 'wav' | 'flac' | 'ogg';
  duration?: number;
  sampleRate?: number;
}

export interface VideoInputData extends BaseInputData {
  videoUrl?: string;
  file?: File;
  format?: 'mp4' | 'avi' | 'mov' | 'webm';
  duration?: number;
  frameRate?: number;
}

export interface JsonInputData extends BaseInputData {
  data: any;
  schema?: string;
}

export interface CsvInputData extends BaseInputData {
  data: string;
  headers?: string[];
  delimiter?: string;
}

export interface BinaryInputData extends BaseInputData {
  data: ArrayBuffer | Uint8Array;
  mimeType: string;
}

// Union type for all possible input data
export type ModelInputData = 
  | ImageInputData 
  | TextInputData 
  | AudioInputData 
  | VideoInputData 
  | JsonInputData 
  | CsvInputData 
  | BinaryInputData;

// Generic model output data interface
export interface BaseOutputData {
  processingTime?: number;
  confidence?: number;
  metadata?: Record<string, any>;
  modelVersion?: string;
}

// Specific output types
export interface ImageOutputData extends BaseOutputData {
  imageUrl: string;
  format?: string;
  width?: number;
  height?: number;
  annotations?: Array<{
    id: number;
    label: string;
    confidence: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
}

export interface TextOutputData extends BaseOutputData {
  text: string;
  language?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  entities?: Array<{
    text: string;
    label: string;
    confidence: number;
    start: number;
    end: number;
  }>;
}

export interface AudioOutputData extends BaseOutputData {
  audioUrl: string;
  transcript?: string;
  format?: string;
  duration?: number;
}

export interface VideoOutputData extends BaseOutputData {
  videoUrl: string;
  transcript?: string;
  format?: string;
  duration?: number;
  thumbnails?: string[];
}

export interface JsonOutputData extends BaseOutputData {
  data: any;
  schema?: string;
}

export interface CsvOutputData extends BaseOutputData {
  data: string;
  headers?: string[];
  rowCount?: number;
}

export interface BinaryOutputData extends BaseOutputData {
  data: string; // Base64 encoded
  mimeType: string;
  size?: number;
}

// Union type for all possible output data
export type ModelOutputData = 
  | ImageOutputData 
  | TextOutputData 
  | AudioOutputData 
  | VideoOutputData 
  | JsonOutputData 
  | CsvOutputData 
  | BinaryOutputData;

// Model interface
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

// Helper type guards for input data
export const isImageInput = (data: ModelInputData): data is ImageInputData => {
  return 'imageUrl' in data || 'file' in data;
};

export const isTextInput = (data: ModelInputData): data is TextInputData => {
  return 'text' in data && typeof (data as any).text === 'string';
};

export const isAudioInput = (data: ModelInputData): data is AudioInputData => {
  return 'audioUrl' in data || ('file' in data && (data as any).file?.type?.startsWith('audio/'));
};

export const isVideoInput = (data: ModelInputData): data is VideoInputData => {
  return 'videoUrl' in data || ('file' in data && (data as any).file?.type?.startsWith('video/'));
};

export const isJsonInput = (data: ModelInputData): data is JsonInputData => {
  return 'data' in data && typeof (data as any).data === 'object';
};

// Helper type guards for output data
export const isImageOutput = (data: ModelOutputData): data is ImageOutputData => {
  return 'imageUrl' in data;
};

export const isTextOutput = (data: ModelOutputData): data is TextOutputData => {
  return 'text' in data && typeof (data as any).text === 'string';
};

export const isAudioOutput = (data: ModelOutputData): data is AudioOutputData => {
  return 'audioUrl' in data;
};

export const isVideoOutput = (data: ModelOutputData): data is VideoOutputData => {
  return 'videoUrl' in data;
};

export const isJsonOutput = (data: ModelOutputData): data is JsonOutputData => {
  return 'data' in data && typeof (data as any).data === 'object';
};

// Processing Status
export interface ModelProcessingState {
  isProcessing: boolean;
  error: string | null;
  outputData: ModelOutputData | null;
} 