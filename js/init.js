import WorldLost from "/js/WorldLost.js";
import CelluleLost from "/js/CelluleLost.js";

window.onload = () => {
    var canvas = document.querySelector ("#canvasPerdu");
    var ctx = canvas.getContext ("2d");

    let x = 70;
    let y = 50;
    let marge = 5;

    var world = new WorldLost (ctx, x, y);

    for (let i=0; i<1; i++) {
        generationWorker (world);
    }

    setDimensions (canvas, x, y, marge);
}

let setDimensions = (canvas, x, y, marge) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    CelluleLost.widthCell = Math.min ((canvas.width - marge * 2) / x, (canvas.height - marge * 2) / y);
    window.onresize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}

function generationWorker (world) {
    let workerPerdu = new Worker ("js/wGenerationLost.js");
    workerPerdu.postMessage ({"matrice": world.dataGrille, "time": 15, "fx": "start"});
    workerPerdu.onmessage = (ev) => {
        world.update (ev.data[0]);
        world.update (ev.data[1]);
    }
    return workerPerdu;
}