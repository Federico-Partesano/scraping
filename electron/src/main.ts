import path from "path";

import { app, BrowserWindow, ipcMain, dialog } from "electron";
import Store from "electron-store";
import fs from "fs";
import url from "url";
import { getMP3FilesInFolder, parseFileNames } from "./filemp3";
import { setInitialStatesElecttron } from "./functions";
import { IStore, KEYS_STORE } from "./typings";
import ffmpeg from "@ffmpeg-installer/ffmpeg";
import fluentFFmpeg from "fluent-ffmpeg";
import ytdl from "ytdl-core";
import ElectronStore from "electron-store";

fluentFFmpeg.setFfmpegPath(ffmpeg.path);
let store: ElectronStore<IStore> | undefined = undefined
let statusServer = "await";
const setStatusServer = (newStatus: "downloading" | "await") =>
  (statusServer = newStatus);
const youtubesearchapi = require("youtube-search-api");

app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

// const ffmpegInstance = createFFmpeg({ log: true });
// let ffmpegLoadingPromise: undefined | Promise<void> = ffmpegInstance.load();
let win: BrowserWindow | undefined = undefined;

let currentAudioSong: undefined | { source: string; status: string } =
  undefined;

// async function getFFmpeg() {
//   if (ffmpegLoadingPromise) {
//     await ffmpegLoadingPromise;
//     ffmpegLoadingPromise = undefined;
//   }

//   return ffmpegInstance;
// }
// getFFmpeg();


const startDownload = async (
  getFileName: string,
  videoId: string,
  title: string
) =>
  new Promise(async (resolve, eject) => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const video = ytdl(url, { filter: "audioandvideo" });
    let duration = 0;
    let author: string | undefined = undefined
    let channelId: string | undefined = undefined
    video.on("info", (info) => {
      duration = info?.videoDetails?.lengthSeconds ?? 0;
      author = info?.videoDetails?.author;
      channelId = info?.videoDetails?.channelId;
    });

    video.on("progress", (chunkLength, downloaded, total) => {
      const percent = Math.round((downloaded / total) * 100);
      win?.webContents.send("percentualDownload", percent);
    });

    video.pipe(fs.createWriteStream("video.mp4")).on("finish", () => {
      win?.webContents.send("percentualDownload", 100);

      const folder = store!.get("folder");
      setTimeout(async () => {
        const config = JSON.stringify({ id: videoId, duration, author, channelId });

        fluentFFmpeg("video.mp4")
          .toFormat("mp3")
          .output(`${folder}/${title}.mp3`)
          .outputOption("-id3v2_version 3")
          .outputOption(`-metadata TXXX=${config}`)

          .on("end", () => {
            win?.webContents.send("downloadSong", "await");
            
            fs.unlinkSync(`video.mp4`);
            resolve(0);
          })
          .on("error", (err) => {
            console.log("Conversion error:", err);
            eject("error");
          })
          .run();

        setStatusServer("await");
        resolve(0);
      }, 500);
    });
  });

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1280,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      webSecurity: false,

      javascript: true,
    },
  });
  store = new Store<IStore>();
  setInitialStatesElecttron(store);

  // and load the index.html of the app.
  // win.loadFile("index.html");
  // win.loadURL("http://localhost:3000");
  win.loadURL(`file://${path.join(__dirname, "index.html")}`);
  // Open the DevTools.
  // win.webContents.openDevTools({ mode: "detach" });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    // server.close();
    app.quit();
  }
});

ipcMain.on("songs", async (event, term) => {
  try {
    const { items } = await youtubesearchapi.GetListByKeyword(term, false, 20);
    win?.webContents.send("songs", items);

    //     const dir = await dialog.showOpenDialog(win!, {
    // title: "title",
    //       properties: ['openDirectory']
    //   });
  } catch (error) {
    console.error("error", error);
    win?.webContents.send("songs", "error");
  }
});
ipcMain.on("setFolderSongs", async () => {
  try {
    const { filePaths } = await dialog.showOpenDialog(win!, {
      title: "title",
      properties: ["openDirectory"],
    });
    store!.set("folder", filePaths[0]);
    win?.webContents.send("setFolderSongs", filePaths[0]);
  } catch (error) {
    console.error("error", error);
    // win?.webContents.send("setFolderSongs", "error");
  }
});
ipcMain.on("getFolderSongs", () => {
  try {
    win?.webContents.send("getFolderSongs", store!.get("folder"));
  } catch (error) {
    console.error("error", error);
    win?.webContents.send("getFolderSongs", "error");
  }
});

ipcMain.on("downloadSong", async (event, { videoId, title }) => {
  try {
    win?.webContents.send("downloadSong", "downloading");

    await startDownload("", videoId, title);
  } catch (error) {
    console.error("error", error);
    win?.webContents.send("downloadSong", "error");
  }
});
ipcMain.on("getMP3Files", async (event) => {
  try {
    const folder = store!.get("folder") as string;
    const files = getMP3FilesInFolder(folder);
    const formattedFiles = parseFileNames(files, folder);
    win?.webContents.send("getMP3Files", formattedFiles);
  } catch (error) {
    console.error("error", error);
    win?.webContents.send("getMP3Files", "error");
  }
});
ipcMain.on("startAudioMp3", async (event, path) => {
  try {
    const filePath = "path/al/tuo/file.mp3";
    const source = url.pathToFileURL(filePath).href;
    currentAudioSong = { source, status: "listening" };
    win?.webContents.send("startAudioMp3", true);
  } catch (error) {
    console.error("error", error);
    win?.webContents.send("getMP3Files", "error");
  }
});
ipcMain.on("getFavorites", async (event) => {
  try {
    const favoriteSongs = store!.get(KEYS_STORE.FAVORITE_SONGS);
    win?.webContents.send("getFavorites", favoriteSongs);
  } catch (error) {
    console.error("error", error);
    win?.webContents.send("getFavorites", "error");
  }
});
ipcMain.on("addFavorite", async (event, songId) => {
  try {
    const favoriteSongs = store!.get(KEYS_STORE.FAVORITE_SONGS);
    favoriteSongs.push(songId);
    store!.set("favoritesSongs", favoriteSongs);
    win?.webContents.send("addFavorite", songId);
  } catch (error) {
    console.error("error", error);
    win?.webContents.send("addFavorite", "error");
  }
});
ipcMain.on("deleteFavorite", async (event, songId) => {
  try {
    const favoriteSongs = [...store!.get(KEYS_STORE.FAVORITE_SONGS)];
    const findIndexSong = favoriteSongs.findIndex((song) => song === songId);
    if (findIndexSong <= -1) return favoriteSongs;
    const newArray = [
      ...favoriteSongs.slice(0, findIndexSong),
      ...favoriteSongs.slice(findIndexSong + 1),
    ];

    store!.set("favoritesSongs", newArray);
    win?.webContents.send("deleteFavorite", newArray);
  } catch (error) {
    console.error("error", error);
    win?.webContents.send("deleteFavorite", "error");
  }
});
ipcMain.on("removeSong", async (event, { name, id }) => {
  try {
    const folder = store!.get("folder");
    fs.unlinkSync(`${folder}/${name}.mp3`);
    const favoriteSongs = [...store!.get(KEYS_STORE.FAVORITE_SONGS)];
    const findIndexSong = favoriteSongs.findIndex((song) => song === id);
    if (findIndexSong <= -1) return favoriteSongs;
    const newArray = [
      ...favoriteSongs.slice(0, findIndexSong),
      ...favoriteSongs.slice(findIndexSong + 1),
    ];

    store!.set("favoritesSongs", newArray);
    win?.webContents.send("removeSong", name);
  } catch (error) {
    console.error("error", error);
    win?.webContents.send("removeSong", "error");
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
