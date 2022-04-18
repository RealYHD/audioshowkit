import Visualizer from "../visualization/Visualizer.js";

/**
 * A song with metadata that can be used as part of a {@link SongPlaylist}.
 * 
 */
export default class PlayListSong {
    #displayName;
    #author;
    #url;
    #audio;
    #visualizer;
    #ready = false;

    /**
     * Constructs a song for a {@link SongPlaylist}.
     * 
     * @param {string} url the url to fetch the song from.
     * @param {string} name the name of the song.
     * @param {string} author the author of the song.
     */
    constructor(url, name, author) {
        this.#displayName = name;
        this.#author = author;
        this.#url = url;
    }

    /**
     * @typedef {function} AudioEventCallback
     * @param {HTMLAudioElement} audio
     */

    /**
     * 
     * @param {AudioEventCallback} [onReady] called when the song is ready, including right away if the song is already ready.
     * @returns {HTMLAudioElement} The audio element that represents this song.
     */
    fetchAudio(onReady) {
        if (this.#audio) {
            if (this.#ready) {
                if (onReady) onReady(this.#audio);
            }
            return this.#audio;
        }
        this.#audio = new Audio(this.#url);
        console.log("Audio is not ready. Loading.");
        const listener = () => {
            this.#ready = true;
            if (onReady && this.isAudioInstantiated()) {
                onReady(this.#audio);
            }
        };
        this.#audio.addEventListener("canplaythrough", listener, { once: true });
        return this.#audio;
    }

    /**
     * 
     * The name of the song to be displayed.
     */
    get displayName() {
        return this.#displayName;
    }

    /**
     * 
     * The author of the song.
     */
    get author() {
        return this.#author;
    }

    /**
     * 
     * The url at which the file for this song can be found.
     */
    get url() {
        return this.#url;
    }

    /**
     * 
     * @returns {boolean} true if and only if there is audio data that is either already loaded or is being loaded.
     */
    isAudioInstantiated() {
        return this.#audio ? true : false;
    }

    /**
     * Begins audio playback as soon as possible.
     * 
     * This function uses the {@link PlaylistSong#getAudio} function and specifically, the {@link AudioEventCallback}.
     */
    play() {
        this.fetchAudio((audio) => {
            audio.play();
        });
    }

    /**
     * Pauses the audio playback, unless the audio data has yet to be instantiated.
     */
    pause() {
        if (!this.isAudioInstantiated()) return;
        this.fetchAudio((audio) => {
            audio.pause();
        });
    }

    /**
     * 
     * The volume on a scale of 0 to 1.
     */
    get volume() {
        return this.fetchAudio().volume;
    }

    /**
     * 
     * The normalized volume on a scale of 0 to 1.
     */
    set volume(volume) {
        this.fetchAudio().volume = volume;
    }
    /**
     * 
     * The number of seconds into the song.
     */
    get currentTime() {
        return this.fetchAudio().currentTime;
    }

    /**
     * 
     * The time position in the song to jump to in seconds.
     */
    set currentTime(currentTime) {
        this.fetchAudio().currentTime = currentTime;
    }

    /**
     * 
     * The duration of the song.
     */
    get duration() {
        return this.fetchAudio().duration;
    }

    /**
     * Unloads the audio data.
     * Makes sure the audio is paused.
     * 
     * Also calls {@link PlaylistSong#unloadVisualizer}.
     */
    unloadAudio() {
        if (!this.isAudioInstantiated()) return;
        this.#audio.pause();
        this.unloadVisualizer();
        this.#audio = null;
        this.#ready = false;
    }

    /**
     * 
     * @param {number} [fftSize=1024] the size of the FFT window.
     * @returns {Visualizer} returns the visualizer.
     */
    getVisualizer(fftSize = 1024) {
        if (this.#visualizer && this.#visualizer.getFftSize() === fftSize) return this.#visualizer;
        this.#visualizer = new Visualizer(this.fetchAudio(), fftSize);
        return this.#visualizer;
    }

    /**
     * 
     * @returns {boolean} returns true if and only if the visualizer is instantiated.
     */
    isVisualizerInstantiated() {
        return this.#visualizer ? true : false;
    }

    /**
     * Unloads the visualizer.
     * Stops the visualizer.
     */
    unloadVisualizer() {
        this.#visualizer.stop();
        this.#visualizer = null;
    }
}