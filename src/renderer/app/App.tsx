import React, { useState, useEffect } from "react";
import { DeviceState, readValues, connectToDevice } from "./dataReader";
import Display from './Display';

const App = () => {
  const [state, setState] = useState<DeviceState>({ connecting: false, connected: false });
  const [updateFrequency, setUpdateFrequency] = useState<number>(60);
  const { connecting, connected, device, temperature, humidity, rawData } = state;

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
      {!connected && !connecting &&  
        <>
          <p>Press the button on the back of the device for 2 seconds and press the button below</p>
        <button
            onClick={() => connectToDevice(setState)}
            disabled={connected}
          >
            Connect
          </button>
        </>
      }
      {connecting &&
        <h2>Connecting...</h2>
      }
      {connected &&
        <h2>Connected to {device.name}</h2>
      }
      {(temperature && humidity) &&
        <Display temperature={temperature} humidity={humidity} />
      }
      <label htmlFor="update-frequency">Update frequency (s)</label>
      <input
        id="update-frequency"
        type="number"
        min="1"
        value={updateFrequency}
        onChange={(e) => setUpdateFrequency(parseInt(e.target.value))}
      ></input>
      <p>Polling values every {updateFrequency} seconds</p>
      <p>Raw data: {rawData || '??'}</p>
    </div>
  );
};

export default App;
