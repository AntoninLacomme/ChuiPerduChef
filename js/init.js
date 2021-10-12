import WorldLost from './WorldLost.js';
import CelluleLost from './CelluleLost.js';
import GenerationWorker from './wGenerationLost.js';

window.onload = () => {
  const canvas = document.querySelector('#canvasPerdu');
  const ctx = canvas.getContext('2d');

  const x = 1000;
  const y = 500;
  const marge = 5;

  const world = new WorldLost(ctx, x, y, 1000, false);

  // setTimeout(generationWorker, 1000, world);
  generationWorker(world);

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
  const generationWorker = new GenerationWorker();
  const x = Math.floor(Math.random() * world.x);
  const y = Math.floor(Math.random() * world.y);
  const cell = new CelluleLost(x, y);
  world.dataGrille[y][x] = cell;
  generationWorker.onMessage = (data) => {
    if (data === null) return;
    if (data.state === 'done') {
      window.alert('done');
      world.drawWorld();
    } else if (data.state === 'building') {
      world.update(data.current[0]);
      world.update(data.current[1]);
    }
  };
  generationWorker.generateWorld(world, 0, x, y);
  return generationWorker;
}
