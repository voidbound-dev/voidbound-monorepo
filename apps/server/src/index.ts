import { InMemoryInventoryRepository } from '@voidbound/infra';
import { LoadInventoryUseCase } from './application/LoadInventoryUseCase';

export const SERVER = true;
console.log('Сервер запущен');

// Демонстрация DI и инициализации
const inventoryRepo = new InMemoryInventoryRepository();
const loadInventoryUseCase = new LoadInventoryUseCase(inventoryRepo);

console.log('Слой сохранения инвентаря инициализирован:', loadInventoryUseCase !== undefined);
