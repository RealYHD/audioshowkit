export default function PlaylistSong(url, name, author, playlist) {
    this._displayName = name;
    this._author = author;
    this._url = url;
    this._mediaStream = null;
    this._playlist = playlist;

    this.getAudio = function () {
        if (this.mediaStream) {
            return this.mediaStream;
        }
        this.mediaStream = new Audio(url);
    };
    this.getDisplayName = function () {
        return this._displayName;
    };
    this.getAuthor = function () {
        return this._getAuthor;
    };
    this.getUrl = function () {
        return this._url;
    };
    this.getPlaylist = function () {
        return this._playlist;
    };
}