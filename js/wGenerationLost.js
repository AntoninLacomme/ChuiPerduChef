let matrice;
let X, Y;
let time;
let cellsToDo;

onmessage = (e) => { // eslint-disable-line no-undef
  if (e.data.fx === 'start') {
    matrice = e.data.matrice;
    time = e.data.time;

    Y = matrice.length;
    X = matrice[0].length;

    const cell = matrice[(Math.random() * X) | 0][(Math.random() * Y) | 0];
    cellsToDo = [[cell, cell]];
    do {
      const currentWork = cellsToDo.pop();
      generation(currentWork[0], currentWork[1]);
    } while (cellsToDo.length > 0);
  }
};

function generation (cellule, celluleAppelante) {
  if (cellule.coords.visited) {
    return false;
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

  postMessage([cellule, celluleAppelante]); // eslint-disable-line no-undef

  let voisins = getVoisinNotVisited(cellule);
  let rdm = 0;
  while (voisins.length > 0) {
    sleep(time);
    rdm = (Math.random() * voisins.length) | 0;
    generation(voisins[rdm], cellule);
    voisins = getVoisinNotVisited(cellule);
  }
  return false;
}

function sleep (ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    // Do nothing
  }
}

const coordsAreInMatrice = (x, y) => {
  if (x < 0 || y < 0) {
    return false;
  }
  if (x >= X || y >= Y) {
    return false;
  }
  return true;
};

const getVoisinNotVisited = (c) => {
  const cells = [];
  for (let i = -1; i < 2; i = i + 2) {
    if (coordsAreInMatrice(c.posX, c.posY + i)) {
      if (!matrice[c.posY + i][c.posX].coords.visited) {
        cells.push(matrice[c.posY + i][c.posX]);
      }
    }
    if (coordsAreInMatrice(c.posX + i, c.posY)) {
      if (!matrice[c.posY][c.posX + i].coords.visited) {
        cells.push(matrice[c.posY][c.posX + i]);
      }
    }
  }
  return cells;
}
;
