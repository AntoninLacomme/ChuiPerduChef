import CelluleLost from './CelluleLost';

export default class WorldLost {
  constructor (ctx, x, y) {
    this.dataGrille = this.generateDataGrille(x, y);

    this.ctx = ctx;
    this.runWorld();
  }

  generateDataGrille (x, y) {
    const mat = [];
    for (let i = 0; i < y; i++) {
      const line = [];
      for (let j = 0; j < x; j++) {
        line.push(new CelluleLost(j, i));
      }
      mat.push(line);
    }
    return mat;
  }

  update (skeletonCell) {
    this.dataGrille[skeletonCell.posY][skeletonCell.posX].coords = skeletonCell.coords;
  }

  drawWorld () {
    this.ctx.strokeStyle = 'ivory';
    this.dataGrille.forEach((line) => {
      line.forEach((cell) => {
        cell.drawCellule(this.ctx);
      });
    });
  }

  runWorld () {
    this.drawWorld();
    window.requestAnimationFrame(this.runWorld.bind(this));
  }
}
