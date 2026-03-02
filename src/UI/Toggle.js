import React, { useEffect, useState } from 'react';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';

const Toggle = (props) => {
  const { modalState, checkState } = props;
  console.log(checkState);

  const [toggleSwitch, setToggleSwitch] = useState(false);

  useEffect(() => {
    setToggleSwitch(checkState);
  }, [checkState]);

  const toggleSwitchHandler = () => {
    //setToggleSwitch(prev => !prev);
    modalState(checkState);
  };

  return (
    <React.Fragment>
      <div className="mr-3">
        <BootstrapSwitchButton
          checked={toggleSwitch}
          width={105}
          onstyle="success"
          onlabel="Pause"
          offlabel="Start"
          style="toggle_switch"
          onChange={toggleSwitchHandler}
        />
      </div>
    </React.Fragment>
  );
};

export default Toggle;
