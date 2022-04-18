import SongPlayer from "./SongPlayer.js";
import SongPlaylist from "./SongPlaylist.js";
import VisualizedSongPlayer from "./VisualizedSongPlayer.js";
import PlayListSong from "./PlaylistSong.js";

/**
 * Instantiates a song player with a given playlist.
 * 
 * @see SongPlayer for more information about the returned object.
 * @param {SongPlaylist} playlist the playlist this player will play through.
 * @returns {SongPlayer} the instantiated song player.
 */
export function createSongPlayer(playlist) {
    return new SongPlayer(playlist);
}

/**
 * Instantiates a song playlist.
 * 
 * @see SongPlaylist for more information about the returned object.
 * @param {string} name the name of the playlist.
 * @returns {SongPlaylist} the instantiated song playlist.
 */
export function createSongPlaylist(name) {
    return new SongPlaylist(name);
}

/**
 * Instantiates a song player that manages the visualizers for individual songs, as well as the listeners for the visualizations.
 * 
 * @see VisualizedSongPlayer for more information about the returned object.
 * @param {SongPlaylist} playlist the playlist this visualized song player will play through.
 * @param {number} [fftSize=1024] the FFT window size.
 * @returns {VisualizedSongPlayer} a song player capable of retrieving the visualizer for the current playing song.
 */
export function createVisualizedSongPlayer(playlist, fftSize = 1024) {
    return new VisualizedSongPlayer(playlist, fftSize);
}

/**
 * Instantiates a playlist song.
 * 
 * @see PlaylistSong for more information about the returned object.
 * @param {string} url The url at which the audio for the song can be retrieved.
 * @param {string} name The name of the song.
 * @param {string} author The name of the author(s).
 * @returns {PlayListSong} The playlist song that is instantiated.
 */
export function createPlaylistSong(url, name, author) {
    return new PlayListSong(url, name, author);
}