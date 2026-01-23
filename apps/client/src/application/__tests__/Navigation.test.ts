import { Coordinates } from '@voidbound/domain';
import { GridNavigationService } from '../navigation/GridNavigationService';

describe('GridNavigationService', () => {
  let navigationService: GridNavigationService;

  beforeEach(() => {
    navigationService = new GridNavigationService();
  });

  test('должен строить прямой путь, если нет препятствий', () => {
    const start = new Coordinates(0, 0);
    const end = new Coordinates(2, 2);
    
    const path = navigationService.findPath(start, end);
    
    expect(path.length).toBeGreaterThan(0);
    expect(path[path.length - 1].x).toBe(2);
    expect(path[path.length - 1].y).toBe(2);
  });

  test('путь должен состоять из соседних ячеек (сетка 1x1)', () => {
    const start = new Coordinates(0, 0);
    const end = new Coordinates(1, 1);
    
    const path = navigationService.findPath(start, end);
    
    // Для (0,0) -> (1,1) путь может быть [(0,0), (1,0), (1,1)] или [(0,0), (0,1), (1,1)]
    // или по диагонали [(0,0), (1,1)], если разрешена диагональ.
    // Пока реализуем простейший поиск.
    expect(path.length).toBeGreaterThan(0);
    
    for (let i = 1; i < path.length; i++) {
      const prev = path[i-1];
      const curr = path[i];
      const dist = Math.abs(curr.x - prev.x) + Math.abs(curr.y - prev.y);
      // Если разрешены только ортогональные перемещения, dist === 1
      // Если разрешены диагонали, dist может быть 1 или 2 (манхэттенское)
      expect(dist).toBeLessThanOrEqual(2);
    }
  });

  test('должен возвращать пустой путь, если цель совпадает с началом', () => {
    const start = new Coordinates(5, 5);
    const end = new Coordinates(5, 5);
    
    const path = navigationService.findPath(start, end);
    
    expect(path).toEqual([]);
  });
});
