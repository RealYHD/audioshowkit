// TODO: add for width
// TODO: add for height
// TODO: add for background

import VisualizerUpdateManager from "../visualization/VisualizerUpdateManager.js";

/**
 * 
 * @callback numericalGetter
 * @returns {number} The number this value currently represents.
 */

/**
 * @callback numericalSetter
 * @param {number} value The new numerical value to update to.
 */

/**
 * Maps the average of a range of bins to numerical value defined by a getter and a setter.
 * 
 * @param {object} conf A configuration for how to map a numerical value.
 * @param {number} conf.minVal The minimum value of the numerical value.
 * @param {number} conf.maxVal The maximum value of the numerical value.
 * @param {number} conf.lowerBin The lower bin of the range of bins this value is to be mapped to.
 * @param {number} conf.upperBin The upper bin of the range of bins this value si to be mapped to.
 * @param {numericalGetter} conf.getter The getter callback to be used to get the current number.
 * @param {numericalSetter} conf.setter The setter callback to be used to set the new number.
 * @param {interpolator} conf.interpolator The interpolation function to use.
 * @param {VisualizerUpdateManager} conf.visUpdateManager the visualizer update manager this mapping corresponds with.
 * @param {boolean} [conf.reversed = false] If true, then high amplitudes will be mapped to low values and vice versa.
 * @returns {{lower: number, upper: number, listener: VisualizerUpdateManager.visualizerRangedUpdateListener}} An object containing the lower and upper bounds for the range of a listener, which is also in the object.
 */
export function mapRangedAvgNumerical({ minVal, maxVal, lowerBin = undefined, upperBin, getter, setter, interpolator, visUpdateManager, reversed = false }) {
    const rangedListener = {
        lower: lowerBin,
        upper: upperBin,
        listener: (timeDelta, bins) => {
            const normalBins = [...bins];
            // TODO: Future: add weighting / distribution system?
            let average = 0;
            for (let i = 0; i < normalBins.length; i++) {
                normalBins[i] = normalBins[i] / 255.0;
                average += normalBins[i];
            }
            average /= normalBins.length;
            const range = maxVal - minVal;
            let interpolated = interpolator(getter(), average, timeDelta); // TODO: May be optimized by allowing for transferring of previous style state.
            if (reversed) interpolated = 1 - interpolated;
            setter(minVal + range * interpolated);
        }
    };
    if (visUpdateManager.addVisualizerRangedUpdateListener(rangedListener)) {
        return rangedListener;
    }
    return null; // Technically doesn't occur since the functions are anonymous?
}

/**
 * Maps a single bin of frequency amplitudes to a numerical value defined by a getter and a setter.
 * 
 * @param {object} conf The configuration for mapping a single bin to a numerical value.
 * @param {number} conf.minVal The minimum value the mapping can produce.
 * @param {number} conf.maxVal The maximum value the mapping can produce.
 * @param {number} conf.bin The bin to map this number to.
 * @param {numericalGetter} conf.getter The callback to be used to get the current number.
 * @param {numericalSetter} conf.setter The callback to be used to set the new number.
 * @param {interpolator} conf.interpolator The interpolation function to use.
 * @param {VisualizerUpdateManager} conf.visUpdateManager The update manager to map to.
 * @param {boolean} [conf.reversed] If true, then high amplitudes will be mapped to lower values and vice versa.
 * @returns {{bin: number, listener: VisualizerUpdateManager.visualizerBinUpdateListener}} The bin listener that was added.
 */
export function mapBinNumerical({ minVal, maxVal, bin, getter, setter, interpolator, visUpdateManager, reversed = false }) {
    const listener = {
        bin: bin,
        listener: (timeDelta, amp) => {
            const range = maxVal - minVal;
            let interpolated = interpolator(getter(), amp, timeDelta);
            if (reversed) interpolated = 1 - interpolated;
            setter(minVal + range * interpolated);
        }
    };
    if (visUpdateManager.AddVisualizerBinUpdateListener(listener)) {
        return listener;
    }
    return null; // Technically doesn't occur since the functions are anonymous?
}