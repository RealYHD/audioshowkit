export default class VisualizerCore {
    constructor(mediaSource, fftSize = 1024) {
        this._stream = mediaSource;
        this._analyzing = false;
        this._updateListeners = [];
        this._audioCtx = new window.AudioContext();
        if (mediaSource instanceof HTMLMediaElement) {
            this._source = this._audioCtx.createMediaElementSource(this._stream);
        } else {
            this._source = this._audioCtx.createMediaStreamSource(this._stream);
        }
        this._analyzer = this._audioCtx.createAnalyser();
        this._analyzer.fftSize = fftSize;
        this._source.connect(this._analyzer);
        this._analyzer.connect(this._audioCtx.destination);
        this._buffer = new Uint8Array(this._analyzer.frequencyBinCount);

        this.lastUpdate = null;
    }

    analyze() {
        if (this._analyzing) {
            return;
        }
        this._analyzing = true;
        let self = this; // since calling from requestAnimationFrame means "this" is no longer set to produced object.
        requestAnimationFrame((timestamp) => {
            if (!self._analyzing) return;

            requestAnimationFrame(self.update);
            if (!self.lastUpdate) {
                self.lastUpdate = timestamp;
            }
            let delta = timestamp - self.lastUpdate;
            self._analyzer.getByteFrequencyData(self._buffer);

            self._updateListeners.forEach(listener => {
                listener(delta, self._buffer);
            });
        });
    }

    stop() {
        this._analyzing = false;
    }
    addUpdateListener(listener) {
        this._updateListeners.push(listener);
    }
    getNumberOfBins() {
        return this._buffer.length;
    }
}
