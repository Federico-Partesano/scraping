"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFileNames = exports.getMP3FilesInFolder = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const url_1 = __importDefault(require("url"));
const node_id3_1 = __importDefault(require("node-id3"));
const audioMetadata = require("audio-metadata");
const getMP3FilesInFolder = (folderPath) => {
    const mp3Files = [];
    const files = fs_1.default.readdirSync(folderPath);
    for (const file of files) {
        const filePath = path_1.default.join(folderPath, file);
        const fileStats = fs_1.default.statSync(filePath);
        if (fileStats.isFile() && path_1.default.extname(filePath) === ".mp3") {
            mp3Files.push(file);
        }
    }
    return mp3Files;
};
exports.getMP3FilesInFolder = getMP3FilesInFolder;
const parseFileNames = (fileNames, folder) => {
    var _a;
    const parsedFileNames = [];
    for (const fileName of fileNames) {
        const name = fileName
            .replace(/\.[^/.]+$/, "")
            .trim();
        const pathFile = url_1.default.pathToFileURL(path_1.default.join(folder, fileName)).href;
        const tags = node_id3_1.default.read(path_1.default.join(folder, fileName));
        let parsedTags = undefined;
        try {
            const findConfig = (_a = tags.userDefinedText) === null || _a === void 0 ? void 0 : _a.find(({ description }) => description === "TXXX");
            if (findConfig === null || findConfig === void 0 ? void 0 : findConfig.value)
                parsedTags = JSON.parse(findConfig.value);
        }
        catch (error) { }
        parsedFileNames.push({ name, path: pathFile, tags: parsedTags });
    }
    return parsedFileNames;
};
exports.parseFileNames = parseFileNames;
