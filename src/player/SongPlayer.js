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
    }

    /**
     * 
     * @param {SongPlaylist} playlist the new playlist of songs that this player is in charge of.
     */
    setPlaylist(playlist) {
        this._playlist.unloadAllAudio();
        this._playlist = playlist;
        this._current = 0;
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
        if (this._current >= this._playlist.total() - 1) return false;
        this.getCurrentSong().unloadAudio();
        this._current += 1;
        return true;
    }

    /**
     * attempts to go to the previous song.
     * 
     * @returns {boolean} true if and only if successful in going to the previous song.
     */
    previous() {
        if (this._current <= 0) return false;
        this.getCurrentSong().unloadAudio();
        this._current -= 1;
        return true;
    }

    /**
     * 
     * @param {number} index the index of the song to jump to.
     * @returns {boolean} true if and only if successful jumping to the given index.
     */
    changeCurrent(index) {
        if (index >= this._playlist.total()) return false;
        if (index <= 0) return false;
        this.getCurrentSong().unloadAudio();
        this._current = index;
        return true;
    }

    playCurrent() {
        this.getCurrentSong().getAudio((audio) => {
            // TODO: May need to perform synchronization check to see if this is still the song to be played.
            audio.volume = this._volume;
            audio.play();
        });
    }

    pauseCurrent() {
        this.getCurrentSong().getAudio().pause();
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

    generatePlayElement() {
        // TODO: Generates a play button in html.
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
}