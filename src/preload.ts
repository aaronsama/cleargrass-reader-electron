import { IpcRendererEvent } from "electron/main";
import { contextBridge, ipcRenderer } from "electron";
// import { PeripheralData } from "./types";

console.log('preload!');

contextBridge.exposeInMainWorld("ipc", {
  onDiscoverDevices: (callback: (event: IpcRendererEvent) => void) => {
    ipcRenderer.on("discover-devices", callback);
  }
})

// contextBridge.exposeInMainWorld("ipc", {
//   onNewDeviceDiscovered: (
//     callback: (event: IpcRendererEvent, peripheralData: PeripheralData) => void,
//   ) => {
//     ipcRenderer.on("peripheral-discovered", callback);
//   },
// });
