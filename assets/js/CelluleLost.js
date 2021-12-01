
export default class CelluleLost {

    static widthCell = 20;
    static margeTop = 5;
    static margeLeft = 5;

    constructor (x, y) {
        this.posX = x;
        this.posY = y;

        this.coords = {
            top: false,
            down: false,
            left: false,
            right: false,
            visited: false,
            updated: 0
        }

        this.calculDimensions ();
    }

    calculDimensions () {
        this.clientX = this.posX * CelluleLost.widthCell + CelluleLost.margeLeft;
        this.clientY = this.posY * CelluleLost.widthCell + CelluleLost.margeTop;
    }

    drawCellule (ctx) {
        if (this.coords.updated < 2) {
            ctx.save ();
            ctx.translate (this.clientX, this.clientY);
            ctx.clearRect (0, 0, CelluleLost.widthCell, CelluleLost.widthCell);

            if (!this.coords.top) {
                this.drawLine (ctx, 0, 0, CelluleLost.widthCell, 0);
            }
            if (!this.coords.down) {
                this.drawLine (ctx, 0, CelluleLost.widthCell, CelluleLost.widthCell, CelluleLost.widthCell);
            }
            if (!this.coords.left) {
                this.drawLine (ctx, 0, 0, 0, CelluleLost.widthCell);
            }
            if (!this.coords.right) {
                this.drawLine (ctx, CelluleLost.widthCell, 0, CelluleLost.widthCell, CelluleLost.widthCell);
            }

            this.coords.updated++;

            ctx.restore ();
        }
    }

    drawLine (ctx, x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    getValues () {
        return {top: this.coords.top,
            down: this.coords.down,
            left: this.coords.left,
            right: this.coords.right}
    }
}