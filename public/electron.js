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
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
const electron_store_1 = __importDefault(require("electron-store"));
const youtube_dl_exec_1 = __importDefault(require("youtube-dl-exec"));
const fs_1 = __importDefault(require("fs"));
const url_1 = __importDefault(require("url"));
const filemp3_1 = require("./filemp3");
const functions_1 = require("./functions");
const typings_1 = require("./typings");
const ffmpeg_1 = __importDefault(require("@ffmpeg-installer/ffmpeg"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_1.default.path);
const store = new electron_store_1.default();
(0, functions_1.setInitialStatesElecttron)(store);
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
const checkFileName = (name, filesize) => __awaiter(void 0, void 0, void 0, function* () {
    let fileCreated = false;
    let percentual = 0;
    const interval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        if (yield fs_1.default.existsSync(`${name}.part`)) {
            fileCreated = true;
            const stats = fs_1.default.statSync(`${name}.part`);
            let newPercentual = Math.floor((stats.size / filesize) * 100);
            if (percentual !== newPercentual) {
                win === null || win === void 0 ? void 0 : win.webContents.send("percentualDownload", newPercentual);
                percentual = newPercentual;
            }
        }
        else {
            if (fileCreated) {
                win === null || win === void 0 ? void 0 : win.webContents.send("percentualDownload", 100);
                clearInterval(interval);
            }
        }
    }), 800);
});
const startDownload = (getFileName, videoId, title) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, eject) => __awaiter(void 0, void 0, void 0, function* () {
        const format = (yield (0, youtube_dl_exec_1.default)(`https://www.youtube.com/watch?v=${videoId}`, { getFormat: true, format: "mp4" }));
        const info = yield (0, youtube_dl_exec_1.default)(`https://www.youtube.com/watch?v=${videoId}`, {
            dumpSingleJson: true,
            format: "mp4",
        });
        const size = info.formats.find(({ format: formatVideo }) => formatVideo === format);
        const sizeFile = (size === null || size === void 0 ? void 0 : size.filesize) || (size === null || size === void 0 ? void 0 : size.filesize_approx);
        const folder = store.get("folder");
        size && checkFileName(getFileName, sizeFile);
        yield (0, youtube_dl_exec_1.default)(`https://www.youtube.com/watch?v=${videoId}`, {
            format: "mp4",
        });
        if (!fs_1.default.existsSync(getFileName))
            eject(undefined);
        fs_1.default.renameSync(getFileName, `video.mp4`);
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            const fileName = getFileName.split(".");
            fileName.pop();
            fileName.join("");
            const config = JSON.stringify({ id: videoId, duration: info.duration });
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
                eject("rrror");
            })
                .run();
            // const ffmpeg = await getFFmpeg();
            // await ffmpeg.FS("writeFile", `video.mp4`, await fetchFile(`video.mp4`));
            // await ffmpeg.run("-i", `video.mp4`, `${getFileName}.mp3`);
            // // const fileName = getFileName.split(".");
            // fileName.pop();
            // fileName.join("");
            // await fs.promises.writeFile(
            //   `${folder}/${fileName}.mp3`,
            //   ffmpeg.FS("readFile", `${getFileName}.mp3`)
            // );
            // setTimeout(() => {
            //   win?.webContents.send("downloadSong", "await");
            //   // const mp3Data = fs.readFileSync(`${folder}/${fileName}.mp3`);
            //   fs.unlinkSync(`video.mp4`);
            //   // fs.renameSync(`${folder}/${fileName}.mp3`, `${folder}/${title}.mp3`);
            // }, 500);
            setStatusServer("await");
            resolve(0);
        }), 500);
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
        },
    });
    // and load the index.html of the app.
    // win.loadFile("index.html");
    win.loadURL(electron_is_dev_1.default
        ? "http://localhost:3000"
        : `file://${path_1.default.join(__dirname, "../build/index.html")}`);
    // Open the DevTools.
    if (electron_is_dev_1.default) {
        win.webContents.openDevTools({ mode: "detach" });
    }
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
        const getFileName = (yield (0, youtube_dl_exec_1.default)(`https://www.youtube.com/watch?v=${videoId}`, { getFilename: true, format: "mp4" }));
        yield startDownload(getFileName, videoId, title);
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
        console.log("🚀 ~ file: electron.ts:277 ~ ipcMain.on ~ findIndexSong:", findIndexSong);
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
electron_1.ipcMain.on("removeSong", (event, songName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const folder = store.get("folder");
        fs_1.default.unlinkSync(`${folder}/${songName}.mp3`);
        win === null || win === void 0 ? void 0 : win.webContents.send("removeSong", songName);
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
