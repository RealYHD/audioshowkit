import SongPlayer from "./SongPlayer.js";
import SongPlaylist from "./SongPlaylist.js";
import VisualizedSongPlayer from "./VisualizedSongPlayer.js";

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
 * Creates a song player that manages the visualizers for individual songs, as well as the listeners for the visualizations.
 * 
 * @see VisualizedSongPlayer for more information about the returned object.
 * @param {SongPlaylist} playlist the playlist this visualized song player will play through.
 * @param {number} [fftSize=1024] the FFT window size.
 * @returns {VisualizedSongPlayer} a song player capable of retrieving the visualizer for the current playing song.
 */
export function createVisualizedSongPlayer(playlist, fftSize = 1024) {
    return new VisualizedSongPlayer(playlist, fftSize);
}