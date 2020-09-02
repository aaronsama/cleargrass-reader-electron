import { app, Menu, BrowserWindow, ipcRenderer } from 'electron';
// import discoverPeripherals from './discoverPeripherals';

const isWindows = process.platform === 'win32';

export function setMainMenu(mainWindow: BrowserWindow) {
  const template = [
    {
      label: isWindows ? 'File' : app.getName(),
      submenu: [
        {
          label: 'Discover Devices',
          click() {
            // discoverPeripherals(app, mainWindow);
          }
        },
        {
          label: isWindows ? 'Exit' : `Quit ${app.getName()}`,
          accelerator: isWindows ? 'Alt+F4' : 'CmdOrCtrl+Q',
          click() {
            app.quit();
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
