
/**
 * @typedef {Function} interpolator
 * @param {number} current the current value.
 * @param {number} dest the destination value.
 * @param {number} frameDelta the time elapsed since the last update.
 * @returns {number} the new current value.
 */

// TODO: Add some interpolation functions.

/**
 * 
 * @param {number} rate the number of frequency values to shift by per second.
 * @returns {interpolator} the interpolation function with the given rate.
 */
export function createEaseLinear(rate) {
    return (current, dest, frameDelta) => {
        let direction = 1;
        if (dest < current) {
            direction = -1;
        }
        return current + (Math.min(rate * frameDelta, dest) * direction);
    };
}