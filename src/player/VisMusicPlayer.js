import Visualizer from "../visualization/Visualizer.js";
import VisUpdateRouter from "../visualization/VisUpdateRouter.js";
import MusicPlayer from "./MusicPlayer.js";
import MusicPlaylist from "./MusicPlaylist.js";



/**
 * A music player that provides easier access to the current musics visualizer data.
 * Additionally, automatically re-binds all the visualizer update listeners for music changes.
 * 
 * @augments MusicPlayer
 */
export default class VisMusicPlayer extends MusicPlayer {
    #fftSize = 1024;
    #visUpdateRouter;

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
        this.playlist.currentPosition = 0;
    }

    #onMusicChange = () => {
        let visUpdateRouterListeners = null;
        if (this.#visUpdateRouter) {
            visUpdateRouterListeners = this.#visUpdateRouter.retrieveListeners();
            this.#visUpdateRouter.unbindVisualizer();
        }
        this.#visUpdateRouter = new VisUpdateRouter(this.currentMusicVisualizer);
        if (visUpdateRouterListeners) {
            this.#visUpdateRouter.loadListeners(visUpdateRouterListeners);
        }
    };

    /**
     * Sets the the playlist.
     */
    set playlist(playlist) {
        if (!this.playlist) {
            super.playlist = playlist;
            return; // If it's the first time, then wait until super() is done.
        }
        this.playlist?.removePositionChangeListener(this.#onMusicChange);
        playlist.addPositionChangeListener(this.#onMusicChange);
        super.playlist = playlist;
    }

    get playlist() {
        return super.playlist;
    }

    playCurrent() {
        super.playCurrent();
        this.currentMusicVisualizer.analyze();
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