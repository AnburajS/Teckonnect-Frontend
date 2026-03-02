import React, { useEffect, useState } from 'react';
import { Switch, FormControlLabel } from '@mui/material';

const ToggleRadioButton = ({ scheduleJob = false, setScheduleJob }) => {
  const [checked, setChecked] = useState(scheduleJob);
  useEffect(() => {
    setChecked(scheduleJob);
  }, [scheduleJob]);
  const handleChange = (event) => {
    setScheduleJob(event.target.checked);
    // setChecked(event.target.checked);
  };

  return (
    <FormControlLabel
      control={
        <Switch
          checked={checked}
          onChange={handleChange}
          color="success"
          sx={{
            '& .MuiSwitch-thumb': {
              backgroundColor: checked ? '#588e21' : '#646464', // Red when checked, gray when unchecked'#f3f3f3''#f3f3f3
            },
            '& .MuiSwitch-track': {
              backgroundColor: checked ? '#588e21' : '#646464', // Light red track when checked
            },
          }}
        />
      }
      label={checked ? 'Yes' : 'No'}
    />
  );
};

export default ToggleRadioButton;
