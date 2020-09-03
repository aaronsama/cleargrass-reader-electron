import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
} from "electron";

app.commandLine.appendSwitch(
  "enable-experimental-web-platform-features",
  "true",
);
app.commandLine.appendSwitch("enable-web-bluetooth", "true");

const isWindows = process.platform === "win32";

const windows: {
  mainWindow: BrowserWindow;
  liveGraphWindow: BrowserWindow;
} = {
  mainWindow: undefined,
  liveGraphWindow: undefined,
};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const setMainMenu = () => {
  const template = [
    {
      label: isWindows ? "File" : app.getName(),
      submenu: [
        {
          label: isWindows ? "Exit" : `Quit ${app.getName()}`,
          accelerator: isWindows ? "Alt+F4" : "CmdOrCtrl+Q",
          click() {
            app.quit();
          },
        },
      ],
    },
    {
      label: "View",
      submenu: [
        {
          label: "Sensor Display",
          click() {
            if (windows.mainWindow) {
              windows.mainWindow.focus();
            } else {
              windows.mainWindow = createLiveGraphWindow();
              windows.mainWindow.on("closed", () => {
                windows.mainWindow = undefined;
              });
            }
          }
        },
        {
          label: "Live Graph",
          click() {
            if (windows.liveGraphWindow) {
              windows.liveGraphWindow.focus();
            } else {
              windows.liveGraphWindow = createLiveGraphWindow();
              windows.liveGraphWindow.on("closed", () => {
                windows.liveGraphWindow = undefined;
              });
            }
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  windows.mainWindow = createMainWindow();
  windows.mainWindow.on("closed", () => {
    windows.mainWindow = undefined;
  });

  setMainMenu();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
import { saveReading, allReadings, reading, lastTimestamp } from "./main/database";
import { IpcMainEvent } from "electron/main";
import createLiveGraphWindow from "./main/create_live_graph_window";
import createMainWindow from "./main/create_main_window";

ipcMain.on(
  "th-data",
  (event, receivedData: { temperature: number; humidity: number }) => {
    const previousTimestamp = lastTimestamp.get()?.timestamp;

    if (previousTimestamp) {
      const timeSinceLastReading =
        new Date().getTime() - new Date(previousTimestamp).getTime();

      console.log('time since last reading', timeSinceLastReading);

      if (timeSinceLastReading <= 1000) return; // store at most 1 message per second
    }

    const { lastInsertRowid } = saveReading.run(receivedData);
    const storedReading = reading.get(lastInsertRowid);

    if (windows.liveGraphWindow) {
      windows.liveGraphWindow.webContents.send("th-data-stored", storedReading);
    }
  },
);

ipcMain.on("request-all-data", (event: IpcMainEvent) => {
  const allData = allReadings.all();
  event.reply("all-data-reply", allData);
});
