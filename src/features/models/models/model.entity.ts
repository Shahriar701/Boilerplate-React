import { InputType, OutputType } from '../../../types/model.types';

/**
 * Model entity representing an ML model in the system
 */
export class ModelEntity {
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

  constructor(props: ModelEntity) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.accuracy = props.accuracy;
    this.lastTested = props.lastTested;
    this.imageUrl = props.imageUrl;
    this.inputType = props.inputType;
    this.outputType = props.outputType;
    this.details = props.details;
  }
} 