"use strict";

import bindHorizontalBar from "../src/patterns/HorizontalBar.js";
import VisualizerCore from "../src/VisualizerCore.js";

// We will see if the visualizers core and event systems are working correctly.
let startBtn = document.getElementById("startbtn");
startBtn.addEventListener("click", async (ev) => {
    let mediaStream = new Audio("../tests/Elektronomia - Collide.mp3");
    mediaStream.addEventListener("canplaythrough", (ev) => {
        let visCore = new VisualizerCore(mediaStream, 128);
        let coreAndEventCanvas = document.getElementById("horizontal");
        coreAndEventCanvas.width = 640;
        coreAndEventCanvas.height = 200;

        console.log("starting playthrough.");
        mediaStream.play();
        visCore.analyze();

        bindHorizontalBar(coreAndEventCanvas, visCore); // Pre-made simple horizontal bar visualizer.

        let widthDiv = document.getElementById("widthDiv");
        widthDiv.style.height = "20px";
        widthDiv.style.backgroundColor = "orange";
        visCore.addUpdateListener((delta, bins) => {
            widthDiv.style.width = bins[3] + "px";
        })

        let colourDiv = document.getElementById("colourDiv");
        colourDiv.style.height = "20px";
        visCore.addUpdateListener((delta, bins) => {
            colourDiv.style.backgroundColor = "rgb(" + bins[0] + "," + bins[1] + ", " + bins[4] + ")";
        })
    });

});