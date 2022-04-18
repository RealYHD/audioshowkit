/**
 * @callback visualizerUpdateListener
 * @param {number} delta elapsed time since last update.
 * @param {Uint8Array} bins the bins with varying frequency values. 
 */

/**
 * Provides a simplified access point to the frequency bins in the form of a visualization update listener.
 */
export default class Visualizer {
    #source;
    #stream;
    #analyzing = false;
    #updateListeners = [];
    #audioCtx;
    #analyzer;
    #buffer;
    #lastUpdate;
    #fftSize;

    /**
     * 
     * @param {MediaSource|HTMLMediaElement} stream a media source to analyze.
     * @param {number} [fftSize = 1024] the size of the fft window.
     */
    constructor(stream, fftSize = 1024) {
        this.#fftSize = fftSize;
        this.#stream = stream;
        this.#analyzing = false;
        this.#updateListeners = [];
        this.#lastUpdate = null;
    }

    #initialize() {
        this.#audioCtx = new window.AudioContext();
        if (this.#stream instanceof HTMLMediaElement) {
            this.#source = this.#audioCtx.createMediaElementSource(this.#stream);
        } else {
            this.#source = this.#audioCtx.createMediaStreamSource(this.#stream);
        }
        this.#analyzer = this.#audioCtx.createAnalyser();
        this.#analyzer.fftSize = this.fftSize;
        this.#buffer = new Uint8Array(this.#analyzer.frequencyBinCount);
        this.#source.connect(this.#analyzer);
        this.#analyzer.connect(this.#audioCtx.destination);
    }

    /**
     * Begins analyzing and sending out update pings.
     */
    analyze() {
        if (this.#analyzing) {
            return;
        }
        if (!this.#audioCtx) this.#initialize();
        this.#analyzing = true;
        let self = this; // since calling from requestAnimationFrame means "this" is no longer set to produced object.
        const update = (timestamp) => {
            if (!self.#analyzing) return;

            if (!self.#lastUpdate) {
                self.#lastUpdate = timestamp;
            }
            let delta = timestamp - self.#lastUpdate;
            self.#analyzer.getByteFrequencyData(self.#buffer);

            self.#updateListeners.forEach(listener => {
                listener(delta, self.#buffer);
            });
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    }

    /**
     * Stops the analysis. Listeners will stop receiving bins.
     */
    stop() {
        this.#analyzing = false;
    }

    /**
     * 
     * @param {visualizerUpdateListener} listener the visualizer update listener to be registered.
     * @returns {boolean} true if and only if the listener was successfully added.
     */
    addUpdateListener(listener) {
        console.log("visualizer received listener");
        if (this.#updateListeners.includes(listener));
        this.#updateListeners.push(listener);
        return true;
    }

    /**
     * 
     * @param {visualizerUpdateListener} listener the visualizer update listener to remove.
     * @returns {boolean} true if and only if the removal of the listener was a success.
     */
    removeUpdateListener(listener) {
        const removeIndex = this.#updateListeners.indexOf(listener);
        if (removeIndex < 0) return false;

        this.#updateListeners.splice(removeIndex, 1);
        return true;
    }


    /**
     * @returns {number} The number of bins based on the size of the FFT window.
     */
    get numberOfBins() {
        return this.#buffer.length;
    }

    /**
     * 
     * @returns {number} The fft window size.
     */
    get fftSize() {
        return this.#fftSize;
    }
}