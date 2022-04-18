import Visualizer from "../visualization/Visualizer.js";



/**
 * @callback AudioEventCallback
 * @param {HTMLAudioElement} audio
 */

/**
 * A music with metadata that can be used as part of a {@link MusicPlaylist}.
 * 
 */
export default class Music {
    #displayName;
    #author;
    #url;
    #audio;
    #visualizer;
    #ready = false;

    /**
     * Constructs a music for a {@link MusicPlaylist}.
     * 
     * @param {string} url the url to fetch the music from.
     * @param {string} name the name of the music.
     * @param {string} author the author of the music.
     */
    constructor(url, name, author) {
        this.#displayName = name;
        this.#author = author;
        this.#url = url;
    }


    /**
     * 
     * @param {AudioEventCallback} [onReady] called when the music is ready, including right away if the music is already ready.
     * @returns {HTMLAudioElement} The audio element that represents this music.
     */
    fetchAudio(onReady) {
        if (this.#audio) {
            if (this.#ready) {
                if (onReady) onReady(this.#audio);
            } else if (onReady) {
                this.#audio.addEventListener("canplaythrough", () => {
                    onReady(this.#audio);
                }, { once: true });
            }
            return this.#audio;
        }
        this.#audio = new Audio(this.#url);
        this.#audio.addEventListener("canplaythrough", () => {
            this.#ready = true;
            if (onReady && this.isAudioInstantiated()) {
                onReady(this.#audio);
            }
        }, { once: true });
        return this.#audio;
    }

    /**
     * @returns {string} The name of the music to be displayed.
     */
    get displayName() {
        return this.#displayName;
    }

    /**
     * @returns {string} The author of the music.
     */
    get author() {
        return this.#author;
    }

    /**
     * @returns {string} The url at which the file for this music can be found.
     */
    get url() {
        return this.#url;
    }

    /**
     * @returns {boolean} true if and only if there is audio data that is either already loaded or is being loaded.
     */
    isAudioInstantiated() {
        return this.#audio ? true : false;
    }

    /**
     * Begins audio playback as soon as possible.
     * 
     * This function uses the {@link PlaylistMusic#getAudio} function and specifically, the {@link AudioEventCallback}.
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
     * @returns {number} The volume on a scale of 0 to 1.
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
     * @returns {number} The number of seconds into the music.
     */
    get currentTime() {
        return this.fetchAudio().currentTime;
    }

    /**
     * 
     * The time position in the music to jump to in seconds.
     */
    set currentTime(currentTime) {
        this.fetchAudio().currentTime = currentTime;
    }

    /**
     * 
     * @returns {number} The duration of the music.
     */
    get duration() {
        return this.fetchAudio().duration;
    }

    /**
     * Unloads the audio data.
     * Makes sure the audio is paused.
     * 
     * Also calls {@link PlaylistMusic#unloadVisualizer}.
     */
    unloadAudio() {
        if (!this.isAudioInstantiated()) return;
        this.#audio.pause();
        this.unloadVisualizer();
        this.#audio = null;
        this.#ready = false;
    }

    /**
     * Fetches a visualizer for this music. If there did not exist one, one is instantiated.
     * 
     * If the provided fft window size is different from the current, a new one will also be instantiated.
     * 
     * @param {number} [fftSize=1024] the size of the FFT window.
     * @returns {Visualizer} returns the visualizer.
     */
    fetchVisualizer(fftSize = 1024) {
        if (this.#visualizer && this.#visualizer.fftSize === fftSize) return this.#visualizer;
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
        if (this.#visualizer) {
            this.#visualizer.stop();
            this.#visualizer = null;
        }
    }
}