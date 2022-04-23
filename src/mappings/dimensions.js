import VisUpdateRouter from "../visualization/VisUpdateRouter.js";
import { numericalBins } from "../support/bins.js";

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
 * @param {module:support/bins~binSelector} [conf.binSelector=undefined] The bin selector function to use to get a number for the mapping.
 * @param {number} [conf.upperBin] The upper bin or undefined, which results in mapping to a single bin.
 * @param {module:support/easings~interpolator} [conf.interpolator=undefined] The interpolation function to be used to transition from one value to the next.
 * @param {boolean} [conf.reversed=false] If true, then high amplitudes are mapped to lower values and vice versa.
 * @returns {{bin: number, listener: VisUpdateRouter~visualizerBinUpdateListener}|{lower: number, upper: number, listener: VisUpdateRouter.visualizerRangedUpdateListener}} The listener that was added (ranged if an upper bound was provided, binned otherwise).
 */
export function width({ element, growLower, growUpper, unit, lowerBin, visUpdateRouter, binSelector = undefined, upperBin = undefined, interpolator = undefined, reversed = false }) {
    const getter = () => parseInt(element.style.width) || 0;
    const setter = (value) => element.style.width = value + unit;
    const conf = {
        minVal: growLower,
        maxVal: growUpper,
        lowerBin: lowerBin,
        upperBin: upperBin,
        getter: getter,
        setter: setter,
        binSelector: binSelector,
        interpolator: interpolator,
        visUpdateRouter: visUpdateRouter,
        reversed: reversed
    };
    return numericalBins(conf);
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
 * @param {module:support/bins~binSelector} [conf.binSelector=undefined] The bin selector function to use to get a number for the mapping.
 * @param {number} [conf.upperBin] The upper bin or undefined, which results in mapping to a single bin.
 * @param {module:support/easings~interpolator} [conf.interpolator=undefined] The interpolation function to be used to transition from one value to the next.
 * @param {boolean} [conf.reversed=false] If true, then high amplitudes are mapped to lower values and vice versa.
 * @returns {{bin: number, listener: VisUpdateRouter~visualizerBinUpdateListener}|{lower: number, upper: number, listener: VisUpdateRouter.visualizerRangedUpdateListener}} The listener that was added (ranged if an upper bound was provided, binned otherwise).
 */
export function height({ element, growLower, growUpper, unit, lowerBin, visUpdateRouter, binSelector = undefined, upperBin = undefined, interpolator = undefined, reversed = false }) {
    const getter = () => parseInt(element.style.height) || 0;
    const setter = (value) => element.style.height = value + unit;
    const conf = {
        minVal: growLower,
        maxVal: growUpper,
        lowerBin: lowerBin,
        upperBin: upperBin,
        getter: getter,
        setter: setter,
        binSelector: binSelector,
        interpolator: interpolator,
        visUpdateRouter: visUpdateRouter,
        reversed: reversed
    };
    return numericalBins(conf);
}

/**
 * 
 * @param {object} conf The configuration of the font size mapping.
 * @param {HTMLElement} conf.element The element whose font sizes will be mapped to the amplitude.
 * @param {number} conf.growLower The lower limit of the font size.
 * @param {number} conf.growUpper The upper limit of the font size.
 * @param {string} conf.unit The unit the upper and lower bounds are measured in.
 * @param {number} conf.lowerBin The lower boundary of bins to be mapped (or the single bin to be mapped if the upper bin is undefined).
 * @param {VisUpdateRouter} conf.visUpdateRouter the visualizer update manager to be mapped to.
 * @param {module:support/bins~binSelector} [conf.binSelector=undefined] The bin selector function to use to get a number for the mapping.
 * @param {number} [conf.upperBin=undefined] The upper bin, or undefined, which results in mapping to a single bin.
 * @param {module:support/easings~interpolator} [conf.interpolator=undefined] The interpolation function to be used to transition from one value to the next.
 * @param {boolean} [conf.reversed=false] If true, then high amplitudes are mapped to lower values and vice versa.
 * @returns {{bin: number, listener: VisUpdateRouter~visualizerBinUpdateListener}|{lower: number, upper: number, listener: VisUpdateRouter~visualizerRangedUpdateListener}} The listener that was added (ranged if an upper bound was provided, binned otherwise).
 */
export function fontSize({ element, growLower, growUpper, unit, lowerBin, visUpdateRouter, binSelector = undefined, upperBin = undefined, interpolator = undefined, reversed = false }) {
    const getter = () => parseInt(element.style.fontSize) || 0;
    const setter = (value) => element.style.fontSize = value + unit;
    const conf = {
        minVal: growLower,
        maxVal: growUpper,
        lowerBin: lowerBin,
        upperBin: upperBin,
        getter: getter,
        setter: setter,
        binSelector: binSelector,
        interpolator: interpolator,
        visUpdateRouter: visUpdateRouter,
        reversed: reversed
    };
    return numericalBins(conf);
}
