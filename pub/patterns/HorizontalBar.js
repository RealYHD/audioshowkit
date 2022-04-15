"use strict";

function bindHorizontalBar(canvasElement, visualizerCore) {
    let _width = canvasElement.width;
    let _height = canvasElement.height;
    let _canvasCtx = canvasElement.getContext("2d");
    let _visualizerCore = visualizerCore;
    let update = function (delta, bins) {
        _canvasCtx.clearRect(0, 0, _width, _height); // clear canvas.
        let barWidth = Math.floor(_width / bins.length) - 1; // -1 for 1 pixel gap between bars.
        let barIndex = 0;
        bins.forEach(bin => {
            let normalBin = bin / 255.0;
            _canvasCtx.fillStyle = "rgb(" + 0 + "," + bin + "," + bin + ")";
            let barHeight = _height * normalBin;
            _canvasCtx.fillRect(barIndex * barWidth, _height - barHeight, barWidth, barHeight);
            barIndex += 1;
        });
    };
    _visualizerCore.addUpdateListener(update);
}