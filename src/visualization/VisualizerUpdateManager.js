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
        this._rangedListeners = [];
        for (let i = 0; i < visualizer.getNumberOfBins(); i++) {
            this._binnedListeners.push([]);
        }
        this._lastBins = new Uint8Array(this._binnedListeners.length);
        this._visualizer = visualizer;
        this._visualizerListener = (delta, bins) => {
            const sortedCopyOfRangedListeners = [... this._rangedListeners].sort((a, b) => a[0] - b[0]); // Priority queue could be better.
            for (let binInd = 0; binInd < this._lastBins.length; binInd++) {
                const lastBin = this._lastBins[binInd];
                if (lastBin !== bins[binInd]) {
                    this._binnedListeners[binInd].forEach(listener => {
                        listener(delta, bins[binInd], bins[binInd] - lastBin);
                    });
                    for (let rangedInd = 0; rangedInd < sortedCopyOfRangedListeners.length; rangedInd++) { // Could switch to a while loop.
                        const [min, max, listener] = sortedCopyOfRangedListeners[rangedInd];
                        if (min > binInd) break; // Don't need to check the rest if the current lowest minimum is greater than the current bin index.
                        if (binInd <= max) {
                            listener(delta, bins.slice(min, max));
                            sortedCopyOfRangedListeners.shift();
                            rangedInd--;
                        }
                    }
                    this._lastBins[binInd] = bins[binInd];
                }
            }
        };
        visualizer.addUpdateListener(this._visualizerListener);
    }

    /**
     * @callback visualizerBinUpdateListener
     * @param {number} timeDelta elapsed time since last update.
     * @param {number} amplitude The amplitude of the associated bin.
     * @param {number} ampDelta change in amplitude of the frequency bin.
     */

    /**
     * @callback visualizerRangeUpdateListener
     * @param {number} timeDelta elapsed time since last update.
     * @param {number} bins the bins of the range.
     */


    /**
     * 
     * @param {number} freqBin the frequency bin this update listener should listen to.
     * @param {visualizerBinUpdateListener} listener the listener itself that will be called upon the bin updating.
     * @returns {boolean} true if and only if the updater was added successfully.
     */
    AddVisualizerBinUpdateListener(freqBin, listener) {
        if (this._binnedListeners[freqBin].includes(listener)) return false;
        this._binnedListeners[freqBin].push(listener);
        return true;
    }

    /**
     * Similar to {@link VisualizerUpdateManager#AddVisualizerBinUpdateListener}, this method adds a listener for to a range of bins.
     * 
     * @param {number} min The lower bound of the bins to listen to (inclusive).
     * @param {number} max The upper bound of the bins to listen to (inclusive).
     * @param {visualizerRangeUpdateListener} listener The listener to register to the range. 
     * @returns {boolean} True if and only if the ranged listener was added successfully.
     */
    addVisualizerRangeUpdateListener(min, max, listener) {
        const rangedListener = [min, max, listener];
        if (this._rangedListeners.includes(rangedListener)) return false;
        this._rangedListeners.push(rangedListener);
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
     * Similar to {@link removeVisualizerBinUpdateListener}, this method removes the given listener from a range of bins.
     * 
     * @param {number} min The lower bound of bins to remove the listener from (inclusive).
     * @param {number} max The upper bound of bin to remove the listener from (inclusive.)
     * @param {visualizerBinUpdateListener} listener The update listener to remove from the bins.
     * @returns {boolean} True if and only if the given listener was removed.
     */
    removeVisualizerRangeUpdateListener(min, max, listener) {
        const rangedListener = [min, max, listener];
        const removeIndex = this._rangedListeners.indexOf(rangedListener);
        if (removeIndex < 0) return false;
        this._binnedListeners.splice(removeIndex, 1);
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

    /**
     * Clears this manager of all listeners.
     */
    clearBinnedListeners() {
        this._binnedListeners.forEach(bin => {
            bin.length = 0;
        });
    }

    /**
     * Unbinds this update manager from the initial visualizer. Effectively meaning this manager will no longer be used.
     */
    unbindVisualizer() {
        this._visualizer.removeUpdateListener(this._visualizerListener);
    }
}