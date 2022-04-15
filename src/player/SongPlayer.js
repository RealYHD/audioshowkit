import SongPlaylist from "./SongPlaylist";

/**
 * A player to play songs.
 */
export default class SongPlayer {

    /**
     * 
     * @param {SongPlaylist} playlist the playlist of songs that this player is in charge of.
     */
    constructor(playlist) {
        this._playlist = playlist;
        this._current = 0;
        this._volume = 1;
        this._playing = true;

        this._playlistChangeListeners = [];
        this._currentSongChangeListeners = [];
        this._volumeChangeListeners = [];
        this._playingChangeListener = [];

        this._allAudioEventListeners = {};
    }

    /**
     * 
     * @param {SongPlaylist} playlist the new playlist of songs that this player is in charge of.
     */
    setPlaylist(playlist) {
        this._playlist.unloadAllAudio();
        const old = this._playlist;
        this._playlist = playlist;
        this._current = 0;
        this._playlistChangeListeners.forEach(playlistChangeListener => {
            playlistChangeListener(old, this.getPlaylist());
        });
    }

    /**
     * 
     * @returns {SongPlaylist} the current playlist of songs that this player is in charge of.
     */
    getPlaylist() {
        return this._playlist;
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
        if (index >= this._playlist.total()) return false;
        if (index <= 0) return false;
        Object.keys(this._allAudioEventListeners).forEach(key => {
            const listeners = this._allAudioEventListeners[key];
            listeners.forEach(listener => {
                this.getCurrentSong().getAudio().removeEventListener(key, listener);
            });
        });
        this.getCurrentSong().unloadAudio();
        const old = this.getCurrentSong();
        this._current = index;
        this._currentSongChangeListeners.forEach(currentChangeListener => {
            currentChangeListener(old, this.getCurrentSong());
        });
        Object.keys(this._allAudioEventListeners).forEach(key => {
            const listeners = this._allAudioEventListeners[key];
            listeners.forEach(listener => {
                this.getCurrentSong().getAudio().addEventListener(key, listener);
            });
        });
        if (this._playing) {
            this.playCurrent();
        }
        return true;
    }

    /**
     * 
     * @returns {number} the current song's index in the playlist.
     */
    getCurrentSongIndex() {
        return this._current;
    }

    playCurrent() {
        this.getCurrentSong().getAudio((audio) => {
            // TODO: May need to perform synchronization check to see if this is still the song to be played.
            audio.volume = this._volume;
            audio.play();
        });
        this._playing = true;
    }

    pauseCurrent() {
        this.getCurrentSong().getAudio().pause();
        this._playing = true;
    }

    /**
     * 
     * @param {number} volume a number between 0 to 1 inclusive representing the volume of the player.
     * @returns {boolean} true if and only if the volume was successfully set.
     */
    setVolume(volume) {
        if (volume > 1) return false;
        if (volume < 0) return false;
        this._volume = volume;
        this.getCurrentSong().getAudio().volume = this._volume;
        return true;
    }

    /**
     * 
     * @returns {number} the current volume of the player represented by a number between 0 and 1 inclusive.
     */
    getVolume() {
        return this._volume;
    }

    seek(position) {
        if (position > this.getCurrentSong().getAudio().duration || position < 0) return;
        this.getCurrentSong().getAudio(audio => {
            // TODO: May need to perform synchronization check to see if this is still the song to be played.
            audio.currentTime = position;
        });
    }

    getCurrentPosition() {
        return this.getCurrentSong().getAudio().currentTime;
    }

    getCurrentDuration() {
        return this.getCurrentSong().getAudio().duration;
    }

    generatePlayElement(size = 64) {
        const playButton = document.createElement("button");
        playButton.classList.add("player-ctrl");
        playButton.classList.add("play");
        playButton.style.width = size + "px";
        playButton.style.height = size + "px";
        playButton.style.borderLeftWidth = size + "px";
        playButton.style.borderTopWidth = Math.floor(size / 2) + "px";
        playButton.style.borderBottomWidth = Math.ceil(size / 2) + "px";
        // TODO: Finish this play button with event listeners.
    }

    generateNextElement() {
        // TODO: generate a next button in html.
    }

    generatePreviousElement() {
        // TODO: generate a previous button in html.
    }

    generateSeeker() {
        // TODO: generate a seeker in html.
    }

    generateVolumeSlider() {
        // TODO: generate a volume slider in html.
    }

    getCurrentSong() {
        return this._playlist.songAtIndex(this._current);
    }

    /**
     * @callback changeListener
     * @param {any} old the previous value.
     * @param {any} current the the current (new) value.
     */

    /**
     * 
     * @param {changeListener} listener the listener to receive the updates.
     * @returns {boolean} true if and only if successfully added the listener.
     */
    addCurrentSongChangeListener(listener) {
        if (this._currentSongChangeListeners.includes(listener)) return false;
        this._currentChangeListener.push(listener);
        return true;
    }

    /**
     * 
     * @param {changeListener} listener the song change listener to remove.
     * @returns {boolean} true if and only if the song change listener given was successfully removed.
     */
    removeCurrentSongChangeListener(listener) {
        const removeIndex = this._currentSongChangeListeners.indexOf(listener);
        if (removeIndex < 0) return false;

        this._currentSongChangeListeners.splice(removeIndex, 1);
        return true;
    }

    /**
     * 
     * @param {changeListener} listener the playlist change listener to add to the callback list.
     * @returns {boolean} true if and only if the given listener was successfully registered.
     */
    addPlaylistChangeListener(listener) {
        if (this._playlistChangeListeners.includes(listener)) return false;
        this._playlistChangeListeners.push(listener);
        return true;

    }

    /**
     * 
     * @param {changeListener} listener the playlist change listener to remove.
     * @returns {boolean} true if and only if a listener was successfully removed from the callback list.
     */
    removePlaylistChangeListener(listener) {
        const removeIndex = this._playlistChangeListeners.indexOf(listener);
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
        if (this._volumeChangeListeners.includes(listener)) return false;
        this._volumeChangeListeners.push(listener);
        return true;
    }

    /**
     * 
     * @param {changeListener} listener the volume change listener to remove.
     * @returns {boolean} true if and only if a listener was successfully removed from the callback list.
     */
    removeVolumeChangeListener(listener) {
        const removeIndex = this._volumeChangeListeners.indexOf(listener);
        if (removeIndex < 0) return false;

        this._volumeChangeListeners.splice(removeIndex, 1);
        return true;
    }


    /**
     * 
     * @param {changeListener} listener the listener that is called when the player's volume is changed.
     * @returns {boolean} true if and only if the listener was successfully added.
     */
    addPlayChangeListener(listener) {
        if (this._playingChangeListener.includes(listener)) return false;
        this._playingChangeListener.push(listener);
        return true;
    }

    /**
     * 
     * @param {changeListener} listener the play change listener to remove.
     * @returns {boolean} true if and only if a listener was successfully removed from the callback list.
     */
    removePlayChangeListener(listener) {
        const removeIndex = this._playingChangeListener.indexOf(listener);
        if (removeIndex < 0) return false;

        this._playingChangeListener.splice(removeIndex, 1);
        return true;
    }

    /**
     * 
     * @param {string} type the type of the listener on the {@link HTMLAudioElement}.
     * @param {EventListener|EventListenerObject} eventListener the event listener.
     * @returns {boolean} true if and only if successfully registered event listener.
     */
    addEventListenerToCurrentAudio(type, eventListener) {
        let typeListeners = this._allAudioEventListeners[type];
        if (!typeListeners) {
            typeListeners = [];
            this._allAudioEventListeners[type] = typeListeners;
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
        let typeListeners = this._allAudioEventListeners[type];
        if (!typeListeners) return false;
        const removeIndex = typeListeners.indexOf(eventListener);
        if (removeIndex < 0) return false;
        typeListeners.splice(removeIndex, 1);
        this.getCurrentSong().getAudio().removeEventListener(type, eventListener);
        return true;
    }
}