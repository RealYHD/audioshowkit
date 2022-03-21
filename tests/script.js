"use strict";

import bindHorizontalBar from "../src/patterns/HorizontalBar.js";
import VisualizerCore from "../src/VisualizerCore.js";

// We will see if the visualizers core and event systems are working correctly.
let startBtn = document.getElementById("startbtn");
startBtn.addEventListener("click", async (ev) => {
    let mediaStream = new Audio("../tests/Elektronomia - Collide.mp3");
    mediaStream.addEventListener("canplaythrough", (ev) => {
        let visCore = new VisualizerCore(mediaStream, 128);
        let coreAndEventCanvas = document.createElement("canvas");
        coreAndEventCanvas.width = 640;
        coreAndEventCanvas.height = 200;

        console.log("starting playthrough.");
        mediaStream.play();
        visCore.analyze();
        document.body.appendChild(coreAndEventCanvas);

        bindHorizontalBar(coreAndEventCanvas, visCore);
    });

});