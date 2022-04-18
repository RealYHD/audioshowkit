import "../styles/musicPlayer.css";
import MusicPlaylist from "./MusicPlaylist.js";

/**@module */

/**
 * @callback changeListener
 * @param {*} old the previous value.
 * @param {*} current the the current (new) value.
 */

/**
 * A player that keeps track of global properties for playback as well as traversing a playlist. Additionally keeps track of music audio data and attempts to reduce memory usage when possible.
 */
export default class MusicPlayer {
    #playlist;
    #volume = 1;
    #autoplay = false;
    #wasPlaying = false;
    #playlistChangeListeners = [];
    #volumeChangeListeners = [];
    #allAudioEventListeners = {};

    /**
     * 
     * @param {MusicPlaylist} playlist the playlist of musics that this player is in charge of.
     */
    constructor(playlist) {
        this.playlist = playlist;
        this.addEventListenerToCurrentAudio("ended", () => {
            this.next();
        });
    }

    /**
     * The new playlist of musics that this player is in charge of.
     */
    set playlist(playlist) {
        if (this.playlist) this.unloadAllAudio();
        if (this.playlist) this.playlist.removePositionChangeListener(this.#onMusicChange);
        const old = this.#playlist;
        this.#playlist = playlist;
        this.#playlist.addPositionChangeListener(this.#onMusicChange);
        this.#playlist.currentPosition = 0; // Updates the listener.
        this.#playlistChangeListeners.forEach(playlistChangeListener => {
            playlistChangeListener(old, this.getPlaylist());
        });

    }

    /**
     * The current playlist of musics that this player is in charge of.
     * 
     * @returns {MusicPlaylist} The music playlist this player is currently using.
     */
    get playlist() {
        return this.#playlist;
    }

    /**
     * 
     * @returns {boolean} true if and only if successful in going to the next music.
     */
    next() {
        return this.playlist.currentPosition += 1;
    }

    /**
     * attempts to go to the previous music.
     * 
     * @returns {boolean} true if and only if successful in going to the previous music.
     */
    previous() {
        return this.playlist.currentPosition -= 1;
    }

    /**
     * @param {number} old the index of the previous music.
     * @param {number} current the index of the current music.
     * @returns {boolean} true if and only if successful jumping to the given index.
     */
    #onMusicChange = (old, current) => { // Anonymous to avoid overriding "this".
        const oldMusic = this.playlist.musicAtIndex(old);
        const currentMusic = this.playlist.musicAtIndex(current);
        Object.keys(this.#allAudioEventListeners).forEach(key => {
            const listeners = this.#allAudioEventListeners[key];
            listeners.forEach(listener => {
                oldMusic.fetchAudio().removeEventListener(key, listener);
            });
        });
        oldMusic.unloadAudio();

        Object.keys(this.#allAudioEventListeners).forEach(key => {
            const listeners = this.#allAudioEventListeners[key];
            listeners.forEach(listener => {
                currentMusic.fetchAudio().addEventListener(key, listener);
            });
        });
        if (this.#wasPlaying || this.#autoplay) {
            this.playCurrent();
        }
        return true;
    };

    playCurrent() {
        this.playlist.currentMusic.fetchAudio((audio) => {
            audio.volume = this.volume;
            audio.play();
        });
        this.#wasPlaying = true;
    }

    /**
     * Pauses the current playing music (if there is one playing).
     */
    pauseCurrent() {
        this.playlist.currentMusic.fetchAudio().pause();
    }

    /**
     * Toggles whether or not the current music is playing.
     */
    togglePlay() {
        if (this.playing) {
            this.pauseCurrent();
        } else {
            this.playCurrent();
        }
    }

    /**
     * A number between 0 to 1 inclusive representing the volume of the player. Values out of these bounds will be rounded to the nearest bound.
     */
    set volume(volume) {
        if (volume > 1) volume = 1;
        if (volume < 0) volume = 0;
        this.#volume = volume;
        this.playlist.currentMusic.fetchAudio().volume = this.#volume;
    }

    /**
     * 
     * @returns {number} The current volume of the player represented by a number between 0 and 1 inclusive.
     */
    get volume() {
        return this.#volume;
    }

    /**
     * Attempts to seek to the given position.
     * 
     * @param {number} position the position to seek to.
     * @returns {boolean} true if and only if the position to seek to is within the duration of the track. This also means that if the track has not finished loading the duration data, than this will always return false.
     */
    seek(position) {
        if (position > this.playlist.playlist.currentMusic.fetchAudio().duration || position < 0) return false;
        this.playlist.playlist.currentMusic.fetchAudio(audio => {
            audio.currentTime = position;
        });
        return true;
    }

    /**
     * 
     * @returns {number} How many seconds into the audio track has been played in seconds.
     */
    get currentPosition() {
        return this.playlist.playlist.currentMusic.fetchAudio().currentTime;
    }

    /**
     * 
     * @returns {number} The total length of the music, or NaN if this information has not loaded yet.
     */
    get currentDuration() {
        return this.playlist.playlist.currentMusic.fetchAudio().duration;
    }

    /**
     * Convenience method for creating a play button complete with CSS for transitioning to a paused button.
     * 
     * Automatically hooked up to the player's state change updates and play and pause functions.
     * 
     * @returns {HTMLElement} the play button element that can be added to a DOM.
     */
    generatePlayElement() {
        const playButton = document.createElement("button");
        playButton.classList.add("player");
        playButton.classList.add("play-btn");
        if (this.playing) playButton.classList.add("pause");

        playButton.addEventListener("click", () => {
            this.togglePlay();
        });

        this.addEventListenerToCurrentAudio("play", () => {
            playButton.classList.add("pause");
        });
        this.addEventListenerToCurrentAudio("pause", () => {
            playButton.classList.remove("pause");
        });
        return playButton;
    }

    generateNextElement() {
        const nextButton = document.createElement("button");
        nextButton.classList.add("player");
        nextButton.classList.add("next");
        nextButton.addEventListener("click", () => {
            this.next();
        });
        return nextButton;
    }

    generatePreviousElement() {
        const previousButton = document.createElement("button");
        previousButton.classList.add("player");
        previousButton.classList.add("previous");
        previousButton.addEventListener("click", () => {
            this.previous();
        });
        return previousButton;
    }

    /**
     * 
     * @param {changeListener} listener the playlist change listener to add to the callback list.
     * @returns {boolean} true if and only if the given listener was successfully registered.
     */
    addPlaylistChangeListener(listener) {
        if (this.#playlistChangeListeners.includes(listener)) return false;
        this.#playlistChangeListeners.push(listener);
        return true;

    }

    /**
     * 
     * @param {changeListener} listener the playlist change listener to remove.
     * @returns {boolean} true if and only if a listener was successfully removed from the callback list.
     */
    removePlaylistChangeListener(listener) {
        const removeIndex = this.#playlistChangeListeners.indexOf(listener);
        if (removeIndex < 0) return false;

        this.playlistChangeListener.splice(removeIndex, 1);
        return true;
    }

    /**
     * 
     * @param {changeListener} listener the listener that is called when the player's volume is changed.
     * @returns {boolean} true if and only if the listener was successfully added.
     */
    addVolumeChangeListener(listener) {
        if (this.#volumeChangeListeners.includes(listener)) return false;
        this.#volumeChangeListeners.push(listener);
        return true;
    }

    /**
     * 
     * @param {changeListener} listener the volume change listener to remove.
     * @returns {boolean} true if and only if a listener was successfully removed from the callback list.
     */
    removeVolumeChangeListener(listener) {
        const removeIndex = this.#volumeChangeListeners.indexOf(listener);
        if (removeIndex < 0) return false;

        this.#volumeChangeListeners.splice(removeIndex, 1);
        return true;
    }


    /**
     * 
     * @param {string} type the type of the listener on the {@link HTMLAudioElement}.
     * @param {Function} eventListener the event listener.
     * @returns {boolean} true if and only if successfully registered event listener.
     */
    addEventListenerToCurrentAudio(type, eventListener) {
        let typeListeners = this.#allAudioEventListeners[type];
        if (!typeListeners) {
            typeListeners = [];
            this.#allAudioEventListeners[type] = typeListeners;
        }
        if (typeListeners.includes(eventListener)) return false;
        typeListeners.push(eventListener);
        this.playlist.currentMusic.fetchAudio().addEventListener(type, eventListener);
        return true;
    }

    /**
     * 
     * @param {string} type the type of the listener on the {@link HTMLAudioElement}.  
     * @param {Function} eventListener the event listener. 
     * @returns {boolean} true if and only if the event listener was successfully added.
     */
    removeEventListenerFromCurrentAudio(type, eventListener) {
        let typeListeners = this.#allAudioEventListeners[type];
        if (!typeListeners) return false;
        const removeIndex = typeListeners.indexOf(eventListener);
        if (removeIndex < 0) return false;
        typeListeners.splice(removeIndex, 1);
        this.playlist.playlist.currentMusic.fetchAudio().removeEventListener(type, eventListener);
        return true;
    }

    /**
     * @returns {boolean} If the player is playing any musics right now.
     */
    get playing() {
        return this.playlist.currentMusic.isAudioInstantiated() && !this.playlist.currentMusic.fetchAudio().paused;
    }

    /**
     * Unloads the audio data of all musics in this playlist.
     */
    unloadAllAudio() {
        this.playlist.forEach(music => {
            music.unloadAudio();
        });
    }
}