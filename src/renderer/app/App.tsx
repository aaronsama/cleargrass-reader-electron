import React, { useState, useEffect } from "react";
import { DeviceState, readValues, connectToDevice } from "./dataReader";
import Display from "./Display";
import ConnectionStatus from "./ConnectionStatus";
import Settings from "./Settings";

const DEFAULT_UPDATE_FREQUENCY = 30;

const App = () => {
  const [state, setState] = useState<DeviceState>({
    connecting: false,
    connected: false,
  });
  const [updateFrequency, setUpdateFrequency] = useState<number>(DEFAULT_UPDATE_FREQUENCY);
  const {
    connecting,
    connected,
    device,
    temperature,
    humidity,
    rawData,
  } = state;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (connected) {
      readValues(device, setState);
      setInterval(readValues, updateFrequency * 1000, device, setState);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [connected, updateFrequency]);

  return (
    <div>
      <ConnectionStatus
        connected={connected}
        connecting={connecting}
        deviceName={device?.name}
        onConnect={() => connectToDevice(setState)}
      />
      {connected && (
        <>
          <Display temperature={temperature} humidity={humidity} />
          <Settings
            updateFrequency={updateFrequency}
            onChange={setUpdateFrequency}
          />
          <p>Raw data: {rawData || "??"}</p>
        </>
      )}
    </div>
  );
};

export default App;
