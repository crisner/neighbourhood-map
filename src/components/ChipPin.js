import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const ChipPin = (color = null) => {
  const styles = theme => {
    const backgroundColor = color || theme.palette.background.default;

    return {
      root: {
        color: theme.palette.getContrastText(backgroundColor),
        backgroundColor,
      },
      clickable: {
        cursor: 'pointer',
        '&:hover, &:focus': {
          backgroundColor: '#f77848',
        },
        '&:active': {
          backgroundColor: '#f77848',
        },
      },
    };
  };

  const CustomChip = ({ classes, ...props }) => // Create custom chip for custom styles
    <Chip classes={classes} {...props} />;

  return withStyles(styles)(CustomChip);
};

export default ChipPin;