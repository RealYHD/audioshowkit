import { parseColor, rgbaToHexRgba } from "./colors.js";
import VisualizerUpdateManager from "../visualization/VisualizerUpdateManager.js";
import { mapBinNumerical, mapRangedAvgNumerical } from "./generic.js";

// TODO: Future: Should be able to remove this since already declared in easings.js, but don't know how to link.
/**
 * @callback interpolator
 * @param {number} current the current value.
 * @param {number} dest the destination value.
 * @param {number} frameDelta the time elapsed since the last update.
 * @returns {number} the new current value.
 */

/**
 * @callback VisualizerUpdateManager.visualizerRangedUpdateListener
 * @param {number} timeDelta elapsed time since last update.
 * @param {number} bins the bins of the range.
 */

/**
 * @callback VisualizerUpdateManager.visualizerBinUpdateListener
 * @param {number} timeDelta elapsed time since last update.
 * @param {number} amplitude The amplitude of the associated bin.
 * @param {number} ampDelta change in amplitude of the frequency bin.
 */

/**
 * Maps the red component of the text color to a certain range of bins.
 * 
 * @param {object} rgbaMapConfiguration The configuration of the mapping.
 * @param {HTMLElement} rgbaMapConfiguration.element The element whose text's red value should be mapped.
 * @param {number} rgbaMapConfiguration.color Where r for red, g, for green, b for blue, and a for alpha.
 * @param {number} rgbaMapConfiguration.lowerBin The lower bound of the bins to be mapped.
 * @param {VisualizerUpdateManager} rgbaMapConfiguration.visUpdateManager The visualizer update manager associated with the audio playback you would like the mapping with.
 * @param {interpolator} rgbaMapConfiguration.interpolator The interpolation function to use.
 * @param {number} [rgbaMapConfiguration.upperBin=undefined] The upper bound of the bins to be mapped. If left undefined, then only the bin defined by the min value is used.
 * @param {boolean} [rgbaMapConfiguration.reversed=true] If true, then the quieter, the greater the red value.
 * @returns {{bin: number, listener: VisualizerUpdateManager.visualizerBinUpdateListener}|{lower: number, upper: number, listener: VisualizerUpdateManager.visualizerRangedUpdateListener}} The ranged listener that was added.
 */
export function mapRgba({ element, color, lowerBin, visUpdateManager, interpolator, upperBin = undefined, reversed = false }) {
    const rgbaStr = "rgba";
    color = rgbaStr.indexOf(color);
    if (color < 0) throw new Error("Invalid color parameter provided.");
    const getter = () => parseColor(element.style.color)[color];
    const setter = (value) => {
        const changed = parseColor(element.style.color);
        changed[color] = value;
        element.style.color = rgbaToHexRgba(changed);
    };
    if (!upperBin) {
        return mapBinNumerical({
            minVal: 0,
            maxVal: 255,
            bin: lowerBin,
            getter: getter,
            setter: setter,
            interpolator: interpolator,
            visUpdateManager: visUpdateManager,
            reversed: reversed
        });
    }
    // TODO: Future: Could use the same object and modify
    return mapRangedAvgNumerical({
        minVal: 0,
        maxVal: 255,
        lowerBin: lowerBin,
        upperBin: upperBin,
        getter: getter,
        setter: setter,
        interpolator: interpolator,
        visUpdateManager: visUpdateManager,
        reversed: reversed
    });
}

/**
 * 
 * @param {object} fontSizeMapConfiguration The configuration of the font size mapping.
 * @param {HTMLElement} fontSizeMapConfiguration.element The element whose font sizes will be mapped to the amplitude.
 * @param {number} fontSizeMapConfiguration.growLower The lower limit of the font size.
 * @param {number} fontSizeMapConfiguration.growUpper The upper limit of the font size.
 * @param {string} fontSizeMapConfiguration.unit The unit the upper and lower bounds are measured in.
 * @param {number} fontSizeMapConfiguration.lowerBin The lower boundary of bins to be mapped (or the single bin to be mapped if the upper bin is undefined).
 * @param {VisualizerUpdateManager} fontSizeMapConfiguration.visUpdateManager the visualizer update manager to be mapped to.
 * @param {interpolator} fontSizeMapConfiguration.interpolator The interpolation function to be used to transition from one value to the next.
 * @param {number} [fontSizeMapConfiguration.upperBin=undefined] The upper bin, or undefined, which results in mapping to a single bin.
 * @param {boolean} [fontSizeMapConfiguration.reversed=false] If true, then high amplitudes are mapped to lower values and vice versa.
 * @returns {{bin: number, listener: VisualizerUpdateManager.visualizerBinUpdateListener}|{lower: number, upper: number, listener: VisualizerUpdateManager.visualizerRangedUpdateListener}} The ranged listener that was added.
 */
export function mapFontSize({ element, growLower, growUpper, unit, lowerBin, visUpdateManager, interpolator, upperBin = undefined, reversed = false }) {
    const getter = () => {
        return parseInt(element.style.fontSize);
    };
    const setter = (value) => {
        element.style.fontSize = value + unit;
    };
    if (!upperBin) {
        return mapBinNumerical({
            minVal: growLower,
            maxVal: growUpper,
            bin: lowerBin,
            getter: getter,
            setter: setter,
            interpolator: interpolator,
            visUpdateManager: visUpdateManager,
            reversed: reversed
        });
    }
    return mapRangedAvgNumerical({
        minVal: growLower,
        maxVal: growUpper,
        lowerBin: lowerBin,
        upperBin: upperBin,
        getter: getter,
        setter: setter,
        interpolator: interpolator,
        visUpdateManager: visUpdateManager,
        reversed: reversed
    });
}

// TODO: Future: map hue