import WorldLost from "/js/WorldLost.js";
import CelluleLost from "/js/CelluleLost.js";

window.onload = () => {
    var canvas = document.querySelector ("#canvasPerdu");
    var ctx = canvas.getContext ("2d");

    let x = 200;
    let y = 200;
    let marge = 5;

    var world = new WorldLost (ctx, x, y);
/*
    for (let i=0; i<1; i++) {
        generationWorker (world);
    }
*/


    setDimensions (canvas, world, x, y, marge);
}

let setDimensions = (canvas, world, x, y, marge) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let ctx = canvas.getContext("2d");

    CelluleLost.widthCell = Math.min ((canvas.width - marge * 2) / x, (canvas.height - marge * 2) / y);
    window.onresize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    world.redimentionCellules ();

    canvas.zoom = 1;
    canvas.currentZoom = 1;
    canvas.transX = 0;
    canvas.transY = 0;
    
    canvas.addEventListener ("wheel", (ev) => {
        if (ev.wheelDeltaY > 0) {
            canvas.zoom = 1.2
            canvas.currentZoom *= 1.2;
        }
        if (ev.wheelDeltaY < 0) {
            canvas.zoom = 0.8;
            canvas.currentZoom *= 0.8;
        }
        ctx.scale (canvas.zoom, canvas.zoom);
        world.redrawAllCells ();
        
        ctx.clearRect (0, 0, canvas.width * 100, canvas.height * 100)
    })

    canvas.move = false;
    canvas.addEventListener ("mousedown", (ev) => {
        canvas.move = true;
    })

    canvas.addEventListener ("mouseup", (ev) => {
        canvas.move = false;
    })

    canvas.addEventListener ("mousemove", (ev) => {
        if (canvas.move) {
            ctx.translate (ev.movementX, ev.movementY);
            ctx.clearRect (-canvas.width * 100, -canvas.height * 100, canvas.width * 200, canvas.height * 200)
            world.redrawAllCells ();
        }
    })
}

function generationWorker (world) {
    let workerPerdu = new Worker ("js/wGenerationLost.js");
    workerPerdu.postMessage ({"matrice": world.dataGrille, "time": 0, "fx": "start"});
    workerPerdu.onmessage = (ev) => {
        world.update (ev.data[0]);
        world.update (ev.data[1]);
    }
    return workerPerdu;
}