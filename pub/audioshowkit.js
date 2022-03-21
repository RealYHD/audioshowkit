"use strict";

function VisualizerCore(mediaSource, fftSize = 1024) {
    this._stream = mediaSource;
    this._analyzing = false;
    this._updateListeners = [];
    this._audioCtx = new window.AudioContext();
    this._source = null; // Prepare for either a MediaStream or a MediaElement.
    try {
        this.source = this._audioCtx.createMediaStreamSource(this._stream);
    } catch (e) {
        this._source = this._audioCtx.createMediaElementSource(this._stream);
    }
    this._analyzer = this._audioCtx.createAnalyser();
    this._analyzer.fftSize = fftSize;
    this._source.connect(this._analyzer);
    this._analyzer.connect(this._audioCtx.destination);
    this._buffer = new Uint8Array(this._analyzer.frequencyBinCount);

    this.lastUpdate = null;

    this.analyze = function () {
        if (this._analyzing) {
            return;
        }
        this._analyzing = true;
        requestAnimationFrame(this.update);
    };

    let vcore = this; // since calling from requestAnimationFrame means "this" is no longer set to produced object.
    this.update = function (timestamp) {
        if (!vcore._analyzing) return;

        requestAnimationFrame(vcore.update);
        if (!vcore.lastUpdate) {
            vcore.lastUpdate = timestamp;
        }
        let delta = timestamp - vcore.lastUpdate;
        vcore._analyzer.getByteFrequencyData(vcore._buffer);

        vcore._updateListeners.forEach(listener => {
            listener(delta, vcore._buffer);
        });
    };
    this.stop = function () {
        this._analyzing = false;
    };
    this.addUpdateListener = function (listener) {
        this._updateListeners.push(listener);
    };
    this.getNumberOfBins = function () {
        return this._buffer.length;
    };
}
