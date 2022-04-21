import { parseColor, rgbaToHexRgba } from "../support/colors.js";
import VisUpdateRouter from "../visualization/VisUpdateRouter.js";
import { numerical } from "./numeric.js";


/**@module */

/**
 * Maps a color component of an element background color to a certain range of frequency bins.
 * 
 * @param {object} conf The configuration of the mapping.
 * @param {HTMLElement} conf.element The element whose text's red value should be mapped.
 * @param {number} conf.color Where r for red, g, for green, b for blue, and a for alpha.
 * @param {number} conf.lowerBin The lower bound of the bins to be mapped.
 * @param {VisUpdateRouter} conf.visUpdateRouter The visualizer update manager associated with the audio playback you would like the mapping with.
 * @param {Function} conf.interpolator The interpolation function to use.
 * @param {number} [conf.upperBin=undefined] The upper bound of the bins to be mapped. If left undefined, then only the bin defined by the min value is used.
 * @param {boolean} [conf.reversed=true] If true, then the quieter, the greater the red value.
 * @param {number} [conf.lowerVal=0] The lower boundary of possible values for the color component (0 to upperVal inclusive).
 * @param {number} [conf.upperVal=0] The upper boundary of possible values for the color component (0 to 255 inclusive).
 * @returns {{lower: number, upper: number, listener: VisUpdateRouter~visualizerRangedUpdateListener}} The ranged listener that was added.
 */
export function backgroundColorRgba({ element, color, lowerBin, visUpdateRouter, interpolator, upperBin = undefined, reversed = false, lowerVal = 0, upperVal = 255 }) {
    const rgbaStr = "rgba";
    color = rgbaStr.indexOf(color);
    if (color < 0) throw new Error("Invalid color parameter provided.");
    const getter = () => {
        if (!element.style.backgroundColor) element.style.backgroundColor = "rgba(0, 0, 0, 255)";
        return parseColor(element.style.backgroundColor)[color];
    };
    const setter = (value) => {
        const changed = parseColor(element.style.backgroundColor);
        changed[color] = value;
        element.style.backgroundColor = rgbaToHexRgba(changed);
    };
    upperVal = Math.min(Math.max(0, upperVal), 255);
    lowerVal = Math.min(Math.max(0, lowerVal), upperVal);
    const conf = {
        minVal: lowerVal,
        maxVal: upperVal,
        lowerBin: lowerBin,
        upperBin: upperBin,
        getter: getter,
        setter: setter,
        interpolator: interpolator,
        visUpdateRouter: visUpdateRouter,
        reversed: reversed
    };
    return numerical(conf);
}

/**
 * Maps a color component of the text color to a certain range of frequency bins.
 * 
 * @param {object} conf The configuration of the mapping.
 * @param {HTMLElement} conf.element The element whose text's red value should be mapped.
 * @param {number} conf.color Where r for red, g, for green, b for blue, and a for alpha.
 * @param {number} conf.lowerBin The lower bound of the bins to be mapped.
 * @param {VisUpdateRouter} conf.visUpdateRouter The visualizer update manager associated with the audio playback you would like the mapping with.
 * @param {Function} conf.interpolator The interpolation function to use.
 * @param {number} [conf.upperBin=undefined] The upper bound of the bins to be mapped. If left undefined, then only the bin defined by the min value is used.
 * @param {boolean} [conf.reversed=true] If true, then the quieter, the greater the red value.
 * @param {number} [conf.lowerVal=0] The lower boundary of possible values for the color component (0 to upperVal inclusive).
 * @param {number} [conf.upperVal=0] The upper boundary of possible values for the color component (0 to 255 inclusive).
 * @returns {{lower: number, upper: number, listener: VisUpdateRouter~visualizerRangedUpdateListener}} The ranged listener that was added.
 */
export function fontColorRgba({ element, color, lowerBin, visUpdateRouter, interpolator, upperBin = undefined, reversed = false, lowerVal = 0, upperVal = 255 }) {
    const rgbaStr = "rgba";
    color = rgbaStr.indexOf(color);
    if (color < 0) throw new Error("Invalid color parameter provided.");
    const getter = () => {
        if (!element.style.color) element.style.color = "rgba(0, 0, 0, 255)";
        return parseColor(element.style.color)[color];
    };
    const setter = (value) => {
        const changed = parseColor(element.style.color);
        changed[color] = value;
        element.style.color = rgbaToHexRgba(changed);
    };
    upperVal = Math.min(Math.max(0, upperVal), 255);
    lowerVal = Math.min(Math.max(0, lowerVal), upperVal);
    const conf = {
        minVal: lowerVal,
        maxVal: upperVal,
        lowerBin: lowerBin,
        upperBin: upperBin,
        getter: getter,
        setter: setter,
        interpolator: interpolator,
        visUpdateRouter: visUpdateRouter,
        reversed: reversed
    };
    return numerical(conf);
}
