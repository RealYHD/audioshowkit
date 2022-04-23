/**@module */

/**
 * @callback binSelector 
 * @param {number[]} bins Array of frequency bins.
 * @returns {number} A number from 0 to 255 representing the bin value to be used.
 */

/**
 * Creates a {@link module:support/bins~binSelector} that simply uniformly averages all bins and returns said average.
 * 
 * @returns {module:support/bins~binSelector} that simply uniformly averages all bins and returns said average.
 */
export function createUniAvgSel() {
    return (bins) => {
        let normAvg = 0;
        for (let i = 0; i < bins.length; i++) {
            normAvg += bins[i];
        }
        normAvg /= bins.length;
        return normAvg;
    };
}