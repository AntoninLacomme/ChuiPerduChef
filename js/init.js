import WorldLost from './WorldLost';
import CelluleLost from './CelluleLost';

window.onload = () => {
  const canvas = document.querySelector('#canvasPerdu');
  const ctx = canvas.getContext('2d');

  const x = 70;
  const y = 50;
  const marge = 5;

  const world = new WorldLost(ctx, x, y);

  for (let i = 0; i < 1; i++) {
    generationWorker(world);
  }

  setDimensions(canvas, x, y, marge);
};

const setDimensions = (canvas, x, y, marge) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  CelluleLost.widthCell = Math.min((canvas.width - marge * 2) / x, (canvas.height - marge * 2) / y);
  window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
};

function generationWorker (world) {
  const workerPerdu = new window.Worker('js/wGenerationLost.js');
  workerPerdu.postMessage({ matrice: world.dataGrille, time: 15, fx: 'start' });
  workerPerdu.onmessage = (ev) => {
    world.update(ev.data[0]);
    world.update(ev.data[1]);
  };
  return workerPerdu;
}
