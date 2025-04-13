import { injectable, inject } from 'inversify';
import { TYPES } from '../../../app/config/types';
import { IUseCase, IUseCaseNoInput } from './UseCase.interface';
import { IStorageService } from '../../../adapters/storage/storage.interface';
import { ILoggerService } from '../../../infrastructure/logging/logger.interface';
import { SelectedProductsState } from '../models/product.dto';

const STORAGE_KEY = 'selected_products';

@injectable()
export class SelectProductUseCase implements IUseCase<string, void> {
    constructor(
        @inject(TYPES.StorageService) private readonly storage: IStorageService,
        @inject(TYPES.LoggerService) private readonly logger: ILoggerService
    ) { }

    async execute(productId: string): Promise<void> {
        try {
            const selectedState = this.getSelectedState();
            if (!selectedState.ids.includes(productId)) {
                selectedState.ids.push(productId);
                this.saveSelectedState(selectedState);
                this.logger.info(`Product ${productId} selected`);
            }
        } catch (error) {
            this.logger.error(`Error selecting product ${productId}`, error);
        }
    }

    private getSelectedState(): SelectedProductsState {
        try {
            const json = this.storage.get(STORAGE_KEY);
            if (json) {
                return JSON.parse(json) as SelectedProductsState;
            }
        } catch (error) {
            this.logger.error('Error parsing selected products from storage', error);
        }
        return { ids: [] };
    }

    private saveSelectedState(state: SelectedProductsState): void {
        this.storage.set(STORAGE_KEY, JSON.stringify(state));
    }
}

@injectable()
export class UnselectProductUseCase implements IUseCase<string, void> {
    constructor(
        @inject(TYPES.StorageService) private readonly storage: IStorageService,
        @inject(TYPES.LoggerService) private readonly logger: ILoggerService
    ) { }

    async execute(productId: string): Promise<void> {
        try {
            const selectedState = this.getSelectedState();
            const index = selectedState.ids.indexOf(productId);
            if (index !== -1) {
                selectedState.ids.splice(index, 1);
                this.saveSelectedState(selectedState);
                this.logger.info(`Product ${productId} unselected`);
            }
        } catch (error) {
            this.logger.error(`Error unselecting product ${productId}`, error);
        }
    }

    private getSelectedState(): SelectedProductsState {
        try {
            const json = this.storage.get(STORAGE_KEY);
            if (json) {
                return JSON.parse(json) as SelectedProductsState;
            }
        } catch (error) {
            this.logger.error('Error parsing selected products from storage', error);
        }
        return { ids: [] };
    }

    private saveSelectedState(state: SelectedProductsState): void {
        this.storage.set(STORAGE_KEY, JSON.stringify(state));
    }
}

@injectable()
export class GetSelectedProductIdsUseCase implements IUseCaseNoInput<string[]> {
    constructor(
        @inject(TYPES.StorageService) private readonly storage: IStorageService,
        @inject(TYPES.LoggerService) private readonly logger: ILoggerService
    ) { }

    async execute(): Promise<string[]> {
        return this.getSelectedState().ids;
    }

    private getSelectedState(): SelectedProductsState {
        try {
            const json = this.storage.get(STORAGE_KEY);
            if (json) {
                return JSON.parse(json) as SelectedProductsState;
            }
        } catch (error) {
            this.logger.error('Error parsing selected products from storage', error);
        }
        return { ids: [] };
    }
}

@injectable()
export class ClearSelectedProductsUseCase implements IUseCaseNoInput<void> {
    constructor(
        @inject(TYPES.StorageService) private readonly storage: IStorageService,
        @inject(TYPES.LoggerService) private readonly logger: ILoggerService
    ) { }

    async execute(): Promise<void> {
        try {
            this.saveSelectedState({ ids: [] });
            this.logger.info('Selected products cleared');
        } catch (error) {
            this.logger.error('Error clearing selected products', error);
        }
    }

    private saveSelectedState(state: SelectedProductsState): void {
        this.storage.set(STORAGE_KEY, JSON.stringify(state));
    }
} 