import { MeshBuilder, Scene, StandardMaterial, Color3 } from 'babylonjs';

/**
 * Класс для визуализации тестовой арены.
 * Создает сетку и плоскость земли.
 */
export class ArenaVisual {
  constructor(private scene: Scene) {
    this.createGrid();
  }

  private createGrid(): void {
    // Создаем землю
    const ground = MeshBuilder.CreateGround('ground', { width: 100, height: 100 }, this.scene);
    
    // Временно используем стандартный материал с текстурой сетки, 
    // если GridMaterial не установлен.
    // Но так как нам нужно следовать гайдлайнам, попробуем сделать простую визуальную сетку.
    
    const material = new StandardMaterial('groundMaterial', this.scene);
    material.diffuseColor = new Color3(0.2, 0.2, 0.2);
    material.specularColor = new Color3(0, 0, 0);
    
    // Для прототипа используем просто темную плоскость.
    // Если бы был GridMaterial, мы бы его использовали.
    // Проверим, доступен ли GridMaterial (обычно он в @babylonjs/materials)
    
    ground.material = material;
    ground.position.y = -0.01; // Немного ниже нуля, чтобы не перекрывать спрайты
  }
}
