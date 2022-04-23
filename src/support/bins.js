import VisUpdateRouter from "../visualization/VisUpdateRouter.js";
import { createEaseLinear } from "./easings.js";


/**@module */
/**
 * @callback binSelector 
 * @param {number[]} bins Array of frequency bins.
 * @returns {number} A number from 0 to 255 representing the bin value to be used.
 */

/**
 * Creates a {@link module:support/bins~binSelector} that simply uniformly averages all bins and returns said average.
 * 
 * @returns {module:support/bins~binSelector} that simply uniformly averages all bins and returns said average.
 */
export function createUniAvgSel() {
    return (bins) => {
        let normAvg = 0;
        for (let i = 0; i < bins.length; i++) {
            normAvg += bins[i];
        }
        normAvg /= bins.length;
        return normAvg;
    };
}

/**
 * 
 * @callback numericalGetter
 * @returns {number} The number this value currently represents.
 */

/**
 * @callback numericalSetter
 * @param {number} value The new numerical value to update to.
 */

// PEND: Warnings about interpolator not being defined are broken. Docs generate fine.

/**
 * Maps the average of a range of bins to numerical value defined by a getter and a setter.
 * 
 * @param {object} conf A configuration for how to map a numerical value.
 * @param {number} conf.minVal The minimum value of the numerical value.
 * @param {number} conf.maxVal The maximum value of the numerical value.
 * @param {number} conf.lowerBin The lower bin of the range of bins this value is to be mapped to.
 * @param {module:support/bins~numericalGetter} conf.getter The getter callback to be used to get the current number.
 * @param {module:support/bins~numericalSetter} conf.setter The setter callback to be used to set the new number.
 * @param {VisUpdateRouter} conf.visUpdateRouter the visualizer update manager this mapping corresponds with.
 * @param {module:support/bins~binSelector} [conf.binSelector=undefined] The bin selector function to use to get a number for the mapping.
 * @param {number} [conf.upperBin=undefined] The upper bin of the range of bins this value is to be mapped to.
 * @param {module:support/easings~interpolator} [conf.interpolator=undefined] The interpolation function to use.
 * @param {boolean} [conf.reversed = false] If true, then high amplitudes will be mapped to low values and vice versa.
 * @returns {{lower: number, upper: number, listener: VisUpdateRouter.visualizerRangedUpdateListener}} An object containing the lower and upper bounds for the range of a listener, which is also in the object.
 */
export function numericalBins({ minVal, maxVal, lowerBin, getter, setter, visUpdateRouter, binSelector = undefined, upperBin = undefined, interpolator = undefined, reversed = false }) {
    if (!binSelector) binSelector = createUniAvgSel();
    if (!interpolator) interpolator = createEaseLinear(2);
    const rangedListener = {
        lower: lowerBin,
        upper: upperBin ? upperBin : lowerBin,
        listener: (timeDelta, bins) => {
            let normAvg = binSelector(bins);
            normAvg /= 255;

            const range = maxVal - minVal;
            let interpolated = interpolator((getter() - minVal) / range, normAvg, Math.min(timeDelta, 1));
            if (reversed) interpolated = 1 - interpolated;
            setter(minVal + range * interpolated);
        }
    };
    if (visUpdateRouter.addUpdateListener(rangedListener)) {
        return rangedListener;
    }
    return null; // Technically doesn't occur since the functions are anonymous?
}