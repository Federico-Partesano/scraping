import path from "path";

import { app, BrowserWindow, dialog, ipcMain } from "electron";
import Store from "electron-store";
import ElectronStore from "electron-store";
import { IStore } from "./typings";
import fs from "fs";
let store: ElectronStore<IStore> | undefined = undefined;

app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

let win: BrowserWindow | undefined = undefined;

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
  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL("http://localhost:3000");

  // win.loadURL(`file://${path.join(__dirname, "index.html")}`);
  // Open the DevTools.
  win.webContents.openDevTools({ mode: "detach" });
}

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

ipcMain.on("getFile", async (event) => {
  win?.webContents.send("getFile", store?.get("file"));
});
ipcMain.on("getDataFile", async (event) => {
  try {
    const pathFile = store?.get("file") as string;
    const data = fs.readFileSync(pathFile);
    win?.webContents.send("getDataFile", JSON.parse(data.toString()));
  } catch (error) {
    win?.webContents.send("getDataFile", error);
  }
});
ipcMain.on("setFile", async (event) => {
  const { filePaths } = await dialog.showOpenDialog(win!, {
    title: "title",
    properties: ["openFile"],
  });
  store?.set("file", filePaths[0]);
  win?.webContents.send("setFile", filePaths[0]);
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
