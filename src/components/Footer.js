import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  p: {
    paddingTop: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  footer: {
    background: '#3e3e3e',
    color: '#FFF',
    position: 'fixed',
    top: 'auto',
    bottom: 0,
    width: '100%',
    zIndex: theme.zIndex.drawer + 1,
  },
});

function Footer(props) {
  const { classes } = props;
  return (
      <footer position="fixed" color="primary" className={classes.footer}>
        <Typography className={classes.p} variant="body1" color="inherit" noWrap>
            Made by Renisha Christie
        </Typography>
      </footer>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Footer);
