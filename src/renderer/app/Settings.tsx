import React, { useState } from "react";
import styled from "styled-components";

type SettingsProps = {
  updateFrequency: number;
  onChange: (newValue: number) => void;
};

const SettingsWrapper = styled.div`
  padding: 24px;
  background-color: lightgray;
`;

const UpdateFrequencyField = styled.div`
  & > * {
    display: block;    
  }
  & > label {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 5px;
  }
  & > input {
    text-align: right;
    font-size: 14px;
    padding: 5px 0;
  }
  & > .helper-text {
    font-size: 10px;
    color: gray;
  }
`;

const SettingsButton = styled.button`

`;

const Settings = (props: SettingsProps) => {
  const [isOpen, toggle] = useState(false)
  const { updateFrequency, onChange } = props;

    return (
      <>
        <SettingsButton onClick={() => toggle(!isOpen)}>
          {isOpen ? 'Close' : 'Settings'}
        </SettingsButton>
        {isOpen &&
          <SettingsWrapper>
            <UpdateFrequencyField>
              <label htmlFor="update-frequency">Update frequency</label>
              <input
                id="update-frequency"
                type="number"
                min="1"
                value={updateFrequency}
                onChange={(e) => onChange(e.target.valueAsNumber)}
              />
              <span className="helper-text">
                Polling values every {updateFrequency} seconds
              </span>
            </UpdateFrequencyField>
          </SettingsWrapper>
        }
      </>
    );
};

export default Settings;
