import { Coordinates } from '../models/Coordinates';

describe('Value Object Coordinates', () => {
  it('должен создавать координаты с x и y', () => {
    const coords = new Coordinates(10, 20);
    expect(coords.x).toBe(10);
    expect(coords.y).toBe(20);
  });

  it('должен быть неизменяемым (immutable)', () => {
    const coords = new Coordinates(10, 20);
    // @ts-expect-error - x is readonly
    expect(() => { (coords as any).x = 30; }).toThrow();
  });

  it('должен проверять равенство', () => {
    const coords1 = new Coordinates(10, 20);
    const coords2 = new Coordinates(10, 20);
    const coords3 = new Coordinates(5, 5);

    expect(coords1.equals(coords2)).toBe(true);
    expect(coords1.equals(coords3)).toBe(false);
  });

  it('должен складывать координаты и возвращать новый экземпляр', () => {
    const coords1 = new Coordinates(10, 20);
    const coords2 = new Coordinates(5, -5);
    const result = coords1.add(coords2);

    expect(result.x).toBe(15);
    expect(result.y).toBe(15);
    expect(result).not.toBe(coords1);
    expect(result).not.toBe(coords2);
  });

  it('должен вычислять расстояние до других координат', () => {
    const coords1 = new Coordinates(0, 0);
    const coords2 = new Coordinates(3, 4); // треугольник 3-4-5

    expect(coords1.distanceTo(coords2)).toBe(5);
  });
});
