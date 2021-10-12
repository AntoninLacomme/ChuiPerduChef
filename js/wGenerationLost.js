var matrice;
var X, Y;
var time;
var listToRedraw = [];
var itrace = 0;

onmessage = (e) => {
    if (e.data.fx == "start") {
        matrice = e.data.matrice;
        time = e.data.time;

        Y = matrice.length;
        X = matrice[0].length;
        let rdmX = (Math.random() * X) | 0;
        let rdmY = (Math.random() * Y) | 0;
        console.log(matrice, rdmX, rdmY)

        let cell = matrice[rdmY][rdmX];
        generation (cell, cell);
        regeneration ();        
    }
}

function regeneration () {
    let l = listToRedraw.slice(0, listToRedraw.length);
    console.log (listToRedraw);
    listToRedraw = [];

    l.forEach((tuple) => {
        itrace = 0;
        tuple[0].coords.visited = false;
        tuple[0].coords.updated = false;
        generation (tuple[0], tuple[1], true);
    })

    if (listToRedraw.length > 0) {
        regeneration ();
    }
}

function generation (cellule, celluleAppelante, trace=false) {
    if (cellule.coords.visited) {
        if (trace) {
            console.log("DEJA VISTEE")
        }
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

    postMessage ([cellule, celluleAppelante]);

    let voisins = getVoisinNotVisited (cellule);
    let rdm = 0;
    while (voisins.length > 0) {        
        sleep(time)
        rdm = (Math.random() * voisins.length) | 0;
        try {
            generation (voisins[rdm], cellule);
        }  catch (e) {
            console.log("AIE MAX PILE SIZE EXCEPTION !");
            voisins[rdm].coords = {
                top: false,
                down: false,
                left: false,
                right: false,
                visited: false,
                updated: true
            }
            listToRedraw.push ([cellule, celluleAppelante]);
            return null;
        }
        
        voisins = getVoisinNotVisited (cellule);
    }
    return false;
}




function sleep (ms) {
    const start = Date.now();
    while (Date.now() - start < ms) {

    }
}

let coordsAreInMatrice = (x, y) => {
    if (x < 0 || y < 0) {
        return false;
    }
    if (x >= X || y >= Y) {
        return false;
    }
    return true;
}

let getVoisinNotVisited = (c) => {
    let cells = [];
    for (let i=-1; i<2; i=i+2) {
        if (coordsAreInMatrice (c.posX, c.posY+i)) {
            if (!matrice[c.posY+i][c.posX].coords.visited) {
                cells.push(matrice[c.posY+i][c.posX]);
            }
        }
        if (coordsAreInMatrice (c.posX + i, c.posY)) {
            if (!matrice[c.posY][c.posX + i].coords.visited) {
                cells.push(matrice[c.posY][c.posX + i]);
            }
        }
    }
    return cells;
}