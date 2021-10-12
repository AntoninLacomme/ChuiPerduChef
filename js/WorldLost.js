import CelluleLost from './CelluleLost.js';

export default class WorldLost {
  constructor (ctx, x, y, drawTime, initCells = false) {
    this.generateDataGrille(x, y, initCells);
    this.x = x;
    this.y = y;

    this.ctx = ctx;
    this.drawTime = drawTime;
    if (this.drawTime !== Infinity) this.runWorld();
  }

  generateDataGrille (x, y, initCells) {
    this.dataGrille = [];
    for (let i = 0; i < y; i++) {
      const list = [];
      if (initCells) {
        for (let j = 0; j < x; j++) {
          list.push(new CelluleLost(j, i));
        }
      } else {
        for (let j = 0; j < x; j++) {
          list.push(null);
        }
      }
      this.dataGrille.push(list);
    }
  }

  update (skeletonCell) {
    this.dataGrille[skeletonCell.posY][skeletonCell.posX].coords = skeletonCell.coords;
  }

  drawWorld () {
    console.log('draw');
    this.ctx.strokeStyle = 'ivory';
    this.dataGrille.forEach((line) => {
      line.forEach((cell) => {
        if (cell) {
          // console.log('draw cell');
          cell.drawCellule(this.ctx);
        }
      });
    });
  }

  runWorld () {
    this.drawWorld();
    if (!this.drawTime || this.drawTime === 0) {
      window.requestAnimationFrame(this.runWorld.bind(this));
    } else if (this.drawTime !== Infinity) {
      setTimeout(this.runWorld.bind(this), this.drawTime);
    }
  }
}
