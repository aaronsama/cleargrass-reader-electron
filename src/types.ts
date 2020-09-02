import { IpcRendererEvent } from "electron/main";

export type Reading = {
  temperature: number;
  humidity: number;
}

declare global {
  interface Window {
    ipc: {
      sendNewData: (reading: Reading) => void
    };
  }
}
