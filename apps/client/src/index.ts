import { GameBootstrapper } from './infrastructure/GameBootstrapper';

export const CLIENT = true;

if (typeof window !== 'undefined') {
  const initGame = () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'renderCanvas';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.display = 'block';
    canvas.style.outline = 'none';
    document.body.appendChild(canvas);

    // Убираем отступы у body для полноэкранного canvas
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';

    const bootstrapper = new GameBootstrapper(canvas);
    bootstrapper.run();
    
    console.log('Voidbound: Chronoscape initialized');
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initGame();
  } else {
    window.addEventListener('DOMContentLoaded', initGame);
  }
}
