import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

type ConnectionStatusProps = {
  connected: boolean,
  connecting: boolean,
  deviceName?: string,
  onConnect: () => void
}

const ConnectionStatusWrapper = styled.div`
  text-align: center;
`;

const ConnectButton = styled.button`
  font-size: 28px;
  padding: 5px 32px;
`;

const ConnectionStatus = (props: ConnectionStatusProps) => {
  const { connected, connecting, deviceName, onConnect } = props;

  if (!connected) {
    return (
      <ConnectionStatusWrapper>
        <p>Press the button on the back of the device for 2 seconds and press the button below</p>
        <ConnectButton
          onClick={onConnect}
          disabled={connecting}
        >
          {connecting ? 'Connecting...' : 'Connect'}
        </ConnectButton>
      </ConnectionStatusWrapper>
    )
  } else if (connected) {
    return (
      <ConnectionStatusWrapper>
        <h2>Connected to {deviceName}</h2>
      </ConnectionStatusWrapper>
    );
  } else {
    return null;
  }
}

export default ConnectionStatus;
