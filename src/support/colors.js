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
    const cssRgbaRegex = /rgba\((\d+)[, ] ?(\d+)[, ] ?(\d+)[, ] ?(\d+)\)/;
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
    const cssRgbRegex = /rgb\((\d+)[, ] ?(\d+)[, ] ?(\d+)\)/;
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
 * Converts a css rgb, rgba, hex, hsl(a), or rgba hex to a rgba array.
 * 
 * For hex, we assume there is no alpha channel unless the hex value is not minimized.
 * 
 * @param {string} color The string that contains the color information.
 * @returns {number[]|null} an array that contains the r, g, b and a components. Returns null if there was an issue parsing the input.
 */
export function parseColorToRgba(color) {
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
    } else if (color.startsWith("hsl(")) {
        return hslaToRgba(cssHslaToHsla(color));
    }
    return null;
}

/**
 * Converts a css rgb, rgba, hex, hsl(a), or rgba hex to an hsla array.
 * 
 * @param {string} color The string that contains the color information.
 * @returns {number[]|null} An array that contains the h, s, l and alpha channel components. Returns null if there was an issue parsing the input.
 */
export function parseColorToHsla(color) {
    if (color.startsWith("rgba(")) {
        return rgbaToHsla(cssRgbaToRgba(color));
    } else if (color.startsWith("rgb(")) {
        return rgbaToHsla(cssRgbToRgba(color));
    } else if (color.startsWith("#")) {
        if (color.length === 9) {
            return rgbaToHsla(rgbaHexToRgba(color));
        } else {
            return rgbaToHsla(rgbHexToRgba(color));
        }
    } else if (color.startsWith("hsl(")) {
        return cssHslaToHsla(color);
    }
    return null;
}

/**
 * Converts a given rgb value to hsla. Alpha value is simply passed through.
 * 
 * @param {number[]} rgba An array that contains numbers representing the r, g, b, and a values respectively.
 * @returns {number[]} An array that contains the h, s, l, and a values.
 */
export function rgbaToHsla(rgba) { // Used GeeksForGeeks implementation
    let r = rgba[0] / 255;
    let g = rgba[1] / 255;
    let b = rgba[2] / 255;

    const cmax = Math.max(r, g, b);
    const cmin = Math.min(r, g, b);
    const delta = cmax - cmin;

    let h = 0;
    if (delta === 0) {
        h = 0;
    } else if (cmax === r) {
        h = 60 * (((g - b) / delta) % 6);
    } else if (cmax === g) {
        h = 60 * (2 + (b - r) / delta);
    } else if (cmax === b) {
        h = 60 * (4 + (r - g) / delta);
    }

    let l = (cmax + cmin) / 2;

    let s = 0;
    if (delta === 0) {
        s = 0;
    } else {
        s = delta / (1 - Math.abs(2 * l - 1));
    }

    return [h, s, l, rgba[3]];
}

/**
 * Converts a given hsv value to rgb. The alpha channel value is just passed through.
 * 
 * @param {number[]} hsla The HSL and alpha component array.
 * @returns {number[]} An array comprised of r, g, b and a values converted from the given HSL.
 */
export function hslaToRgba(hsla) {
    const h = hsla[0];
    const s = hsla[1];
    const l = hsla[2];

    const fn = (n) => {
        const k = ((n + (h / 30)) % 12);
        const a = s * Math.min(l, 1 - l);
        return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    };

    return [Math.round(fn(0) * 255), Math.round(fn(8) * 255), Math.round(fn(4) * 255), hsla[3]];
}

/**
 * Parses a CSS color property coded in hsl.
 * 
 * @param {string} cssHsla The style property value in HSL(A).
 * @returns {number[]} An array that contains the parsed H, S, L and alpha channel.
 */
export function cssHslaToHsla(cssHsla) {
    const cssHslaRegex = /hsl\((\d+)[, ] ?(\d+)%[, ] ?(\d+)% ?[, /]? ?(\d+)?\)/;
    try {
        const matches = cssHsla.match(cssHslaRegex);
        return [parseInt(matches[1]), parseInt(matches[2]) / 100, parseInt(matches[3]) / 100, isNaN(matches[4]) ? 255 : parseInt(matches[4])];
    } catch (error) {
        throw new Error("Could not parse the given HSL(a) value: " + error.message);
    }
}

/**
 * Converts an array containing the H, S, L and alpha values to a css hsl function call.
 * 
 * @param {number[]} hsla An array containing the H, S, L and alpha channel values.
 * @returns {string} The css hsl function call.
 */
export function hslaToCssHsla(hsla) {
    return "hsl(" + hsla[0] + ", " + (hsla[1] * 100) + "%, " + (hsla[2] * 100) + "%, " + hsla[3];
}

/**
 * Converts an array containing the R, G, B and alpha values to a css rgba function call.
 * 
 * @param {number[]} rgba An array whose elements are the rgba components to encode into a css rgba function call.
 * @returns {string} The css rgba function call.
 */
export function rgbaToCssRgba(rgba) {
    return "rgba(" + Math.round(rgba[0]) + ", " + Math.round(rgba[1]) + ", " + Math.round(rgba[2]) + ", " + Math.round(rgba[3]) + ")";
}