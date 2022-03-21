import PlaylistSong from "./PlaylistSong";

export default function Playlist() {
    this._list = [];

    this.songAtIndex = function (index) {
        return this.list[index];
    };

    this.songsWithName = function (name) {
        return this._list.filter((item) => item.getDisplayName() == name);
    };

    this.add = function (url, name, author) {
        this._list.push(new PlaylistSong(url, name, author, this, this._list.length));
    };

    this.remove = function (index) {
        let removed = this._list.splice(index, 1);
        if (removed.length > 0) {
            return removed[0];
        }
    };

    this.findSongIndex = function (name) {
        return this._list.findIndex((item) => item.getDisplayName() == name);
    };
}