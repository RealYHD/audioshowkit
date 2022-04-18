console.log("Beginning showcase..");

const ask = window.audioshowkit;
const playlist = ask.player.createSongPlaylist("Demo playlist");
playlist.add("/audio/moments.mp3", "moments", "Lost Identities x Robbie Rosen");
playlist.add("/audio/XXI.mp3", "XXI", "QR");
const player = ask.player.createSongPlayer(playlist);
const playerElem = document.getElementById("player-showcase");
playerElem.appendChild(player.generatePlayElement());
playerElem.appendChild(player.generateNextElement());
playerElem.appendChild(player.generatePreviousElement());
