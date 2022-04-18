import "../styles/songplayer.css";

/**
 * A player that keeps track of global properties for playback as well as traversing a playlist. Additionally keeps track of song audio data and attempts to reduce memory usage when possible.
 */
export default class SongPlayer {
    #playlist;
    #current = 0;
    #volume = 1;
    #playing = true;
    #playlistChangeListeners = [];
    #currentSongChangeListeners = [];
    #volumeChangeListeners = [];
    #playingChangeListeners = [];
    #allAudioEventListeners = {};

    /**
     * 
     * @param {SongPlaylist} playlist the playlist of songs that this player is in charge of.
     */
    constructor(playlist) {
        this.#playlist = playlist;
    }

    /**
     * The new playlist of songs that this player is in charge of.
     */
    set playlist(playlist) {
        this.#playlist.unloadAllAudio();
        const old = this.#playlist;
        this.#playlist = playlist;
        this.#current = 0;
        this.#playlistChangeListeners.forEach(playlistChangeListener => {
            playlistChangeListener(old, this.getPlaylist());
        });
    }

    /**
     * 
     * The current playlist of songs that this player is in charge of.
     */
    get playlist() {
        return this.#playlist;
    }

    /**
     * 
     * @returns {boolean} true if and only if successful in going to the next song.
     */
    next() {
        return this.changeCurrentSongIndex(this.getCurrentSongIndex() + 1);
    }

    /**
     * attempts to go to the previous song.
     * 
     * @returns {boolean} true if and only if successful in going to the previous song.
     */
    previous() {
        return this.changeCurrentSongIndex(this.getCurrentSongIndex() - 1);
    }

    /**
     * 
     * @param {number} index the index of the song to jump to.
     * @returns {boolean} true if and only if successful jumping to the given index.
     */
    changeCurrentSongIndex(index) {
        if (index >= this.#playlist.total()) return false;
        if (index <= 0) return false;
        Object.keys(this.#allAudioEventListeners).forEach(key => {
            const listeners = this.#allAudioEventListeners[key];
            listeners.forEach(listener => {
                this.getCurrentSong().getAudio().removeEventListener(key, listener);
            });
        });
        this.getCurrentSong().unloadAudio();
        const old = this.getCurrentSong();
        this.#current = index;
        this.#currentSongChangeListeners.forEach(currentChangeListener => {
            currentChangeListener(old, this.getCurrentSong());
        });
        Object.keys(this.#allAudioEventListeners).forEach(key => {
            const listeners = this.#allAudioEventListeners[key];
            listeners.forEach(listener => {
                this.getCurrentSong().getAudio().addEventListener(key, listener);
            });
        });
        if (this.#playing) {
            this.playCurrent();
        }
        return true;
    }

    /**
     * 
     * The current song's index in the playlist.
     */
    get currentSongIndex() {
        return this.#current;
    }

    playCurrent() {
        this.getCurrentSong().getAudio((audio) => {
            audio.volume = this.#volume;
            audio.play();
        });
        this.#playing = true;
    }

    pauseCurrent() {
        this.getCurrentSong().getAudio().pause();
        this.#playing = true;
    }

    /**
     * Toggles whether or not the current song is playing.
     */
    togglePlay() {
        if (this.#playing) {
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
        this.getCurrentSong().getAudio().volume = this.#volume;
    }

    /**
     * 
     * The current volume of the player represented by a number between 0 and 1 inclusive.
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
        if (position > this.getCurrentSong().getAudio().duration || position < 0) return false;
        this.getCurrentSong().getAudio(audio => {
            audio.currentTime = position;
        });
        return true;
    }

    /**
     * 
     * How many seconds into the audio track has been played in seconds.
     */
    get currentPosition() {
        return this.getCurrentSong().getAudio().currentTime;
    }

    /**
     * 
     * The total length of the song, or NaN if this information has not loaded yet.
     */
    get currentDuration() {
        return this.getCurrentSong().getAudio().duration;
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
        if (!this.#playing) playButton.classList.add("paused");

        playButton.addEventListener("click", () => {
            this.togglePlay();
        });

        this.addPlayChangeListener((old, current) => {
            if (current) {
                playButton.classList.remove("paused");
            } else {
                playButton.classList.add("paused");
            }
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

    get currentSong() {
        return this.#playlist.songAtIndex(this.#current);
    }

    /**
     * @callback changeListener
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
     * @param {changeListener} listener the listener that is called when the player's volume is changed.
     * @returns {boolean} true if and only if the listener was successfully added.
     */
    addPlayChangeListener(listener) {
        if (this.#playingChangeListeners.includes(listener)) return false;
        this.#playingChangeListeners.push(listener);
        return true;
    }

    /**
     * 
     * @param {changeListener} listener the play change listener to remove.
     * @returns {boolean} true if and only if a listener was successfully removed from the callback list.
     */
    removePlayChangeListener(listener) {
        const removeIndex = this.#playingChangeListeners.indexOf(listener);
        if (removeIndex < 0) return false;

        this.#playingChangeListeners.splice(removeIndex, 1);
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
        this.getCurrentSong().getAudio().addEventListener(type, eventListener);
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
        this.getCurrentSong().getAudio().removeEventListener(type, eventListener);
        return true;
    }
}