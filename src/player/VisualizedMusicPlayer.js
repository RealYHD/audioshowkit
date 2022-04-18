import Visualizer from "../visualization/Visualizer.js";
import VisualizerUpdateManager from "../visualization/VisualizerUpdateManager.js";
import MusicPlayer from "./MusicPlayer.js";
import MusicPlaylist from "./MusicPlaylist.js";

/**@module */

/**
 * A music player that provides easier access to the current musics visualizer data.
 * Additionally, automatically re-binds all the visualizer update listeners for music changes.
 * 
 * @augments MusicPlayer
 */
export default class VisualizedMusicPlayer extends MusicPlayer {
    #fftSize = 1024;
    #visualizerUpdateManager;

    /**
     * Instantiates a music player with visualization features.
     * 
     * @param {MusicPlaylist} playlist the playlist this player manages.
     * @param {number} [fftSize=1024] the size of the fft window for analysis.
     */
    constructor(playlist, fftSize = 1024) {
        super(playlist);
        this.#fftSize = fftSize;
        this.#visualizerUpdateManager = new VisualizerUpdateManager(this.getCurrentMusicVisualizer());
    }

    /**
     * Sets the the playlist.
     */
    set playlist(playlist) {
        super.playlist = playlist;
        this.#visualizerUpdateManager = new VisualizerUpdateManager(this.getCurrentMusicVisualizer());
    }

    /**
     * 
     * @returns {boolean} true if and only if successful in changing to the next music.
     */
    next() {
        const updateListeners = this.#visualizerUpdateManager.getBinnedListeners();
        if (!super.next()) return false;
        this.#visualizerUpdateManager = new VisualizerUpdateManager(this.getCurrentMusicVisualizer());
        this.#visualizerUpdateManager.setBinnedListeners(updateListeners);
        return true;
    }

    /**
     * Jumps to the previous music if possible.
     * 
     * @returns {boolean} true if and only if successful in switching to the previous music in the playlist.
     */
    previous() {
        const updateListeners = this.#visualizerUpdateManager.getBinnedListeners();
        if (!super.previous()) return false;

        this.#visualizerUpdateManager = new VisualizerUpdateManager(this.getCurrentMusicVisualizer());
        this.#visualizerUpdateManager.setBinnedListeners(updateListeners);
        return true;
    }

    /**
     * 
     * @param {number} index the index of the music to change to.
     * @returns {boolean} true if and only if successful in jumping to the given index.
     */
    changeCurrent(index) {
        const updateListeners = this.VisualizerUpdateManager.getBinnedListeners();
        if (!super.changeCurrent(index)) return false;
        this.#visualizerUpdateManager = new VisualizerUpdateManager(this.getCurrentMusicVisualizer());
        this.#visualizerUpdateManager.setBinnedListeners = updateListeners();
        return true;
    }

    /**
     * @returns {VisualizerUpdateManager} The current visualizer update manager.
     */
    get currentVisualizerUpdateManager() {
        return this.#visualizerUpdateManager();
    }

    /**
     * @returns {Visualizer} The current music's visualizer.
     */
    get currentMusicVisualizer() {
        return this.getCurrentMusic().getVisualizer();
    }
}