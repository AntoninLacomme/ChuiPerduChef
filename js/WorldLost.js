import CelluleLost from "/js/CelluleLost.js";

export default class WorldLost {

    constructor (ctx, x, y, time=100) {
        this.dataGrille = this.generateDataGrille (x, y);
        this.nbLines = y;
        this.nbColumns = x;
        this.listToRedraw = [];
        this.time = time;

        this.ctx = ctx;

        this.updated = true;

        this.redrawAllCells ();

        let rdmX = (Math.random() * x) | 0;
        let rdmY = (Math.random() * y) | 0;
        let cell = this.dataGrille[rdmY][rdmX];
        this.generation (cell, cell);
        this.regeneration ();

        this.runWorld ();
    }

    generateDataGrille (x, y) {
        let mat = [];
        for (let i=0; i<y; i++) {
            let line = [];
            for (let j=0; j<x; j++) {
                line.push (new CelluleLost (j, i));
            }
            mat.push (line);
        }
        return mat;
    }

    getVoisinNotVisited (c) {
        let cells = [];
        for (let i=-1; i<2; i=i+2) {
            if (this.coordsAreInMatrice (c.posX, c.posY+i)) {
                if (!this.dataGrille[c.posY+i][c.posX].coords.visited) {
                    cells.push(this.dataGrille[c.posY+i][c.posX]);
                }
            }
            if (this.coordsAreInMatrice (c.posX + i, c.posY)) {
                if (!this.dataGrille[c.posY][c.posX + i].coords.visited) {
                    cells.push(this.dataGrille[c.posY][c.posX + i]);
                }
            }
        }
        return cells;
    }

    coordsAreInMatrice (x, y) {
        if (x < 0 || y < 0) {
            return false;
        }
        if (x >= this.nbColumns || y >= this.nbLines) {
            return false;
        }
        return true;
    }

    async generation (cellule, celluleAppelante) {
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
    
        // this.update (cellule, celluleAppelante);
    
        let voisins = this.getVoisinNotVisited (cellule);
        let rdm = 0;
        try {
            
            while (voisins.length > 0) {
                rdm = (Math.random() * voisins.length) | 0;
                this.generation (voisins[rdm], cellule);            
                voisins = this.getVoisinNotVisited (cellule);
            }
        }  catch (e) {
            voisins[rdm].coords = {
                top: false,
                down: false,
                left: false,
                right: false,
                visited: false,
                updated: true
            }
            this.listToRedraw.push ([cellule, celluleAppelante]);
            return null;
        }
        return false;
    }

    async regeneration () {
        let l = this.listToRedraw.slice(0, this.listToRedraw.length);
        this.listToRedraw = [];
    
        l.forEach((tuple) => {
            tuple[0].coords.visited = false;
            tuple[0].coords.updated = false;
            this.generation (tuple[0], tuple[1], true);
        })
    
        if (this.listToRedraw.length > 0) {
            this.regeneration ();
        }
    }



    update (skeletonCell1, skeletonCell2) {
        this.dataGrille[skeletonCell1.posY][skeletonCell1.posX].coords = skeletonCell1.coords;
        this.dataGrille[skeletonCell2.posY][skeletonCell2.posX].coords = skeletonCell2.coords;
    }

    drawWorld () {
        this.ctx.strokeStyle = "ivory";
        for (let line=0; line<this.nbLines; line++) {
            for (let column=line%2; column<this.nbColumns; column = column + 2) {
                if (line%2 == column%2) {
                    this.dataGrille[line][column].drawCellule (this.ctx);
                }
            }
        }

        if (this.updated) {
            this.drawLimits (this.ctx);
            this.updated = false;
        }
    }

    drawLimits (ctx) {
        ctx.save ();
        ctx.translate (CelluleLost.margeLeft, CelluleLost.margeTop);
        ctx.strokeRect (0, 0, this.nbColumns * CelluleLost.widthCell, this.nbLines * CelluleLost.widthCell);
        ctx.restore ();
    }

    redrawAllCells () {
        this.updated = true;
        this.dataGrille.forEach ((line) => {
            line.forEach ((cell) => {
                cell.coords.updated = true;
            });
        });
    }

    redimentionCellules () {
        this.dataGrille.forEach ((line) => {
            line.forEach ((cell) => {
                cell.calculDimensions ();
            });
        });
    }

    runWorld () {
        this.drawWorld ()
        window.requestAnimationFrame (this.runWorld.bind (this));
    }
}



function sleep (ms) {
    const start = Date.now();
    while (Date.now() - start < ms) {

    }
}