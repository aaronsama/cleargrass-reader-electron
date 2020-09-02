import { Dispatch, SetStateAction } from "react";

export type DeviceState = {
  connecting: boolean;
  connected: boolean;
  device?: BluetoothDevice;
  temperature?: number;
  humidity?: number;
  rawData?: string;
};

const dataViewToHexString = (dataView: DataView): string =>
  Array.from(new Uint8Array(dataView.buffer))
    .map((b: number) => {
      return b.toString(16).padStart(2, "0");
    })
    .join("");

export const connectToDevice = async (
  setState: Dispatch<SetStateAction<DeviceState>>,
) => {
  setState({ connected: false, connecting: true });

  const device = await navigator.bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: [
      "22210000-554a-4546-5542-46534450464d",
      "0000fe95-0000-1000-8000-00805f9b34fb",
    ],
  });

  await device.gatt.connect();

  setState({ connecting: false, connected: true, device });
};

export const readValues = async (
  device: BluetoothDevice,
  setState: Dispatch<SetStateAction<DeviceState>>,
) => {
  const service = await device.gatt.getPrimaryService(
    "22210000-554a-4546-5542-46534450464d",
  );
  const dataCharacteristic = await service.getCharacteristic(0x100);
  await dataCharacteristic.startNotifications();

  async function listenForChanges(this: BluetoothRemoteGATTCharacteristic) {
    const data = new Uint8Array(this.value.buffer);
    const rawData = dataViewToHexString(this.value);

    const temperatureBytes = data.slice(2, 4);
    // always convert to C by xor-ing with 0x7f (in case the value is F)
    const temperature =
      (temperatureBytes[0] + (temperatureBytes[1] & 0x7f) * 2 ** 8) / 10;

    const humidityBytes = data.slice(4);
    const humidity = (humidityBytes[0] + humidityBytes[1] * 2 ** 8) / 10;

    window.ipc.sendNewData({ temperature, humidity });

    setState(state => ({
      ...state,
      temperature,
      humidity,
      rawData,
    }));

    await dataCharacteristic.stopNotifications();
  }

  dataCharacteristic.addEventListener(
    "characteristicvaluechanged",
    listenForChanges,
  );
};
