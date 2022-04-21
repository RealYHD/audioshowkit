

import Visualizer from "./Visualizer.js";



/**
 * A visualizer update manager offers an extra layer of abstraction on top of the {@link Visualizer}'s update listener.
 * 
 * Specifically, the update manager handles updates directly from the {@link Visualizer} and checks for changes in the individual bins. These changes are then broadcasted to the individual bin listeners.
 * In the rare event that a bin has not changed, then it will not receive an update call.
 */
export default class VisUpdateRouter {
    listeners = [];
    #lastBins;
    #visualizer;

    /**
     * @callback VisUpdateRouter~visualizerBinUpdateListener
     * @param {number} timeDelta elapsed time since last update.
     * @param {number} amplitude The amplitude of the associated bin.
     * @param {number} ampDelta change in amplitude of the frequency bin.
     */

    /**
     * @callback VisUpdateRouter~visualizerRangedUpdateListener
     * @param {number} timeDelta elapsed time since last update.
     * @param {number} bins the bins of the range.
     */

    /**
     * 
     * @param {Visualizer} visualizer the fft window size of the visualizer this manager obtains data from.
     */
    constructor(visualizer) {
        this.listeners = [];
        this.#lastBins = new Uint8Array(visualizer.numberOfBins);
        this.#visualizer = visualizer;
        this.#visualizer.addUpdateListener(this.#visualizerListener);
    }

    #visualizerListener = (delta, bins) => {
        const copyOfRangedListeners = [... this.listeners]; // We assume this is sorted properly. A priority queue could be better.
        for (let binInd = 0; binInd < this.#lastBins.length; binInd++) {
            const lastBin = this.#lastBins[binInd];
            if (lastBin !== bins[binInd]) {
                for (let rangedInd = 0; rangedInd < copyOfRangedListeners.length; rangedInd++) { // Could switch to a while loop.
                    const { lower, upper, listener } = copyOfRangedListeners[rangedInd];
                    if (lower > binInd) break; // Don't need to check the rest if the current lowest minimum is greater than the current bin index.
                    if (binInd <= upper) {
                        listener(delta, bins.slice(lower, upper));
                        copyOfRangedListeners.shift();
                        rangedInd--;
                    }
                }
                this.#lastBins[binInd] = bins[binInd];
            }
        }
    };

    /**
     * Similar to {@link VisUpdateRouter#AddVisualizerBinUpdateListener}, this method adds a listener for to a range of bins.
     * 
     * @param {object} rangedUpdateListener The ranged update listener to add.
     * @param {number} rangedUpdateListener.lower The lower bound of the bins to listen to (inclusive).
     * @param {number} rangedUpdateListener.upper The upper bound of the bins to listen to (inclusive).
     * @param {VisUpdateRouter~visualizerRangedUpdateListener} rangedUpdateListener.listener The listener to register to the range. 
     * @returns {boolean} True if and only if the ranged listener was added successfully.
     */
    addUpdateListener({ lower, upper, listener }) {
        const rangedListener = {
            lower: lower,
            upper: upper,
            listener: listener
        };
        if (this.listeners.includes(rangedListener)) return false;
        this.listeners.push(rangedListener);
        this.listeners.sort((a, b) => a.lower - b.lower);
        return true;
    }

    /**
     * Similar to {@link removeVisualizerBinUpdateListener}, this method removes the given listener from a range of bins.
     * 
     * @param {object} rangedListener The ranged listener to remove.
     * @param {number} rangedListener.lower The lower bound of bins to remove the listener from (inclusive).
     * @param {number} rangedListener.upper The upper bound of bin to remove the listener from (inclusive.)
     * @param {VisUpdateRouter~visualizerRangedUpdateListener} rangedListener.listener The update listener to remove from the bins.
     * @returns {boolean} True if and only if the given listener was removed.
     */
    removeUpdateListener({ lower, upper, listener }) {
        const rangedListener = {
            lower: lower,
            upper: upper,
            listener: listener
        };
        const removeIndex = this.listeners.indexOf(rangedListener);
        if (removeIndex < 0) return false;
        this.listeners.splice(removeIndex, 1);
        return true;
    }

    /**
     * @param {object[]} listeners The listeners that this visualizer update manager should be set to use.
     * @param {number} listeners[].lower The lower bound of the listener.
     * @param {number} listeners[].upper The upper bound of the listener.
     * @param {VisUpdateRouter~visualizerRangedUpdateListener} listeners[].listener The listener for the previously mentioned ranges.
     * @returns {boolean} true if and only if successfully loaded the new listeners.
     */
    loadListeners(listeners) {
        this.listeners = listeners.sort((a, b) => a.lower - b.lower);
        return true;
    }

    /**
     * 
     * @returns {object[]} All the listeners, both for binned, and ranged listeners. See {@link VisUpdateRouter#loadListeners} to see the structure of the returned object.
     */
    retrieveListeners() {
        return this.listeners;
    }

    /**
     * Unbinds this update manager from the initial visualizer.
     */
    unbindVisualizer() {
        this.#visualizer.removeUpdateListener(this.#visualizerListener);
        this.#visualizer = null;
    }
}