
export default class CelluleLost {
  constructor (x, y) {
    this.posX = x;
    this.posY = y;

    this.coords = {
      top: false,
      down: false,
      left: false,
      right: false,
      visited: false,
      updated: true
    };
  }

  drawCellule (ctx) {
    if (this.coords.updated) {
      ctx.save();
      ctx.translate(this.posX * CelluleLost.widthCell + CelluleLost.margeLeft, this.posY * CelluleLost.widthCell + CelluleLost.margeTop);
      ctx.clearRect(0, 0, CelluleLost.widthCell, CelluleLost.widthCell);

      if (!this.coords.top) {
        this.drawLine(ctx, 0, 0, CelluleLost.widthCell, 0);
      }
      if (!this.coords.down) {
        this.drawLine(ctx, 0, CelluleLost.widthCell, CelluleLost.widthCell, CelluleLost.widthCell);
      }
      if (!this.coords.left) {
        this.drawLine(ctx, 0, 0, 0, CelluleLost.widthCell);
      }
      if (!this.coords.right) {
        this.drawLine(ctx, CelluleLost.widthCell, 0, CelluleLost.widthCell, CelluleLost.widthCell);
      }

      this.coords.updated = false;

      ctx.restore();
    }
  }

  drawLine (ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

CelluleLost.widthCell = 20;
CelluleLost.margeTop = 5;
CelluleLost.margeLeft = 5;
