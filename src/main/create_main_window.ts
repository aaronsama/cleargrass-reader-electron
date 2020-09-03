import { BrowserWindow } from "electron";

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;

const createMainWindow = (): BrowserWindow => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    show: false,
    height: 630,
    width: 600,
    fullscreenable: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      worldSafeExecuteJavaScript: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  });

  mainWindow.webContents.on(
    "select-bluetooth-device",
    (event, deviceList, callback) => {
      event.preventDefault();
      const cleargrassThermometer = deviceList.find(
        (device) => device.deviceName === "Qingping Temp RH M",
      );

      if (cleargrassThermometer) {
        console.log("Found", cleargrassThermometer);
        callback(cleargrassThermometer.deviceId);
      }
    },
  );

  return mainWindow;
};

export default createMainWindow;
