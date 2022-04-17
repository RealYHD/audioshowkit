import { parseColor, rgbaToHexRgba } from "./colors.js";
import VisualizerUpdateManager from "../visualization/VisualizerUpdateManager.js";

// TODO: Should be able to remove this since already declared in easings.js, but don't know how to link.
/**
 * @callback interpolator
 * @param {number} current the current value.
 * @param {number} dest the destination value.
 * @param {number} frameDelta the time elapsed since the last update.
 * @returns {number} the new current value.
 */

/**
 * Maps the red component of the text color to a certain range of bins.
 * 
 * @param {HTMLElement} element The element whose text's red value should be mapped.
 * @param {number} color Where r for red, g, for green, b for blue, and a for alpha.
 * @param {number} lowerBin The lower bound of the bins to be mapped.
 * @param {VisualizerUpdateManager} visUpdateManager The visualizer update manager associated with the audio playback you would like the mapping with.
 * @param {interpolator} interpolator The interpolation function to use.
 * @param {number} [upperBin=undefined] The upper bound of the bins to be mapped. If left undefined, then only the bin defined by the min value is used.
 * @param {boolean} [reversed=true] If true, then the quieter, the greater the red value.
 */
export function mapColor(element, color, lowerBin, visUpdateManager, interpolator, upperBin = undefined, reversed = false) {
    const rgbaStr = "rgba";
    color = rgbaStr.indexOf(color);
    if (color < 0) throw new Error("Invalid color parameter provided.");
    if (!upperBin) upperBin = lowerBin;
    visUpdateManager.addVisualizerRangeUpdateListener(lowerBin, upperBin, (timeDelta, amp) => {
        const rgba = parseColor(element.style.color);
        rgba[color] = interpolator(rgba[color], amp, timeDelta);
        if (reversed) rgba[color] = 255 - rgba[color];
        element.style.color = rgbaToHexRgba(rgba);
    });
}
