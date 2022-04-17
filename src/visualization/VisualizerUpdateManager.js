import Visualizer from "./Visualizer.js";


/**
 * A visualizer update manager offers an extra layer of abstraction on top of the {@link Visualizer}'s update listener.
 * 
 * Specifically, the update manager handles updates directly from the {@link Visualizer} and checks for changes in the individual bins. These changes are then broadcasted to the individual bin listeners.
 * In the rare event that a bin has not changed, then it will not receive an update call.
 */
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
                        listener(delta, bins[binInd], bins[binInd] - lastBin);
                    });
                    this._lastBins[binInd] = bins[binInd];
                }
            }
        });
    }

    /**
     * @callback visualizerBinUpdateListener
     * @param {number} timeDelta elapsed time since last update.
     * @param {number} amplitude The amplitude of the associated bin.
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
     * Similar to {@link VisualizerUpdateManager#AddVisualizerBinUpdateListener}, this method adds the same listener to a range of bins.
     * 
     * @param {number} min The lower bound of the bins to listen to (inclusive).
     * @param {number} max The upper bound of the bins to listen to (inclusive).
     * @param {visualizerBinUpdateListener} listener The listener to register to these bins. 
     * @returns {boolean} True if and only if the listener was added at least once.
     */
    addVisualizerRangeUpdateListener(min, max, listener) {
        let added = false;
        for (let i = min; i <= max; i++) {
            if (this.AddVisualizerBinUpdateListener(i, listener)) added = true;
        }
        return added;
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
     * Similar to {@link removeVisualizerBinUpdateListener}, this method removes the given listener from a range of bins.
     * 
     * @param {number} min The lower bound of bins to remove the listener from (inclusive).
     * @param {number} max The upper bound of bin to remove the listener from (inclusive.)
     * @param {visualizerBinUpdateListener} listener The update listener to remove from the bins.
     * @returns {boolean} True if and only if at least one listener was removed.
     */
    removeVisualizerRangeUpdateListener(min, max, listener) {
        let removed = false;
        for (let i = min; i <= max; i++) {
            if (this.removeVisualizerBinUpdateListener(i, listener)) removed = true;
        }
        return removed;
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

    /**
     * Clears this manager of all listeners.
     */
    clearBinnedListeners() {
        this._binnedListeners.forEach(bin => {
            bin.length = 0;
        });
    }
}