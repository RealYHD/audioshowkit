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

    /**
     * 
     * @param {SongPlaylist} playlist the playlist this player manages.
     * @param {number} [fftSize=1024] the size of the fft window for analysis.
     */
    constructor(playlist, fftSize = 1024) {
        super(playlist);
        this._fftSize = fftSize;
        this._visualizerUpdateManager = new VisualizerUpdateManager(this.getCurrentSongVisualizer());
    }

    /**
     * 
     * @param {SongPlaylist} playlist the new playlist of songs that this player is in charge of.
     */
    setPlaylist(playlist) {
        super.setPlaylist(playlist);
        this._visualizerUpdateManager = new VisualizerUpdateManager(this.getCurrentSongVisualizer());
    }

    /**
     * 
     * @returns {boolean} true if and only if successful in changing to the next song.
     */
    next() {
        const updateListeners = this._visualizerUpdateManager.getBinnedListeners();
        if (!super.next()) return false;
        this._visualizerUpdateManager = new VisualizerUpdateManager(this.getCurrentSongVisualizer());
        this._visualizerUpdateManager.setBinnedListeners(updateListeners);
        return true;
    }

    /**
     * Jumps to the previous song if possible.
     * 
     * @returns {boolean} true if and only if successful in switching to the previous song in the playlist.
     */
    previous() {
        const updateListeners = this._visualizerUpdateManager.getBinnedListeners();
        if (!super.previous()) return false;

        this._visualizerUpdateManager = new VisualizerUpdateManager(this.getCurrentSongVisualizer());
        this._visualizerUpdateManager.setBinnedListeners(updateListeners);
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
        this._visualizerUpdateManager = new VisualizerUpdateManager(this.getCurrentSongVisualizer());
        this._visualizerUpdateManager.setBinnedListeners = updateListeners();
        return true;
    }

    /**
     * 
     * @returns {VisualizerUpdateManager} the current visualizer update manager.
     */
    getCurrentVisualizerUpdateManager() {
        return this._visualizerUpdateManager();
    }

    /**
     * 
     * @returns {Visualizer} the current song's visualizer.
     */
    getCurrentSongVisualizer() {
        return this.getCurrentSong().getVisualizer();
    }
}