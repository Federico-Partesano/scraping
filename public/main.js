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
let store = undefined;
electron_1.app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");
let win = undefined;
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
    // and load the index.html of the app.
    // win.loadFile("index.html");
    win.loadURL("http://localhost:3000");
    // win.loadURL(`file://${path.join(__dirname, "index.html")}`);
    // Open the DevTools.
    win.webContents.openDevTools({ mode: "detach" });
}
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
electron_1.ipcMain.on("getFile", (event) => __awaiter(void 0, void 0, void 0, function* () {
    win === null || win === void 0 ? void 0 : win.webContents.send("getFile", store === null || store === void 0 ? void 0 : store.get("file"));
}));
electron_1.ipcMain.on("getDataFile", (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pathFile = store === null || store === void 0 ? void 0 : store.get("file");
        const data = fs_1.default.readFileSync(pathFile);
        win === null || win === void 0 ? void 0 : win.webContents.send("getDataFile", JSON.parse(data.toString()));
    }
    catch (error) {
        win === null || win === void 0 ? void 0 : win.webContents.send("getDataFile", error);
    }
}));
electron_1.ipcMain.on("setFile", (event) => __awaiter(void 0, void 0, void 0, function* () {
    const { filePaths } = yield electron_1.dialog.showOpenDialog(win, {
        title: "title",
        properties: ["openFile"],
    });
    store === null || store === void 0 ? void 0 : store.set("file", filePaths[0]);
    win === null || win === void 0 ? void 0 : win.webContents.send("setFile", filePaths[0]);
}));
electron_1.app.on("activate", () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
