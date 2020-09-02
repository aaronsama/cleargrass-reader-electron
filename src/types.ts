// import { Advertisement, Peripheral } from "@abandonware/noble";
// import { IpcRendererEvent } from "electron/main";

// declare global {
//   interface Window {
//     ipc: {
//       onNewDeviceDiscovered: (
//         callback: (
//           event: IpcRendererEvent,
//           peripheralData: PeripheralData,
//         ) => void,
//       ) => void;
//     };
//   }
// }

export type Reading = {
  temperature: number;
  humidity: number;
  battery: number;
};
