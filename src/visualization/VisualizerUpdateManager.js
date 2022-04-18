import Visualizer from "./Visualizer.js";

/**@module */

/**
 * @callback visualizerBinUpdateListener
 * @param {number} timeDelta elapsed time since last update.
 * @param {number} amplitude The amplitude of the associated bin.
 * @param {number} ampDelta change in amplitude of the frequency bin.
 */

/**
 * @callback visualizerRangedUpdateListener
 * @param {number} timeDelta elapsed time since last update.
 * @param {number} bins the bins of the range.
 */


/**
 * A visualizer update manager offers an extra layer of abstraction on top of the {@link Visualizer}'s update listener.
 * 
 * Specifically, the update manager handles updates directly from the {@link Visualizer} and checks for changes in the individual bins. These changes are then broadcasted to the individual bin listeners.
 * In the rare event that a bin has not changed, then it will not receive an update call.
 */
export default class VisualizerUpdateManager {
    #binnedListeners = [];
    #rangedListeners = [];
    #lastBins;
    #visualizer;
    #visualizerListener;


    /**
     * 
     * @param {Visualizer} visualizer the visualizer this manager obtains data from.
     */
    constructor(visualizer) {
        this.#binnedListeners = [];
        this.#rangedListeners = [];
        for (let i = 0; i < visualizer.getNumberOfBins(); i++) {
            this.#binnedListeners.push([]);
        }
        this.#lastBins = new Uint8Array(this.#binnedListeners.length);
        this.#visualizer = visualizer;
        this.#visualizerListener = (delta, bins) => {
            const sortedCopyOfRangedListeners = [... this.#rangedListeners]; // We assume this is sorted properly. A priority queue could be better.
            for (let binInd = 0; binInd < this.#lastBins.length; binInd++) {
                const lastBin = this.#lastBins[binInd];
                if (lastBin !== bins[binInd]) {
                    this.#binnedListeners[binInd].forEach(listener => {
                        listener(delta, bins[binInd], bins[binInd] - lastBin);
                    });
                    for (let rangedInd = 0; rangedInd < sortedCopyOfRangedListeners.length; rangedInd++) { // Could switch to a while loop.
                        const { lower, upper, listener } = sortedCopyOfRangedListeners[rangedInd];
                        if (lower > binInd) break; // Don't need to check the rest if the current lowest minimum is greater than the current bin index.
                        if (binInd <= upper) {
                            listener(delta, bins.slice(lower, upper));
                            sortedCopyOfRangedListeners.shift();
                            rangedInd--;
                        }
                    }
                    this.#lastBins[binInd] = bins[binInd];
                }
            }
        };
        visualizer.addUpdateListener(this.#visualizerListener);
    }


    /**
     * Adds a listener to a specific frequency bin.
     * 
     * @param {object} freqBinListener the listener for a specific frequency bin.
     * @param {number} freqBinListener.freqBin the frequency bin this update listener should listen to.
     * @param {visualizerBinUpdateListener} freqBinListener.listener the listener itself that will be called upon the bin updating.
     * @returns {boolean} true if and only if the updater was added successfully.
     */
    AddVisualizerBinUpdateListener({ freqBin, listener }) {
        if (this.#binnedListeners[freqBin].includes(listener)) return false;
        this.#binnedListeners[freqBin].push(listener);
        return true;
    }

    /**
     * Similar to {@link VisualizerUpdateManager#AddVisualizerBinUpdateListener}, this method adds a listener for to a range of bins.
     * 
     * @param {object} rangedUpdateListener The ranged update listener to add.
     * @param {number} rangedUpdateListener.lower The lower bound of the bins to listen to (inclusive).
     * @param {number} rangedUpdateListener.upper The upper bound of the bins to listen to (inclusive).
     * @param {visualizerRangedUpdateListener} rangedUpdateListener.listener The listener to register to the range. 
     * @returns {boolean} True if and only if the ranged listener was added successfully.
     */
    addVisualizerRangedUpdateListener({ lower, upper, listener }) {
        const rangedListener = {
            lower: lower,
            upper: upper,
            listener: listener
        };
        if (this.#rangedListeners.includes(rangedListener)) return false;
        this.#rangedListeners.push(rangedListener);
        this.#rangedListeners.sort((a, b) => a.lower - b.lower);
        return true;
    }

    /**
     * 
     * @param {object} binFreqListener The bin frequency listener to remove.
     * @param {number} binFreqListener.freqBin the frequency bin the update listener to be removed from is in.
     * @param {visualizerBinUpdateListener} binFreqListener.listener the listener that is to be removed.
     * @returns {boolean} true if and only if the listener was successfully removed.
     */
    removeVisualizerBinUpdateListener({ freqBin, listener }) {
        const removeIndex = this.#binnedListeners[freqBin].indexOf(listener);
        if (removeIndex < 0) return false;
        this.#binnedListeners[freqBin].splice(removeIndex, 1);
        return true;
    }

    /**
     * Similar to {@link removeVisualizerBinUpdateListener}, this method removes the given listener from a range of bins.
     * 
     * @param {object} rangedListener The ranged listener to remove.
     * @param {number} rangedListener.lower The lower bound of bins to remove the listener from (inclusive).
     * @param {number} rangedListener.upper The upper bound of bin to remove the listener from (inclusive.)
     * @param {visualizerRangedUpdateListener} rangedListener.listener The update listener to remove from the bins.
     * @returns {boolean} True if and only if the given listener was removed.
     */
    removeVisualizerRangedUpdateListener({ lower, upper, listener }) {
        const rangedListener = {
            lower: lower,
            upper: upper,
            listener: listener
        };
        const removeIndex = this.#rangedListeners.indexOf(rangedListener);
        if (removeIndex < 0) return false;
        this.#binnedListeners.splice(removeIndex, 1);
        return true;
    }

    /**
     * @param {object} listeners The listeners that this visualizer update manager should be set to use.
     * @param {visualizerBinUpdateListener[][]} listeners.binned The bin listeners.
     * @param {object[]} listeners.ranged The array of ranged listeners.
     * @param {number} listeners.ranged[].lower The lower bound of the listener.
     * @param {number} listeners.ranged[].upper The upper bound of the listener.
     * @param {visualizerRangedUpdateListener} listeners.ranged[].listener The listener for the previously mentioned ranges.
     * @returns {boolean} true if and only if successfully loaded the new listeners.
     */
    loadListeners(listeners) {
        if (listeners.binned.length !== this.#binnedListeners.length) return false;
        this.#binnedListeners = listeners.binned;
        this.#rangedListeners = listeners.ranged.sort((a, b) => a.lower - b.lower);
        return true;
    }

    /**
     * 
     * @returns {object} All the listeners, both for binned, and ranged listeners. See {@link VisualizerUpdateManager#loadListeners} to see the structure of the returned object.
     */
    retrieveListeners() {
        return {
            binned: this.#binnedListeners,
            ranged: this.#rangedListeners
        };
    }

    /**
     * Clears this manager of all listeners.
     */
    clearBinnedListeners() {
        this.#binnedListeners.forEach(bin => {
            bin.length = 0;
        });
    }

    /**
     * Unbinds this update manager from the initial visualizer. Effectively meaning this manager will no longer be used.
     */
    unbindVisualizer() {
        this.#visualizer.removeUpdateListener(this.#visualizerListener);
    }
}