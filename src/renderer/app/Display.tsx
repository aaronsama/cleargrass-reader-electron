import React from 'react';
import { Reading } from '../../types';
import styled from 'styled-components';

const temperatureFontSize = '140px';
const humidityFontSize = '80px';

const DisplayFrame = styled.div`
  width: 400px;
  height: 400px;
  border-radius: 50%;
  border: 1px solid lightgray;
  background-color: white;
  margin: auto;
`;

const InnerDisplayFrame = styled.div`
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background-color: lightgray;
  margin: 40px;
  display: flex;
  flex-direction: column;
`;

const TemperatureDisplay = styled.div`
  font-size: ${temperatureFontSize};
  margin: 0 auto;
  padding-top: 35px;
  border-bottom: 1px solid black;
  display: flex;
`;

const RightSide = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const TemperatureRightSide = styled(RightSide)`
  & > div {
    line-height: 60px;
    font-size: 60px;
  }
`;

const HumidityDisplay = styled.div`
  font-size: ${humidityFontSize};
  display: flex;
  margin: 0 auto;
`;

const HumidityRightSide = styled(RightSide)`
  & > div {
    line-height: 35px;
    font-size: 35px;
  }
`;

const Display = ({ temperature, humidity }: Reading) => (
  <DisplayFrame>
    <InnerDisplayFrame>
      <TemperatureDisplay>
        <div>{Math.floor(temperature)}.</div>
        <TemperatureRightSide>
          <div>℃</div>
          <div>{Math.floor((temperature % 1) * 10)}</div>
        </TemperatureRightSide>
      </TemperatureDisplay>
      <HumidityDisplay>
        <div>{Math.floor(humidity)}.</div>
        <HumidityRightSide>
          <div>%</div>
          <div>{Math.floor((humidity % 1) * 10)}</div>
        </HumidityRightSide>
      </HumidityDisplay>
    </InnerDisplayFrame>
  </DisplayFrame>
);

export default Display;
