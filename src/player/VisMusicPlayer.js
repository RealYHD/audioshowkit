import Visualizer from "../visualization/Visualizer.js";
import VisUpdateRouter from "../visualization/VisUpdateRouter.js";
import MusicPlayer from "./MusicPlayer.js";
import MusicPlaylist from "./MusicPlaylist.js";

/**@module */

/**
 * A music player that provides easier access to the current musics visualizer data.
 * Additionally, automatically re-binds all the visualizer update listeners for music changes.
 * 
 * @augments MusicPlayer
 */
export default class VisMusicPlayer extends MusicPlayer {
    #fftSize = 1024;
    #visUpdateRouter;
    #visUpdateRouterListeners = null;

    /**
     * Instantiates a music player with visualization features.
     * 
     * @param {MusicPlaylist} playlist the playlist this player manages.
     * @param {number} [fftSize=1024] the size of the fft window for analysis.
     */
    constructor(playlist, fftSize = 1024) {
        super(playlist);
        playlist.addPositionChangeListener(this.#onMusicChange); // First time only: after setting the playlist, add the listener.
        this.#fftSize = fftSize;
        this.#visUpdateRouter = new VisUpdateRouter(fftSize);
    }

    #onMusicChange = () => {
        this.#visUpdateRouterListeners = this.#visUpdateRouter.retrieveListeners();
        this.#visUpdateRouter?.unbindVisualizer();
    };

    /**
     * Sets the the playlist.
     */
    set playlist(playlist) {
        if (!this.playlist) {
            super.playlist = playlist;
            return; // HACK: If it's the first time, then wait until super() is done.
        }
        this.playlist?.removePositionChangeListener(this.#onMusicChange);
        this.playlist.addPositionChangeListener(this.#onMusicChange);
        super.playlist = playlist;
    }

    get playlist() {
        return super.playlist;
    }

    playCurrent() {
        console.log("attempted play from vis");
        super.playCurrent();
        const visualizer = this.playlist.currentMusic.fetchVisualizer();
        this.#visUpdateRouter.visualizer = visualizer;
        visualizer.analyze();
        if (this.#visUpdateRouterListeners) this.#visUpdateRouter.loadListeners(this.#visUpdateRouterListeners);
    }


    /**
     * @returns {VisUpdateRouter} The current visualizer update manager.
     */
    get visUpdateRouter() {
        return this.#visUpdateRouter;
    }

    /**
     * @returns {Visualizer} The current music's visualizer.
     */
    get currentMusicVisualizer() {
        return this.playlist.currentMusic.fetchVisualizer(this.#fftSize);
    }
}