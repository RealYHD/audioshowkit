import VisUpdateRouter from "../visualization/VisUpdateRouter.js";
import { mapBinNumerical, mapRangedAvgNumerical } from "./numeric.js";

/**@module */

/**
 * Maps the width of an element to frequency bin(s).
 * 
 * @param {object} conf The configuration for mapping amplitudes to a width CSS property.
 * @param {HTMLElement} conf.element The html element to map the width to.
 * @param {number} conf.growLower The lower limit of the width.
 * @param {number} conf.growUpper The upper limit of the width.
 * @param {string} conf.unit The unit the upper and lower bounds are measured in.
 * @param {number} conf.lowerBin The lower boundary of bins to be mapped (or the single bin to be mapped if the upper bin is undefined).
 * @param {VisUpdateRouter} conf.visUpdateRouter The visualizer update manager to be mapped to.
 * @param {module:support/easings~interpolator} conf.interpolator The interpolation function to be used to transition from one value to the next.
 * @param {number} [conf.upperBin] The upper bin or undefined, which results in mapping to a single bin.
 * @param {boolean} [conf.reversed=false] If true, then high amplitudes are mapped to lower values and vice versa.
 * @returns {{bin: number, listener: VisUpdateRouter~visualizerBinUpdateListener}|{lower: number, upper: number, listener: VisUpdateRouter.visualizerRangedUpdateListener}} The listener that was added (ranged if an upper bound was provided, binned otherwise).
 */
export function mapWidth({ element, growLower, growUpper, unit, lowerBin, visUpdateRouter, interpolator, upperBin = undefined, reversed = false }) {
    const getter = () => parseInt(element.style.width) || 0;
    const setter = (value) => element.style.width = value + unit;
    const conf = {
        minVal: growLower,
        maxVal: growUpper,
        bin: lowerBin,
        getter: getter,
        setter: setter,
        interpolator: interpolator,
        visUpdateRouter: visUpdateRouter,
        reversed: reversed
    };

    if (upperBin) {
        conf.bin = undefined;
        conf.lowerBin = lowerBin;
        conf.upperBin = upperBin;
        return mapRangedAvgNumerical(conf);
    }
    return mapBinNumerical(conf);
}

/**
 * Maps the height of an element to frequency bin(s).
 * 
 * @param {object} conf The configuration for mapping amplitudes to a height CSS property.
 * @param {HTMLElement} conf.element The html element to map the height to.
 * @param {number} conf.growLower The lower limit of the height.
 * @param {number} conf.growUpper The upper limit of the height.
 * @param {string} conf.unit The unit the upper and lower bounds are measured in.
 * @param {number} conf.lowerBin The lower boundary of bins to be mapped (or the single bin to be mapped if the upper bin is undefined).
 * @param {VisUpdateRouter} conf.visUpdateRouter The visualizer update manager to be mapped to.
 * @param {module:support/easings~interpolator} conf.interpolator The interpolation function to be used to transition from one value to the next.
 * @param {number} [conf.upperBin] The upper bin or undefined, which results in mapping to a single bin.
 * @param {boolean} [conf.reversed=false] If true, then high amplitudes are mapped to lower values and vice versa.
 * @returns {{bin: number, listener: VisUpdateRouter~visualizerBinUpdateListener}|{lower: number, upper: number, listener: VisUpdateRouter.visualizerRangedUpdateListener}} The listener that was added (ranged if an upper bound was provided, binned otherwise).
 */
export function mapHeight({ element, growLower, growUpper, unit, lowerBin, visUpdateRouter, interpolator, upperBin = undefined, reversed = false }) {
    const getter = () => parseInt(element.style.height) || 0;
    const setter = (value) => element.style.height = value + unit;
    const conf = {
        minVal: growLower,
        maxVal: growUpper,
        bin: lowerBin,
        getter: getter,
        setter: setter,
        interpolator: interpolator,
        visUpdateRouter: visUpdateRouter,
        reversed: reversed
    };

    if (upperBin) {
        conf.bin = undefined;
        conf.lowerBin = lowerBin;
        conf.upperBin = upperBin;
        return mapRangedAvgNumerical(conf);
    }
    return mapBinNumerical(conf);
}