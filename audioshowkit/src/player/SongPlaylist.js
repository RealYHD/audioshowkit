import PlaylistSong from "./PlaylistSong.js";

/**
 * A playlist that holds a multitude of songs in the form of {@see PlaylistSong}.
 */
export default class SongPlaylist {

    /**
     * Instantiates a playlist for songs.
     * 
     * @param {string} name The name of the playlist.
     */
    constructor(name) {
        this._list = [];
        this._name = name;
        this._current = 0;
    }

    /**
     * 
     * @returns {string} the name of the string.
     */
    getName() {
        return this._name;
    }

    /**
     * 
     * @param {number} index the index of the song to retrieve.
     * @returns {PlaylistSong} the song at the given index.
     */
    songAtIndex(index) {
        if (index >= this._list.length) {
            return null;
        }
        return this.list[index];
    }

    /**
     * Automatically creates and adds a {@see PlaylistSong} to this playlist.
     * 
     * @param {string} url where the audio data can be found.
     * @param {string} name the name of the song.
     * @param {string} author the author(s) of the song.
     */
    add(url, name, author) {
        this._list.push(new PlaylistSong(url, name, author, this));
    }

    /**
     * Removes a {@see playlistSong} from this playlist.
     * 
     * @param {number} index the index of the song to be removed.
     * @returns {PlaylistSong} the song that was removed, or null if the index of was invalid.
     */
    remove(index) {
        if (index >= this._list.length) {
            return null;
        }
        let removed = this._list.splice(index, 1)[0];
        if (removed.length > 0) {
            return removed[0];
        }
    }

    /**
     * Attempts to find a {@link PlaylistSong} given a name.
     * 
     * @param {string} name the name of the song to be found.
     * @returns {number} the index of the song found, or -1 if it was not found.
     */
    findSongIndex(name) {
        return this._list.findIndex((item) => item.getDisplayName() == name);
    }

    /**
     * 
     * @returns {number} total number of songs in this playlist.
     */
    total() {
        return this._list.length;
    }

    /**
     * Unloads the audio data of all songs in this playlist.
     */
    unloadAllAudio() {
        this._list.forEach(playlistSong => {
            playlistSong.unloadAudio();
        });
    }
}