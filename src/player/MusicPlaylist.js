import Music from "./Music.js";




/**
 * A playlist that holds a multitude of musics in the form of {@link Music}.
 */
export default class MusicPlaylist {
    #list = [];
    #name;
    #current = 0;
    #positionChangeListeners = [];
    #lengthChangeListeners = [];


    /**
     * @callback MusicPlaylist~positionChangeListener
     * @param {number} old the previous position.
     * @param {number} current the the current (new) position.
     */

    /**
     * @callback MusicPlaylist~lengthChangeListener
     * @param {number} changed The index of the music that has changed.
     * @param {boolean} added True if and only if the change was caused by adding music.
     * @param {Music} music The music that was added or removed.
     */

    /**
     * Instantiates a playlist for musics.
     * 
     * @param {string} name The name of the playlist.
     */
    constructor(name) {
        this.#name = name;
    }

    /**
     * @returns {string} The name of the playlist. 
     */
    get name() {
        return this.#name;
    }

    /**
     * 
     * @param {number} index the index of the music to retrieve.
     * @returns {Music} the music at the given index.
     */
    musicAtIndex(index) {
        if (index >= this.total) {
            return null;
        }
        return this.#list[index];
    }

    /**
     * Automatically creates and adds a {@link Music} to this playlist.
     * 
     * @param {string} url where the audio data can be found.
     * @param {string} name the name of the music.
     * @param {string} author the author(s) of the music.
     */
    add(url, name, author) {
        const music = new Music(url, name, author, this);
        this.#list.push(music);
        this.#onAdd(this.total - 1, music);
    }

    /**
     * Adds an existing {@link Music} object to this playlist. Alternatively, use {@link MusicPlaylist#add} to automatically instantiate a new one.
     * 
     * @param {Music} music The existing music to add.
     */
    addExisting(music) {
        this.#list.push(music);
        this.#onAdd(this.total - 1, music);
    }

    /**
     * Calls all playlist length change listeners.
     * 
     * @param {number} index The index at which the new music was added.
     * @param {Music} music The music that was added.
     */
    #onAdd(index, music) {
        this.#lengthChangeListeners.forEach(listener => {
            listener(index, true, music);
        });
    }

    /**
     * Removes a {@link Music} from this playlist.
     * 
     * @param {number} index the index of the music to be removed.
     * @returns {Music} the music that was removed, or null if the index of was invalid.
     */
    remove(index) {
        if (index >= this.#list.length) {
            return null;
        }
        let removed = this.#list.splice(index, 1)[0];
        this.#lengthChangeListeners.forEach(listener => {
            listener(index, false, removed);
        });
        if (removed.length > 0) {
            return removed[0];
        }
    }

    /**
     * Attempts to find a {@link Music} given a name. Returns the first one found.
     * 
     * @param {string} name the name of the music to be found.
     * @returns {number} the index of the music found, or -1 if it was not found.
     */
    findMusicIndex(name) {
        return this.#list.findIndex((item) => item.getDisplayName() == name);
    }

    /**
     * The number of {@link Music} in this playlist.
     * 
     * @returns {number} total number of musics in this playlist.
     */
    get total() {
        return this.#list.length;
    }

    /**
     * @returns {number} The current position in the playlist.
     */
    get currentPosition() {
        return this.#current;
    }

    /**
     * The current position in the playlist.
     */
    set currentPosition(position) {
        if (typeof position !== "number") throw new Error("Given position is invalid.");
        if (position >= this.#list.length || position < 0) return;
        const old = this.#current;
        this.#current = position;
        this.#positionChangeListeners.forEach(positionChangeListener => {
            positionChangeListener(old, position);
        });
    }

    /**
     * @returns {Music} The current music in the playlist being used.
     */
    get currentMusic() {
        return this.musicAtIndex(this.currentPosition);
    }

    /**
     * 
     * @param {MusicPlaylist~positionChangeListener} listener the listener to receive the updates.
     * @returns {boolean} true if and only if successfully added the listener.
     */
    addPositionChangeListener(listener) {
        if (this.#positionChangeListeners.includes(listener)) return false;
        this.#positionChangeListeners.push(listener);
        return true;
    }

    /**
     * 
     * @param {MusicPlaylist~positionChangeListener} listener the music change listener to remove.
     * @returns {boolean} true if and only if the music change listener given was successfully removed.
     */
    removePositionChangeListener(listener) {
        const removeIndex = this.#positionChangeListeners.indexOf(listener);
        if (removeIndex < 0) return false;

        this.#positionChangeListeners.splice(removeIndex, 1);
        return true;
    }

    /**
     * Adds a listener for whether music was added or removed to the playlist.
     * 
     * @param {MusicPlaylist~lengthChangeListener} listener The listener to be added.
     * @returns {boolean} True if and only if the listener was successfully added.
     */
    addLengthChangeListener(listener) {
        if (this.#lengthChangeListeners.includes(listener)) return false;
        this.#lengthChangeListeners.push(listener);
        return true;
    }

    /**
     * Removes a listener for whether music is added or removed to the playlist.
     * 
     * @param {MusicPlaylist~lengthChangeListener} listener The listener to be removed.
     * @returns {boolean} True if and only if the provided listener was successfully removed.
     */
    removeLengthChangeListener(listener) {
        const removeIndex = this.#lengthChangeListeners.indexOf(listener);
        if (removeIndex < 0) return false;
        this.#lengthChangeListeners.splice(removeIndex, 1);
        return true;
    }

    generatePlaylistElement() {
        const element = document.createElement("table");
        element.createTHead().textContent = "Playlist";
        const headers = element.insertRow();
        const musicHeader = document.createElement("th");
        musicHeader.textContent = "Music";
        headers.appendChild(musicHeader);
        const authorHeader = document.createElement("th");
        authorHeader.textContent = "Author";
        headers.appendChild(authorHeader);

        const insertMusic = (music, musicPos = undefined) => {
            if (musicPos) musicPos++;
            const row = element.insertRow(musicPos);
            row.insertCell().textContent = music.displayName;
            row.insertCell().textContent = music.author;
        };
        for (const music of this) {
            insertMusic(music);
        }

        this.addLengthChangeListener((changed, added, music) => {
            if (added) {
                insertMusic(music, changed);
            } else {
                element.deleteRow(changed);
            }
        });

        element.rows[this.currentPosition + 1].classList.add("active");

        this.addPositionChangeListener((old, current) => {
            element.rows[old + 1].classList.remove("active");
            element.rows[current + 1].classList.add("active");
        });
        return element;
    }

    [Symbol.iterator]() {
        let index = -1;
        const data = this.#list;
        return {
            next: () => ({ value: data[++index], done: index >= data.length }) // Brackets so not read as a body of anonymous function.
        };
    }
}