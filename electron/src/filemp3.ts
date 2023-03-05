import fs from "fs";
import path from "path";
import url from "url";
import NodeID3 from "node-id3";
const audioMetadata = require("audio-metadata");

export const getMP3FilesInFolder = (folderPath: string) => {
  const mp3Files = [];
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const fileStats = fs.statSync(filePath);
    if (fileStats.isFile() && path.extname(filePath) === ".mp3") {
      mp3Files.push(file);
    }
  }
  return mp3Files;
};

export const parseFileNames = (fileNames: string[], folder: string) => {
  const parsedFileNames = [];
  for (const fileName of fileNames) {
    const name = fileName
      .replace(/\.[^/.]+$/, "")
      .trim();
    const pathFile = url.pathToFileURL(path.join(folder, fileName)).href;
    const tags = NodeID3.read(path.join(folder, fileName));
    let parsedTags: Record<string, any> | undefined = undefined;
    try {
      const findConfig = tags.userDefinedText?.find(
        ({ description }) => description === "TXXX"
      );
      if (findConfig?.value) parsedTags = JSON.parse(findConfig.value);
    } catch (error) {}
    parsedFileNames.push({ name, path: pathFile, tags: parsedTags });
  }
  return parsedFileNames;
};
