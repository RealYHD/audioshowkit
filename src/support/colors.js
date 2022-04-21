/**@module */

/**
 * Converts from rgba hex value to an array of four numbers representing r, g, b, and a respectively.
 * 
 * @param {string} hex the hex value.
 * @returns {number[]} the resulting components of the hex value.
 */
export function rgbaHexToRgba(hex) {
    if (hex.startsWith("#")) {
        hex = hex.substring(1);
        if (hex.length > 8) {
            throw new Error("Invalid hex syntax (length).");
        }
    } else {
        throw new Error("Invalid hex syntax (missing pound).");
    }
    for (let i = hex.length; i < 8; i++) {
        hex = "0" + hex;
    }
    let remaining = hex.length;
    let result = [0, 0, 0, 0];
    result[3] = parseInt(hex.substring(remaining -= 2, remaining + 2), 16);
    result[2] = parseInt(hex.substring(remaining -= 2, remaining + 2), 16);
    result[1] = parseInt(hex.substring(remaining -= 2, remaining + 2), 16);
    result[0] = parseInt(hex.substring(remaining -= 2, remaining + 2), 16);
    return result;
}

/**
 * 
 * @param {string} hex the hex value.
 * @returns {number[]} the resulting r, g, and b components.
 */
export function rgbHexToRgba(hex) {
    const result = rgbaHexToRgba(hex + "FF");
    return result;
}

/**
 * Converts from the CSS rgba call to an array of four numbers representing r, g, b and a.
 * 
 * @param {string} rgba The CSS rgba(r,g,b,a) call.
 * @returns {number[]} the rgba components.
 */
export function cssRgbaToRgba(rgba) {
    rgba = rgba.replaceAll(" ", "");
    const cssRgbaRegex = /rgba\((\d+),(\d+),(\d+),(\d+)\)/;
    try {
        const matches = rgba.match(cssRgbaRegex);
        return [parseInt(matches[1]), parseInt(matches[2]), parseInt(matches[3]), parseInt(matches[4])];
    } catch (error) {
        throw new Error("Could not parse the given css rgba function call: " + error.message);
    }
}

/**
 * Converts from the CSS rgb call to an array of four numbers representing r, g, b and a.
 * 
 * @param {string} rgb The CSS rgb(r,g,b) call.
 * @returns {number[]} the rgba components.
 */
export function cssRgbToRgba(rgb) {
    rgb = rgb.replaceAll(" ", "");
    const cssRgbRegex = /rgb\((\d+),(\d+),(\d+)\)/;
    try {
        const matches = rgb.match(cssRgbRegex);
        return [parseInt(matches[1]), parseInt(matches[2]), parseInt(matches[3]), 255];
    } catch (error) {
        throw new Error("Could not parse the given css rgb function call: " + error.message);
    }
}

/**
 * Converts a given array of r, g, b, and a components into a hex string.
 * 
 * @param {number[]} rgba an array with red, green, blue, and alpha components in that order.
 * @returns {string} The resulting hex value.
 */
export function rgbaToHexRgba(rgba) {
    const filler = (hex) => hex.length < 2 ? "0" + hex : hex;
    return "#" + filler(Math.round(rgba[0]).toString(16)) + filler(Math.round(rgba[1]).toString(16)) + filler(Math.round(rgba[2]).toString(16)) + filler(Math.round(rgba[3]).toString(16));
}


/**
 * Converts a css rgb, rgba, hex, or rgba hex to a rgba array.
 * 
 * For hex, we assume there is no alpha channel unless the hex value is not minimized.
 * 
 * @param {string} color The string that contains the color information.
 * @returns {number[]} an array that contains the r, g, b and a components.
 */
export function parseColor(color) {
    if (color.startsWith("rgba(")) {
        return cssRgbaToRgba(color);
    } else if (color.startsWith("rgb(")) {
        return cssRgbToRgba(color);
    } else if (color.startsWith("#")) {
        if (color.length === 9) {
            return rgbaHexToRgba(color);
        } else {
            return rgbHexToRgba(color);
        }
    }
    throw new Error("Could not parse to an rgba value.");
}
