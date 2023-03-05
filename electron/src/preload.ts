import { contextBridge, ipcRenderer } from "electron";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  send: (channel: any, data: any) => {
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
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel: any, func: any) => {
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
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});
