import { contextBridge, ipcRenderer } from "electron";
import { AllDataListenerCallback, DataStoredListenerCallback } from "./types";

contextBridge.exposeInMainWorld("ipc", {
  requestAllData: () => {
    ipcRenderer.send("request-all-data");
  },
  onAllDataReply: (callback: AllDataListenerCallback) => {
    ipcRenderer.once("all-data-reply", callback);
  },
  onNewDataStored: (callback: DataStoredListenerCallback) => {
    ipcRenderer.on("th-data-stored", callback);
  },
  removeNewDataStoredListener: (callback: DataStoredListenerCallback) => {
    ipcRenderer.off("th-data-stored", callback);
  },
});
