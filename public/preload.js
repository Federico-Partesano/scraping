"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
electron_1.contextBridge.exposeInMainWorld("api", {
    send: (channel, data) => {
        // whitelist channels
        let validChannels = [
            "toMain",
            "songs",
            "getFolderSongs",
            "setFolderSongs",
            "downloadSong",
            "getMP3Files",
            "startAudioMp3",
            "percentualDownload",
            "getFavorites",
            "addFavorite",
            "deleteFavorite",
            "removeSong",
        ];
        if (validChannels.includes(channel)) {
            electron_1.ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, func) => {
        let validChannels = [
            "fromMain",
            "songs",
            "getFolderSongs",
            "setFolderSongs",
            "downloadSong",
            "getMP3Files",
            "startAudioMp3",
            "percentualDownload",
            "getFavorites",
            "addFavorite",
            "deleteFavorite",
            "removeSong",
        ];
        if (validChannels.includes(channel)) {
            // Deliberately strip event as it includes `sender`
            electron_1.ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    },
});
