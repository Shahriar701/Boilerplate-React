export interface ModelStatusResponse {
  status: 'RUNNING' | 'STOPPED' | 'STARTING' | 'STOPPING' | 'PENDING' | 'NOT_FOUND';
  instanceName?: string;
  lastInvocation?: Date;
  created?: Date;
}

export interface IGetModelStatusUseCase {
  execute(modelId: string): Promise<ModelStatusResponse>;
} 