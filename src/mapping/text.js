import { parseColor, rgbaToHexRgba } from "./colors.js";
import VisualizerUpdateManager from "../visualization/VisualizerUpdateManager.js";
/**
 * Maps the red component of the text color to a certain range of bins.
 * 
 * @param {HTMLElement} element The element whose text's red value should be mapped.
 * @param {number} color Where 0 for red, 1, for blue, 2 for green, and 3 for alpha.
 * @param {number} min The lower bound of the bins to be mapped.
 * @param {VisualizerUpdateManager} visUpdateManager The visualizer update manager associated with the audio playback you would like the mapping with.
 * @param {import("./easings.js").interpolator} interpolator The interpolation function to use.
 * @param {number} [max=undefined] The upper bound of the bins to be mapped. If left undefined, then only the bin defined by the min value is used.
 * @param {boolean} [reversed=true] If true, then the quieter, the greater the red value.
 */
export function mapColor(element, color, min, visUpdateManager, interpolator, max = undefined, reversed = false) {
    if (!max) max = min;
    visUpdateManager.addVisualizerRangeUpdateListener(min, max, (timeDelta, amp) => {
        const rgba = parseColor(element.style.color);
        rgba[color] = interpolator(rgba[color], amp, timeDelta);
        if (reversed) rgba[color] = 255 - rgba[color];
        element.style.color = rgbaToHexRgba(rgba);
    });
}

