import React from 'react';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material';

// Define the ToolTip component with dynamic props
const ToolTip = styled(
  ({ className, backgroundColor, color, fontSize, ...props }) => (
    <Tooltip
      {...props}
      classes={{ popper: className }}
      arrow
    />
  )
)(
  ({
    theme,
    backgroundColor = '#82889B',
    color = '#FFFFFF',
    fontSize = '12px',
  }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: backgroundColor, // Tooltip background color (dynamic)
      color: color, // Tooltip text color (dynamic)
      fontSize: fontSize, // Tooltip font size (dynamic)
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: backgroundColor, // Arrow background color (dynamic)
    },
  })
);

export default ToolTip;
