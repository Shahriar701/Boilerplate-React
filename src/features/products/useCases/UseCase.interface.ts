/**
 * Generic interface for all use cases
 * T is the input/request type
 * R is the output/response type
 */
export interface IUseCase<T, R> {
    execute(request: T): Promise<R>;
}

/**
 * Interface for use cases that don't require input
 * R is the output/response type
 */
export interface IUseCaseNoInput<R> {
    execute(): Promise<R>;
} 