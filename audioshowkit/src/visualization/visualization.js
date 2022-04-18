import Visualizer from "./Visualizer.js";
import VisualizerUpdateManager from "./VisualizerUpdateManager.js";

/**
 * Instantiates a visualizer.
 * 
 * @see Visualizer for information on the returned object.
 * @param {HTMLMediaElement|MediaSource} mediaSource the source of audio to be visualized.
 * @param {number} [fftSize=1024] the FFT window size. 
 * @returns {Visualizer} the visualizer with the given media source and the given FFT size.
 */
export function createVisualizer(mediaSource, fftSize = 1024) {
    return new Visualizer(mediaSource, fftSize);
}

/**
 * Instantiates a VisualizerUpdateManager.
 * 
 * @see VisualizerUpdateManager for information on the returned object.
 * @param {Visualizer} visualizer the visualizer this update manager manages.
 * @returns {VisualizerUpdateManager} the instantiated visualizer update manager for the given visualizer.
 */
export function createVisualizerUpdateManager(visualizer) {
    return new VisualizerUpdateManager(visualizer);
}