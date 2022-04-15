import Visualizer from "./Visualizer";

export default class VisualizerUpdateManager {
    /**
     * 
     * @param {Visualizer} visualizer the visualizer this manager obtains data from.
     */
    constructor(visualizer) {
        this._binnedListeners = [];
        for (let i = 0; i < visualizer.getNumberOfBins(); i++) {
            this._binnedListeners.push([]);
        }
        this._lastBins = new Uint8Array(this._binnedListeners.length);

        visualizer.addUpdateListener((delta, bins) => {
            for (let binInd = 0; binInd < this._lastBins.length; binInd++) {
                const lastBin = this._lastBins[binInd];
                if (lastBin !== bins[binInd]) {
                    this._binnedListeners[binInd].forEach(listener => {
                        listener(delta, bins[binInd] - lastBin);
                    });
                    this._lastBins[binInd] = bins[binInd];
                }
            }
        });
    }

    /**
     * @callback visualizerBinUpdateListener
     * @param {number} timeDelta elapsed time since last update.
     * @param {number} ampDelta change in amplitude of the frequency bin.
     */

    /**
     * 
     * @param {number} freqBin the frequency bin this update listener should listen to.
     * @param {visualizerBinUpdateListener} listener the listener itself that will be called upon the bin updating.
     * @returns {boolean} true if and only if the updater was added successfully, otherwise, false.
     */
    AddVisualizerBinUpdateListener(freqBin, listener) {
        if (this._binnedListeners[freqBin].includes(listener)) return false;
        this._binnedListeners[freqBin].push(listener);
        return true;
    }

    /**
     * 
     * @param {number} freqBin the frequency bin the update listener to be removed from is in.
     * @param {visualizerBinUpdateListener} listener the listener that is to be removed.
     * @returns {boolean} true if and only if the listener was successfully removed.
     */
    removeVisualizerBinUpdateListener(freqBin, listener) {
        const removeIndex = this._binnedListeners[freqBin].indexOf(listener);
        if (removeIndex < 0) return false;
        this._binnedListeners[freqBin].splice(removeIndex, 1);
        return true;
    }

    /**
     * 
     * @param {visualizerBinUpdateListener[][]} binnedListeners an array of the same length as the number of bins where each element is another array containing the listeners for that bin.
     * @returns {boolean} true if and only if successfully loaded the new listeners.
     */
    setBinnedListeners(binnedListeners) {
        if (binnedListeners.length !== this._binnedListeners.length) return false;
        this._binnedListeners = binnedListeners;
        return true;
    }

    /**
     * 
     * @returns {visualizerBinUpdateListener[][]} an array of the same length as the number of bins where each element is another array containing the listeners for that bin.
     */
    getBinnedListeners() {
        return this._binnedListeners;
    }
}