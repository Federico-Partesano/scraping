"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const electron_1 = require("electron");
const electron_store_1 = __importDefault(require("electron-store"));
const fs_1 = __importDefault(require("fs"));
const url_1 = __importDefault(require("url"));
const filemp3_1 = require("./filemp3");
const functions_1 = require("./functions");
const typings_1 = require("./typings");
const ffmpeg_1 = __importDefault(require("@ffmpeg-installer/ffmpeg"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ytdl_core_1 = __importDefault(require("ytdl-core"));
fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_1.default.path);
let store = undefined;
let statusServer = "await";
const setStatusServer = (newStatus) => (statusServer = newStatus);
const youtubesearchapi = require("youtube-search-api");
electron_1.app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");
// const ffmpegInstance = createFFmpeg({ log: true });
// let ffmpegLoadingPromise: undefined | Promise<void> = ffmpegInstance.load();
let win = undefined;
let currentAudioSong = undefined;
// async function getFFmpeg() {
//   if (ffmpegLoadingPromise) {
//     await ffmpegLoadingPromise;
//     ffmpegLoadingPromise = undefined;
//   }
//   return ffmpegInstance;
// }
// getFFmpeg();
const startDownload = (getFileName, videoId, title) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, eject) => __awaiter(void 0, void 0, void 0, function* () {
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        const video = (0, ytdl_core_1.default)(url, { filter: "audioandvideo" });
        let duration = 0;
        let author = undefined;
        let channelId = undefined;
        video.on("info", (info) => {
            var _a, _b, _c, _d;
            duration = (_b = (_a = info === null || info === void 0 ? void 0 : info.videoDetails) === null || _a === void 0 ? void 0 : _a.lengthSeconds) !== null && _b !== void 0 ? _b : 0;
            author = (_c = info === null || info === void 0 ? void 0 : info.videoDetails) === null || _c === void 0 ? void 0 : _c.author;
            channelId = (_d = info === null || info === void 0 ? void 0 : info.videoDetails) === null || _d === void 0 ? void 0 : _d.channelId;
        });
        video.on("progress", (chunkLength, downloaded, total) => {
            const percent = Math.round((downloaded / total) * 100);
            win === null || win === void 0 ? void 0 : win.webContents.send("percentualDownload", percent);
        });
        video.pipe(fs_1.default.createWriteStream("video.mp4")).on("finish", () => {
            win === null || win === void 0 ? void 0 : win.webContents.send("percentualDownload", 100);
            const folder = store.get("folder");
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                const config = JSON.stringify({ id: videoId, duration, author, channelId });
                (0, fluent_ffmpeg_1.default)("video.mp4")
                    .toFormat("mp3")
                    .output(`${folder}/${title}.mp3`)
                    .outputOption("-id3v2_version 3")
                    .outputOption(`-metadata TXXX=${config}`)
                    .on("end", () => {
                    win === null || win === void 0 ? void 0 : win.webContents.send("downloadSong", "await");
                    fs_1.default.unlinkSync(`video.mp4`);
                    resolve(0);
                })
                    .on("error", (err) => {
                    console.log("Conversion error:", err);
                    eject("error");
                })
                    .run();
                setStatusServer("await");
                resolve(0);
            }), 500);
        });
    }));
});
function createWindow() {
    // Create the browser window.
    win = new electron_1.BrowserWindow({
        width: 1280,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path_1.default.join(__dirname, "preload.js"),
            webSecurity: false,
            javascript: true,
        },
    });
    store = new electron_store_1.default();
    (0, functions_1.setInitialStatesElecttron)(store);
    // and load the index.html of the app.
    // win.loadFile("index.html");
    // win.loadURL("http://localhost:3000");
    win.loadURL(`file://${path_1.default.join(__dirname, "index.html")}`);
    // Open the DevTools.
    // win.webContents.openDevTools({ mode: "detach" });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.whenReady().then(createWindow);
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        // server.close();
        electron_1.app.quit();
    }
});
electron_1.ipcMain.on("songs", (event, term) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { items } = yield youtubesearchapi.GetListByKeyword(term, false, 20);
        win === null || win === void 0 ? void 0 : win.webContents.send("songs", items);
        //     const dir = await dialog.showOpenDialog(win!, {
        // title: "title",
        //       properties: ['openDirectory']
        //   });
    }
    catch (error) {
        console.error("error", error);
        win === null || win === void 0 ? void 0 : win.webContents.send("songs", "error");
    }
}));
electron_1.ipcMain.on("setFolderSongs", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filePaths } = yield electron_1.dialog.showOpenDialog(win, {
            title: "title",
            properties: ["openDirectory"],
        });
        store.set("folder", filePaths[0]);
        win === null || win === void 0 ? void 0 : win.webContents.send("setFolderSongs", filePaths[0]);
    }
    catch (error) {
        console.error("error", error);
        // win?.webContents.send("setFolderSongs", "error");
    }
}));
electron_1.ipcMain.on("getFolderSongs", () => {
    try {
        win === null || win === void 0 ? void 0 : win.webContents.send("getFolderSongs", store.get("folder"));
    }
    catch (error) {
        console.error("error", error);
        win === null || win === void 0 ? void 0 : win.webContents.send("getFolderSongs", "error");
    }
});
electron_1.ipcMain.on("downloadSong", (event, { videoId, title }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        win === null || win === void 0 ? void 0 : win.webContents.send("downloadSong", "downloading");
        yield startDownload("", videoId, title);
    }
    catch (error) {
        console.error("error", error);
        win === null || win === void 0 ? void 0 : win.webContents.send("downloadSong", "error");
    }
}));
electron_1.ipcMain.on("getMP3Files", (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const folder = store.get("folder");
        const files = (0, filemp3_1.getMP3FilesInFolder)(folder);
        const formattedFiles = (0, filemp3_1.parseFileNames)(files, folder);
        win === null || win === void 0 ? void 0 : win.webContents.send("getMP3Files", formattedFiles);
    }
    catch (error) {
        console.error("error", error);
        win === null || win === void 0 ? void 0 : win.webContents.send("getMP3Files", "error");
    }
}));
electron_1.ipcMain.on("startAudioMp3", (event, path) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filePath = "path/al/tuo/file.mp3";
        const source = url_1.default.pathToFileURL(filePath).href;
        currentAudioSong = { source, status: "listening" };
        win === null || win === void 0 ? void 0 : win.webContents.send("startAudioMp3", true);
    }
    catch (error) {
        console.error("error", error);
        win === null || win === void 0 ? void 0 : win.webContents.send("getMP3Files", "error");
    }
}));
electron_1.ipcMain.on("getFavorites", (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const favoriteSongs = store.get(typings_1.KEYS_STORE.FAVORITE_SONGS);
        win === null || win === void 0 ? void 0 : win.webContents.send("getFavorites", favoriteSongs);
    }
    catch (error) {
        console.error("error", error);
        win === null || win === void 0 ? void 0 : win.webContents.send("getFavorites", "error");
    }
}));
electron_1.ipcMain.on("addFavorite", (event, songId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const favoriteSongs = store.get(typings_1.KEYS_STORE.FAVORITE_SONGS);
        favoriteSongs.push(songId);
        store.set("favoritesSongs", favoriteSongs);
        win === null || win === void 0 ? void 0 : win.webContents.send("addFavorite", songId);
    }
    catch (error) {
        console.error("error", error);
        win === null || win === void 0 ? void 0 : win.webContents.send("addFavorite", "error");
    }
}));
electron_1.ipcMain.on("deleteFavorite", (event, songId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const favoriteSongs = [...store.get(typings_1.KEYS_STORE.FAVORITE_SONGS)];
        const findIndexSong = favoriteSongs.findIndex((song) => song === songId);
        if (findIndexSong <= -1)
            return favoriteSongs;
        const newArray = [
            ...favoriteSongs.slice(0, findIndexSong),
            ...favoriteSongs.slice(findIndexSong + 1),
        ];
        store.set("favoritesSongs", newArray);
        win === null || win === void 0 ? void 0 : win.webContents.send("deleteFavorite", newArray);
    }
    catch (error) {
        console.error("error", error);
        win === null || win === void 0 ? void 0 : win.webContents.send("deleteFavorite", "error");
    }
}));
electron_1.ipcMain.on("removeSong", (event, { name, id }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const folder = store.get("folder");
        fs_1.default.unlinkSync(`${folder}/${name}.mp3`);
        const favoriteSongs = [...store.get(typings_1.KEYS_STORE.FAVORITE_SONGS)];
        const findIndexSong = favoriteSongs.findIndex((song) => song === id);
        if (findIndexSong <= -1)
            return favoriteSongs;
        const newArray = [
            ...favoriteSongs.slice(0, findIndexSong),
            ...favoriteSongs.slice(findIndexSong + 1),
        ];
        store.set("favoritesSongs", newArray);
        win === null || win === void 0 ? void 0 : win.webContents.send("removeSong", name);
    }
    catch (error) {
        console.error("error", error);
        win === null || win === void 0 ? void 0 : win.webContents.send("removeSong", "error");
    }
}));
electron_1.app.on("activate", () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
