import noble, { Peripheral } from '@abandonware/noble';
import { BrowserWindow, App } from 'electron';

const discoverPeripherals = (app: App, mainWindow: BrowserWindow) => {
  noble.on("stateChange", (state: string) => {
    if (state === "poweredOn") {
      noble.startScanning([], true);
    } else {
      noble.stopScanning();
    }
  });

  noble.on("discover", (peripheral: Peripheral) => {
    console.log(peripheral);

    mainWindow.webContents.send("peripheral-discovered", {
      id: peripheral.id,
      address: peripheral.address,
      name: peripheral.advertisement.localName,
      manufacturerData: peripheral.advertisement.manufacturerData,
    });
  });

  app.on("before-quit", () => noble.stopScanning());
}

export default discoverPeripherals;
