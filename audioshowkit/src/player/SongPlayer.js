import "../styles/songplayer.css";
import PlayListSong from "./PlaylistSong.js";
import SongPlaylist from "./SongPlaylist.js";

/**
 * A player that keeps track of global properties for playback as well as traversing a playlist. Additionally keeps track of song audio data and attempts to reduce memory usage when possible.
 */
export default class SongPlayer {
    #playlist;
    #current = 0;
    #volume = 1;
    #autoplay = false;
    #playlistChangeListeners = [];
    #currentSongChangeListeners = [];
    #volumeChangeListeners = [];
    #allAudioEventListeners = {};

    /**
     * 
     * @param {SongPlaylist} playlist the playlist of songs that this player is in charge of.
     */
    constructor(playlist) {
        this.playlist = playlist;
        this.addEventListenerToCurrentAudio("ended", () => {
            this.next();
        });
    }

    /**
     * The new playlist of songs that this player is in charge of.
     */
    set playlist(playlist) {
        this.#playlist?.unloadAllAudio();
        const old = this.#playlist;
        this.#playlist = playlist;
        if (!this.changeCurrentSongIndex(0)) {
            throw new Error("The provided playlist has no songs.");
        }
        this.#playlistChangeListeners.forEach(playlistChangeListener => {
            playlistChangeListener(old, this.getPlaylist());
        });

    }

    /**
     * The current playlist of songs that this player is in charge of.
     * 
     * @returns {SongPlaylist} The song playlist this player is currently using.
     */
    get playlist() {
        return this.#playlist;
    }

    /**
     * 
     * @returns {boolean} true if and only if successful in going to the next song.
     */
    next() {
        return this.changeCurrentSongIndex(this.currentSongIndex + 1);
    }

    /**
     * attempts to go to the previous song.
     * 
     * @returns {boolean} true if and only if successful in going to the previous song.
     */
    previous() {
        return this.changeCurrentSongIndex(this.currentSongIndex - 1);
    }

    /**
     * 
     * @param {number} index the index of the song to jump to.
     * @returns {boolean} true if and only if successful jumping to the given index.
     */
    changeCurrentSongIndex(index) {
        console.log("Changing current song to " + index);
        if (index >= this.#playlist.total()) return false;
        if (index < 0) return false;
        Object.keys(this.#allAudioEventListeners).forEach(key => {
            const listeners = this.#allAudioEventListeners[key];
            listeners.forEach(listener => {
                this.currentSong.fetchAudio().removeEventListener(key, listener);
            });
        });
        this.currentSong.unloadAudio();
        const old = this.currentSong;
        this.#current = index;
        this.#currentSongChangeListeners.forEach(currentChangeListener => {
            currentChangeListener(old, this.currentSong);
        });
        Object.keys(this.#allAudioEventListeners).forEach(key => {
            const listeners = this.#allAudioEventListeners[key];
            listeners.forEach(listener => {
                this.currentSong.fetchAudio().addEventListener(key, listener);
            });
        });
        if (this.#autoplay) {
            this.playCurrent();
        }
        return true;
    }

    /**
     * 
     * @returns {number} The current song's index in the playlist.
     */
    get currentSongIndex() {
        return this.#current;
    }

    playCurrent() {
        console.log("Attempting to play...");
        this.currentSong.fetchAudio((audio) => {
            audio.volume = this.volume;
            audio.play();
            console.log("playing...");
        });
    }

    /**
     * Pauses the current playing song (if there is one playing).
     */
    pauseCurrent() {
        console.log("Pausing.");
        this.currentSong.fetchAudio().pause();
    }

    /**
     * Toggles whether or not the current song is playing.
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
        this.currentSong.fetchAudio().volume = this.#volume;
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
        if (position > this.currentSong.fetchAudio().duration || position < 0) return false;
        this.currentSong.fetchAudio(audio => {
            audio.currentTime = position;
        });
        return true;
    }

    /**
     * 
     * @returns {number} How many seconds into the audio track has been played in seconds.
     */
    get currentPosition() {
        return this.currentSong.fetchAudio().currentTime;
    }

    /**
     * 
     * @returns {number} The total length of the song, or NaN if this information has not loaded yet.
     */
    get currentDuration() {
        return this.currentSong.fetchAudio().duration;
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
            console.log("Generated play button has been pressed.");
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
     * @returns {PlayListSong} The current playlist being used.
     */
    get currentSong() {
        return this.#playlist.songAtIndex(this.#current);
    }

    /**
     * @typedef {Function} changeListener
     * @param {*} old the previous value.
     * @param {*} current the the current (new) value.
     */

    /**
     * 
     * @param {changeListener} listener the listener to receive the updates.
     * @returns {boolean} true if and only if successfully added the listener.
     */
    addCurrentSongChangeListener(listener) {
        if (this.#currentSongChangeListeners.includes(listener)) return false;
        this.#currentSongChangeListeners.push(listener);
        return true;
    }

    /**
     * 
     * @param {changeListener} listener the song change listener to remove.
     * @returns {boolean} true if and only if the song change listener given was successfully removed.
     */
    removeCurrentSongChangeListener(listener) {
        const removeIndex = this.#currentSongChangeListeners.indexOf(listener);
        if (removeIndex < 0) return false;

        this.#currentSongChangeListeners.splice(removeIndex, 1);
        return true;
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
     * @param {EventListener|EventListenerObject} eventListener the event listener.
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
        this.currentSong.fetchAudio().addEventListener(type, eventListener);
        return true;
    }

    /**
     * 
     * @param {string} type the type of the listener on the {@link HTMLAudioElement}.  
     * @param {EventListener|EventListenerObject} eventListener the event listener. 
     * @returns {boolean} true if and only if the event listener was successfully added.
     */
    removeEventListenerFromCurrentAudio(type, eventListener) {
        let typeListeners = this.#allAudioEventListeners[type];
        if (!typeListeners) return false;
        const removeIndex = typeListeners.indexOf(eventListener);
        if (removeIndex < 0) return false;
        typeListeners.splice(removeIndex, 1);
        this.currentSong.fetchAudio().removeEventListener(type, eventListener);
        return true;
    }

    /**
     * @returns {boolean} If the player is playing any songs right now.
     */
    get playing() {
        return this.currentSong.isAudioInstantiated() && !this.currentSong.fetchAudio().paused;
    }
}