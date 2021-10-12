import CelluleLost from './CelluleLost.js';

let w;
let cellsToDo;
let currentWork;

export default class GenerationWorker {
  async generateWorld (world, time, x, y) {
    w = world;
    const cell = world.dataGrille[y][x];
    cellsToDo = [[cell, cell]];
    do {
      currentWork = cellsToDo.pop();
      if (currentWork[0] === null) {
        currentWork[0] = new CelluleLost(currentWork[3], currentWork[2]);
        w.dataGrille[currentWork[2]][currentWork[3]] = currentWork[0];
      }
      const newCells = this.generation(currentWork[0], currentWork[1]);
      if (newCells !== null && newCells.length > 0) cellsToDo.push(...shuffle(newCells));
    } while (cellsToDo.length > 0);
    if (cellsToDo.length === 0) this.onMessage({ state: 'done' });
  }

  generation (cellule, celluleAppelante) {
    if (cellule.coords.visited) {
      return null;
    }
    cellule.coords.visited = true;
    switch (cellule.posX - celluleAppelante.posX) {
      case 0:
        break;
      case 1:
        cellule.coords.left = true;
        celluleAppelante.coords.right = true;
        break;
      case -1:
        cellule.coords.right = true;
        celluleAppelante.coords.left = true;
        break;
    }

    switch (cellule.posY - celluleAppelante.posY) {
      case 0:
        break;
      case 1:
        cellule.coords.top = true;
        celluleAppelante.coords.down = true;
        break;
      case -1:
        cellule.coords.down = true;
        celluleAppelante.coords.top = true;
        break;
    }
    cellule.coords.updated = true;
    celluleAppelante.coords.updated = true;

    this.onMessage({ state: 'building', current: [cellule, celluleAppelante] }); // eslint-disable-line no-undef

    return getVoisinNotVisited(cellule);
  }

  onMessage () { /* Implement this */ }
}

function shuffle (a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const coordsAreInMatrice = (x, y) => {
  if (x < 0 || y < 0) {
    return false;
  }
  if (x >= w.x || y >= w.y) {
    return false;
  }
  return true;
};

const getVoisinNotVisited = (c) => {
  const cells = [];
  for (let i = -1; i < 2; i = i + 2) {
    if (coordsAreInMatrice(c.posX, c.posY + i)) {
      if (w.dataGrille[c.posY + i][c.posX] === null || !w.dataGrille[c.posY + i][c.posX].coords.visited) {
        cells.push([w.dataGrille[c.posY + i][c.posX], c, c.posY + i, c.posX]);
      }
    }
    if (coordsAreInMatrice(c.posX + i, c.posY)) {
      if (w.dataGrille[c.posY][c.posX + i] === null || !w.dataGrille[c.posY][c.posX + i].coords.visited) {
        cells.push([w.dataGrille[c.posY][c.posX + i], c, c.posY, c.posX + i]);
      }
    }
  }
  return cells;
};
