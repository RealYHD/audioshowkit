import Visualizer from "../visualization/Visualizer.js";
import VisualizerUpdateManager from "../visualization/VisualizerUpdateManager.js";
import SongPlayer from "./SongPlayer.js";
import SongPlaylist from "./SongPlaylist.js";

/**
 * A song player that provides easier access to the current songs visualizer data.
 * 
 * Additionally, automatically re-binds all the visualizer update listeners for song changes.
 * 
 * Automatically loads the songs.
 */
export default class VisualizedSongPlayer extends SongPlayer {
    #fftSize = 1024;
    #visualizerUpdateManager;

    /**
     * Instantiates a song player with visualization features.
     * 
     * @param {SongPlaylist} playlist the playlist this player manages.
     * @param {number} [fftSize=1024] the size of the fft window for analysis.
     */
    constructor(playlist, fftSize = 1024) {
        super(playlist);
        this.#fftSize = fftSize;
        this.#visualizerUpdateManager = new VisualizerUpdateManager(this.getCurrentSongVisualizer());
    }

    /**
     * Sets the the playlist.
     */
    set playlist(playlist) {
        super.playlist = playlist;
        this.#visualizerUpdateManager = new VisualizerUpdateManager(this.getCurrentSongVisualizer());
    }

    /**
     * 
     * @returns {boolean} true if and only if successful in changing to the next song.
     */
    next() {
        const updateListeners = this.#visualizerUpdateManager.getBinnedListeners();
        if (!super.next()) return false;
        this.#visualizerUpdateManager = new VisualizerUpdateManager(this.getCurrentSongVisualizer());
        this.#visualizerUpdateManager.setBinnedListeners(updateListeners);
        return true;
    }

    /**
     * Jumps to the previous song if possible.
     * 
     * @returns {boolean} true if and only if successful in switching to the previous song in the playlist.
     */
    previous() {
        const updateListeners = this.#visualizerUpdateManager.getBinnedListeners();
        if (!super.previous()) return false;

        this.#visualizerUpdateManager = new VisualizerUpdateManager(this.getCurrentSongVisualizer());
        this.#visualizerUpdateManager.setBinnedListeners(updateListeners);
        return true;
    }

    /**
     * 
     * @param {number} index the index of the song to change to.
     * @returns {boolean} true if and only if successful in jumping to the given index.
     */
    changeCurrent(index) {
        const updateListeners = this.VisualizerUpdateManager.getBinnedListeners();
        if (!super.changeCurrent(index)) return false;
        this.#visualizerUpdateManager = new VisualizerUpdateManager(this.getCurrentSongVisualizer());
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
     * @returns {Visualizer} The current song's visualizer.
     */
    get currentSongVisualizer() {
        return this.getCurrentSong().getVisualizer();
    }
}