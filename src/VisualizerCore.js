"use strict";

export default function VisualizerCore(mediaSource, fftSize = 1024) {
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

    let _self = this;
    this.update = function (timestamp) {
        if (!_self._analyzing) return;

        requestAnimationFrame(_self.update);
        if (!_self.lastUpdate) {
            _self.lastUpdate = timestamp;
        }
        let delta = timestamp - _self.lastUpdate;
        _self._analyzer.getByteFrequencyData(_self._buffer);

        _self._updateListeners.forEach(listener => {
            listener(delta, _self._buffer);
        });
    };
    this.stop = function () {
        this._analyzing = false;
    };
    this.addUpdateListener = function (listener) {
        console.log("added listener.");
        this._updateListeners.push(listener);
    };
    this.getNumberOfBins = function () {
        return this._buffer.length;
    };
}
