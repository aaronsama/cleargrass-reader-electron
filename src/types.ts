import { IpcRendererEvent } from "electron/main";

export type Reading = {
  temperature: number;
  humidity: number;
};

export type StoredReading = Reading & { timestamp: Date };

export type DataListenerCallback = (
  event: IpcRendererEvent,
  reading: Reading,
) => void;

export type AllDataListenerCallback = (
  event: IpcRendererEvent,
  data: StoredReading[],
) => void;

export type DataStoredListenerCallback = (
  event: IpcRendererEvent,
  storedReading: StoredReading,
) => void;

declare global {
  interface Window {
    ipc: {
      requestAllData: () => void;
      onAllDataReply: (callback: AllDataListenerCallback) => void;
      sendNewData: (reading: Reading) => void;
      onNewData: (callback: DataListenerCallback) => void;
      onNewDataStored: (callback: DataStoredListenerCallback) => void;
      removeNewDataStoredListener: (
        callback: DataStoredListenerCallback,
      ) => void;
    };
  }
}
