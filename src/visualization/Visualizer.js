/**
 * Instantiates a visualizer with a given FFT window size and media source.
 * Provides a simplified access point to the frequency bins in the form of a visualization update listener.
 */
export default class Visualizer {

    /**
     * @callback visualizerUpdateListener
     * @param {number} delta elapsed time since last update.
     * @param {Uint8Array} bins the bins with varying frequency values. 
     */

    /**
     * 
     * @param {MediaSource|HTMLMediaElement} mediaSource a media source to analyze.
     * @param {number} [fftSize = 1024] the size of the fft window.
     */
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
        this._buffer = new Uint8Array(this._analyzer.frequencyBinCount);
        this._source.connect(this._analyzer);
        this._analyzer.connect(this._audioCtx.destination);

        this.lastUpdate = null;
    }


    /**
     * Begins analyzing and sending out update pings.
     */
    analyze() {
        if (this._analyzing) {
            return;
        }
        this._analyzing = true;
        let self = this; // since calling from requestAnimationFrame means "this" is no longer set to produced object.
        const update = (timestamp) => {
            if (!self._analyzing) return;

            if (!self.lastUpdate) {
                self.lastUpdate = timestamp;
            }
            let delta = timestamp - self.lastUpdate;
            self._analyzer.getByteFrequencyData(self._buffer);

            self._updateListeners.forEach(listener => {
                listener(delta, self._buffer);
            });
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    }

    /**
     * Stops the analysis. Listeners will stop receiving bins.
     */
    stop() {
        this._analyzing = false;
    }

    /**
     * 
     * @param {visualizerUpdateListener} listener the visualizer update listener to be registered.
     * @returns {boolean} true if and only if the listener was successfully added.
     */
    addUpdateListener(listener) {
        if (this._updateListeners.includes(listener));
        this._updateListeners.push(listener);
        return true;
    }

    /**
     * 
     * @param {visualizerUpdateListener} listener the visualizer update listener to remove.
     * @returns {boolean} true if and only if the removal of the listener was a success.
     */
    removeUpdateListener(listener) {
        const removeIndex = this._updateListeners.indexOf(listener);
        if (removeIndex < 0) return false;

        this._updateListeners.splice(removeIndex, 1);
        return true;
    }


    /**
     * 
     * @returns {number} the number of bins based on the size of the FFT window.
     */
    getNumberOfBins() {
        return this._buffer.length;
    }

    /**
     * 
     * @returns {number} the fft window size.
     */
    getFftSize() {
        return this._analyzer.fftSize;
    }
}
