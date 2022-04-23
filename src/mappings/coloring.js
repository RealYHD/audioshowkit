import { hslaToCssHsla, hslaToRgba, parseColorToHsla, parseColorToRgba, rgbaToCssRgba, rgbaToHexRgba, rgbaToHsla } from "../support/colors.js";
import VisUpdateRouter from "../visualization/VisUpdateRouter.js";
import { numericalBins } from "./numeric.js";


/**@module */

/**
 * Maps a color component of an element background color to a certain range of frequency bins.
 * 
 * @param {object} conf The configuration of the mapping.
 * @param {HTMLElement} conf.element The element whose text's red value should be mapped.
 * @param {string} conf.select Where r for red, g, for green, b for blue, and a for alpha.
 * @param {number} conf.lowerBin The lower bound of the bins to be mapped.
 * @param {VisUpdateRouter} conf.visUpdateRouter The visualizer update manager associated with the audio playback you would like the mapping with.
 * @param {module:support/bins~binSelector} [conf.binSelector=undefined] The bin selector to use to calculate a number to use for the mapping.
 * @param {number} [conf.upperBin=undefined] The upper bound of the bins to be mapped. If left undefined, then only the bin defined by the min value is used.
 * @param {Function} [conf.interpolator=undefined] The interpolation function to use.
 * @param {boolean} [conf.reversed=true] If true, then the quieter, the greater the red value.
 * @param {number} [conf.lowerVal=0] The lower boundary of possible values for the color component (0 to upperVal inclusive).
 * @param {number} [conf.upperVal=0] The upper boundary of possible values for the color component (0 to 255 inclusive).
 * @returns {{lower: number, upper: number, listener: VisUpdateRouter~visualizerRangedUpdateListener}} The ranged listener that was added.
 */
export function backgroundColorRgba({ element, select, lowerBin, visUpdateRouter, binSelector = undefined, upperBin = undefined, interpolator = undefined, reversed = false, lowerVal = 0, upperVal = 255 }) {
    const rgbaStr = "rgba";
    const defaultColor = [0, 0, 0, 255];
    select = rgbaStr.indexOf(select);
    if (select < 0) throw new Error("Invalid color parameter provided.");
    const getter = () => {
        return (parseColorToRgba(element.style.backgroundColor) || defaultColor)[select];
    };
    const setter = (value) => {
        const changed = parseColorToRgba(element.style.backgroundColor) || defaultColor;
        changed[select] = value;
        if (element.style.backgroundColor.startsWith("rgb")) {
            element.style.backgroundColor = rgbaToCssRgba(changed);
        } else if (element.style.backgroundColor.startsWith("hsl")) {
            element.style.backgroundColor = hslaToCssHsla(rgbaToHsla(changed));
        } else if (element.style.backgroundColor.startsWith("#")) {
            element.style.backgroundColor = rgbaToHexRgba(changed);
        } else {
            element.style.backgroundColor = rgbaToHexRgba(changed);
        }
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
        binSelector: binSelector,
        visUpdateRouter: visUpdateRouter,
        interpolator: interpolator,
        reversed: reversed
    };
    return numericalBins(conf);
}

/**
 * Maps a color component of an element background color to a certain range of frequency bins.
 * 
 * @param {object} conf The configuration of the mapping.
 * @param {HTMLElement} conf.element The element whose text's red value should be mapped.
 * @param {number} conf.select Where h for hue, s, for saturation, l for lightness, and a for alpha.
 * @param {number} conf.lowerBin The lower bound of the bins to be mapped.
 * @param {VisUpdateRouter} conf.visUpdateRouter The visualizer update manager associated with the audio playback you would like the mapping with.
 * @param {module:support/bins~binSelector} [conf.binSelector=undefined] The bin selector to use to calculate a number to use for the mapping.
 * @param {number} [conf.upperBin=undefined] The upper bound of the bins to be mapped. If left undefined, then only the bin defined by the min value is used.
 * @param {Function} [conf.interpolator=undefined] The interpolation function to use.
 * @param {boolean} [conf.reversed=true] If true, then the quieter, the greater the red value.
 * @param {number} [conf.lowerVal=0] The lower boundary of possible values for the color component (0 to upperVal inclusive).
 * @param {number} [conf.upperVal=0] The upper boundary of possible values for the color component (0 to 360 if conf.color is "h", 1 if conf.color is "s" or "l", and 255 if conf.color is "a").
 * @returns {{lower: number, upper: number, listener: VisUpdateRouter~visualizerRangedUpdateListener}} The ranged listener that was added.
 */
export function backgroundColorHsla({ element, select, lowerBin, visUpdateRouter, binSelector = undefined, upperBin = undefined, interpolator = undefined, reversed = false, lowerVal = 0, upperVal = undefined }) {
    const rgbaStr = "hsla";
    const defaultColor = [0, 0.5, 0.5, 255];
    select = rgbaStr.indexOf(select);
    if (select < 0) throw new Error("Invalid color parameter provided.");

    const getter = () => {
        return (parseColorToHsla(element.style.backgroundColor) || defaultColor)[select];
    };
    const setter = (value) => {
        const changed = parseColorToHsla(element.style.backgroundColor) || defaultColor;
        changed[select] = value;
        if (element.style.backgroundColor.startsWith("hsl")) {
            element.style.backgroundColor = hslaToCssHsla(changed);
        } else if (element.style.backgroundColor.startsWith("rgb")) {
            element.style.backgroundColor = rgbaToCssRgba(hslaToRgba(changed));
        } else if (element.style.backgroundColor.startsWith("#")) {
            element.style.backgroundColor = rgbaToHexRgba(hslaToRgba(changed));
        } else {
            element.style.backgroundColor = rgbaToHexRgba(hslaToRgba(changed)); // If we don't recognize the currently used color function, then just use hex.
        }
    };
    let upperBound = 360;
    if (select === "s" || select === "l") {
        upperBound = 1;
    } else if (select === "a") {
        upperBound = 255;
    }
    if (isNaN(upperVal)) upperVal = upperBound;
    upperVal = Math.min(Math.max(0, upperVal), upperBound);
    lowerVal = Math.min(Math.max(0, lowerVal), upperVal);
    const conf = {
        minVal: lowerVal,
        maxVal: upperVal,
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
 * Maps a color component of the text color to a certain range of frequency bins.
 * 
 * @param {object} conf The configuration of the mapping.
 * @param {HTMLElement} conf.element The element whose text's red value should be mapped.
 * @param {string} conf.select Where r for red, g, for green, b for blue, and a for alpha.
 * @param {number} conf.lowerBin The lower bound of the bins to be mapped.
 * @param {VisUpdateRouter} conf.visUpdateRouter The visualizer update manager associated with the audio playback you would like the mapping with.
 * @param {module:support/bins~binSelector} [conf.binSelector=undefined] The bin selector to use to calculate a number to use for the mapping.
 * @param {number} [conf.upperBin=undefined] The upper bound of the bins to be mapped. If left undefined, then only the bin defined by the min value is used.
 * @param {Function} [conf.interpolator=undefined] The interpolation function to use.
 * @param {boolean} [conf.reversed=true] If true, then the quieter, the greater the red value.
 * @param {number} [conf.lowerVal=0] The lower boundary of possible values for the color component (0 to upperVal inclusive).
 * @param {number} [conf.upperVal=0] The upper boundary of possible values for the color component (0 to 255 inclusive).
 * @returns {{lower: number, upper: number, listener: VisUpdateRouter~visualizerRangedUpdateListener}} The ranged listener that was added.
 */
export function fontColorRgba({ element, select, lowerBin, visUpdateRouter, binSelector = undefined, upperBin = undefined, interpolator = undefined, reversed = false, lowerVal = 0, upperVal = 255 }) {
    const rgbaStr = "rgba";
    const defaultColor = [0, 0, 0, 255];
    select = rgbaStr.indexOf(select);
    if (select < 0) throw new Error("Invalid color parameter provided.");
    const getter = () => {
        return (parseColorToRgba(element.style.color) || defaultColor)[select];
    };
    const setter = (value) => {
        const changed = parseColorToRgba(element.style.color) || defaultColor;
        changed[select] = value;
        if (element.style.color.startsWith("rgb")) {
            element.style.color = rgbaToCssRgba(changed);
        } else if (element.style.color.startsWith("hsl")) {
            element.style.color = hslaToCssHsla(rgbaToHsla(changed));
        } else if (element.style.color.startsWith("#")) {
            element.style.color = rgbaToHexRgba(changed);
        } else {
            element.style.color = rgbaToHexRgba(changed);
        }
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
        binSelector: binSelector,
        interpolator: interpolator,
        visUpdateRouter: visUpdateRouter,
        reversed: reversed
    };
    return numericalBins(conf);
}

/**
 * Maps a hsla color component of an element's font color to a certain range of frequency bins.
 * 
 * @param {object} conf The configuration of the mapping.
 * @param {HTMLElement} conf.element The element whose text's red value should be mapped.
 * @param {number} conf.select Where h for hue, s, for saturation, l for lightness, and a for alpha.
 * @param {number} conf.lowerBin The lower bound of the bins to be mapped.
 * @param {VisUpdateRouter} conf.visUpdateRouter The visualizer update manager associated with the audio playback you would like the mapping with.
 * @param {module:support/bins~binSelector} [conf.binSelector=undefined] The bin selector to use to calculate a number to use for the mapping.
 * @param {number} [conf.upperBin=undefined] The upper bound of the bins to be mapped. If left undefined, then only the bin defined by the min value is used.
 * @param {Function} [conf.interpolator=undefined] The interpolation function to use.
 * @param {boolean} [conf.reversed=true] If true, then the quieter, the greater the red value.
 * @param {number} [conf.lowerVal=0] The lower boundary of possible values for the color component (0 to upperVal inclusive).
 * @param {number} [conf.upperVal=0] The upper boundary of possible values for the color component (0 to 360 if conf.color is "h", 1 if conf.color is "s" or "l", and 255 if conf.color is "a").
 * @returns {{lower: number, upper: number, listener: VisUpdateRouter~visualizerRangedUpdateListener}} The ranged listener that was added.
 */
export function fontColorHsla({ element, select, lowerBin, visUpdateRouter, binSelector = undefined, upperBin = undefined, interpolator = undefined, reversed = false, lowerVal = 0, upperVal = undefined }) {
    const rgbaStr = "hsla";
    const defaultColor = [0, 0.5, 0.5, 255];
    select = rgbaStr.indexOf(select);
    if (select < 0) throw new Error("Invalid color parameter provided.");

    const getter = () => {
        return (parseColorToHsla(element.style.color) || defaultColor)[select];
    };
    const setter = (value) => {
        const changed = parseColorToHsla(element.style.color) || defaultColor;
        changed[select] = value;
        if (element.style.color.startsWith("hsl")) {
            element.style.color = hslaToCssHsla(changed);
        } else if (element.style.color.startsWith("rgb")) {
            element.style.color = rgbaToCssRgba(hslaToRgba(changed));
        } else if (element.style.color.startsWith("#")) {
            element.style.color = rgbaToHexRgba(hslaToRgba(changed));
        } else {
            element.style.color = rgbaToHexRgba(hslaToRgba(changed)); // If we don't recognize the currently used color function, then just use hex.
        }
    };
    let upperBound = 360;
    if (select === "s" || select === "l") {
        upperBound = 1;
    } else if (select === "a") {
        upperBound = 255;
    }
    if (isNaN(upperVal)) upperVal = upperBound;

    upperVal = Math.min(Math.max(0, upperVal), upperBound);
    lowerVal = Math.min(Math.max(0, lowerVal), upperVal);

    const conf = {
        minVal: lowerVal,
        maxVal: upperVal,
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