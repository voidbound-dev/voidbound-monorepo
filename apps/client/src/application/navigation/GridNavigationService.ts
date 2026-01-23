import { Coordinates } from '@voidbound/domain';

/**
 * Сервис для расчета пути по сетке.
 * На данном этапе реализует упрощенный поиск пути.
 */
export class GridNavigationService {
  private readonly cellSize: number = 1;

  /**
   * Находит путь между двумя точками.
   * Возвращает массив координат узлов сетки.
   */
  public findPath(start: Coordinates, end: Coordinates): Coordinates[] {
    // Округляем до ближайших узлов сетки
    const startNode = this.snapToGrid(start);
    const endNode = this.snapToGrid(end);

    if (startNode.equals(endNode)) {
      return [];
    }

    // Для прототипа (без препятствий) просто строим путь из нескольких точек.
    // В идеале здесь должен быть A*.
    // Пока сделаем упрощенную версию: 
    // 1. Идем по X до конца.
    // 2. Идем по Y до конца.
    
    const path: Coordinates[] = [];
    let currentX = startNode.x;
    let currentY = startNode.y;

    const targetX = endNode.x;
    const targetY = endNode.y;

    const stepX = targetX > currentX ? 1 : -1;
    const stepY = targetY > currentY ? 1 : -1;

    // Движение по X
    while (currentX !== targetX) {
      currentX += stepX;
      path.push(new Coordinates(currentX, currentY));
    }

    // Движение по Y
    while (currentY !== targetY) {
      currentY += stepY;
      path.push(new Coordinates(currentX, currentY));
    }

    return path;
  }

  /**
   * Привязывает координаты к сетке.
   */
  public snapToGrid(coords: Coordinates): Coordinates {
    return new Coordinates(
      Math.round(coords.x / this.cellSize) * this.cellSize,
      Math.round(coords.y / this.cellSize) * this.cellSize
    );
  }
}
