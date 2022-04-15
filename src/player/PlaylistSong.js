import Visualizer from "../Visualizer";
import SongPlaylist from "./SongPlaylist";

/**
 * A song with metadata that can be used as part of a {@link SongPlaylist}.
 */
export default class PlayListSong {

    /**
     * Constructs a song for a {@link SongPlaylist}.
     * 
     * @param {string} url the url to fetch the song from.
     * @param {string} name the name of the song.
     * @param {string} author the author of the song.
     * @param {SongPlaylist} playlist the {@link SongPlaylist} this song is part of.
     */
    constructor(url, name, author, playlist) {
        this._displayName = name;
        this._author = author;
        this._url = url;
        this._playlist = playlist;
        this._audio = null;
        this._visualizer = null;

        /**
         * Whether or not this song is ready to be played.
         */
        this.ready = false;
    }

    /**
     * @callback AudioEventCallback
     * @param {HTMLAudioElement} audio
     */

    /**
     * 
     * @param {AudioEventCallback} [onReady] called when the song is ready, including right away if the song is already ready.
     * @returns {HTMLAudioElement} The audio element that represents this song.
     */
    getAudio(onReady) {
        if (this._audio) {
            if (this.ready) {
                if (onReady) onReady(this._audio);
            }
            return this._audio;
        }
        this._audio = new Audio(this._url);

        this._audio.addEventListener("canplaythrough", () => {
            this.ready = true;
            if (onReady) {
                onReady(this._audio);
            }
        });
        return this._audio;
    }

    /**
     * 
     * @returns {string} representing the name of the song to be displayed.
     */
    getDisplayName = function () {
        return this._displayName;
    };

    /**
     * 
     * @returns {string} representing the author of the song.
     */
    getAuthor = function () {
        return this._getAuthor;
    };

    /**
     * 
     * @returns {string} representing the url at which the file for this song can be found.
     */
    getUrl = function () {
        return this._url;
    };

    /**
     * 
     * @returns {SongPlaylist} the playlist this song is part of.
     */
    getPlaylist = function () {
        return this._playlist;
    };

    /**
     * 
     * @returns {boolean} true if and only if there is audio data that is either already loaded or is being loaded.
     */
    isAudioInstantiated() {
        return this._audio ? true : false;
    }

    /**
     * Begins audio playback as soon as possible.
     */
    play() {
        this.getAudio((audio) => {
            audio.play();
        });
    }

    /**
     * Pauses the audio playback, unless the audio data has yet to be instantiated.
     */
    pause() {
        if (!this.isAudioInstantiated()) return;
        this.getAudio((audio) => {
            audio.pause();
        });
    }

    /**
     * 
     * @returns {number} the volume on a scale of 0 to 1.
     */
    getVolume() {
        return this.getAudio().volume;
    }

    /**
     * 
     * @param {number} volume a normalized volume on a scale of 0 to 1.
     */
    setVolume(volume) {
        this.getAudio().volume = volume;
    }
    /**
     * 
     * @returns {number} the number of seconds into the song.
     */
    getCurrentTime() {
        return this.getAudio().currentTime;
    }

    /**
     * 
     * @param {number} currentTime the time position in the song to jump to in seconds.
     */
    setCurrentTime(currentTime) {
        this.getAudio().currentTime = currentTime;
    }

    /**
     * 
     * @returns {number} the duration of the song.
     */
    getDuration() {
        return this.getAudio().duration;
    }

    /**
     * Unloads the audio data.
     */
    unloadAudio() {
        if (!this.isAudioInstantiated()) return;
        this._audio.pause();
        this.unloadVisualizer();
        this._audio = null;
        this.ready = false;
    }

    /**
     * 
     * @param {number} [fftSize=1024] the size of the FFT window.
     * @returns {Visualizer} returns the visualizer.
     */
    getVisualizer(fftSize = 1024) {
        if (this._visualizer && this._visualizer.getFftSize() === fftSize) return this._visualizer;
        this._visualizer = new Visualizer(this.getAudio(), fftSize);
        return this._visualizer;
    }

    /**
     * 
     * @returns {boolean} returns true if and only if the visualizer is instantiated.
     */
    isVisualizerInstantiated() {
        return this._visualizer ? true : false;
    }

    /**
     * Unloads the visualizer.
     */
    unloadVisualizer() {
        this._visualizer.stop();
        this._visualizer = null;
    }
}