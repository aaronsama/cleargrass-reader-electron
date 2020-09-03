import { BrowserWindow } from "electron";

declare const LIVE_GRAPH_WINDOW_WEBPACK_ENTRY: any;
declare const LIVE_GRAPH_WINDOW_PRELOAD_WEBPACK_ENTRY: any;

const createLiveGraphWindow = (): BrowserWindow => {
  const liveGraphWindow = new BrowserWindow({
    show: false,
    height: 570,
    width: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      worldSafeExecuteJavaScript: true,
      preload: LIVE_GRAPH_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  liveGraphWindow.loadURL(LIVE_GRAPH_WINDOW_WEBPACK_ENTRY);

  liveGraphWindow.on("ready-to-show", () => {
    liveGraphWindow.show();
    liveGraphWindow.webContents.openDevTools();
  });

  return liveGraphWindow;
};

export default createLiveGraphWindow;
