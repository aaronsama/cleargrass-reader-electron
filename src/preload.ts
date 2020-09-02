import { IpcRendererEvent } from "electron/main";
import { contextBridge, ipcRenderer } from "electron";
import { Reading } from "./types";

contextBridge.exposeInMainWorld("ipc", {
  sendNewData: (reading: Reading) => {
    ipcRenderer.send("th-data", reading);
  }
})
