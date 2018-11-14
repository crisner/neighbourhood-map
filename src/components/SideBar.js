import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const drawerWidth = 240;

// Apply dark theme
const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiListItemText: {
      root: {
        padding: 0,
      },
    },
    MuiList: {
      padding: {
        paddingTop: 0,
        paddingBottom: '28px',
      }
    }
  },
});

// Styles for materialui components
const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  listItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

function SideBar(props) {
  const { classes, location } = props;

  return (
    <MuiThemeProvider theme={theme}>
      <Drawer open = {props.open}
        className={classes.drawer}
        variant="persistent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        <List role="list">
          <Divider />
          {location.hasOwnProperty('status') && location.status !== 200 ? ( // error
            <div key={`${location.status}no-list`}>
            <ListItem role="listitem" className={classes.listItem} button>
              <ListItemText primary="No restaurants found" />
            </ListItem>
            <Divider />
          </div>
          ) : (location.map(res => ( // response success
            <div key={res.res_id}>
              <ListItem role="listitem" className={classes.listItem} button onClick={() => {
                props.clickInfo(res);
                props.marker(res);
                props.toggle();
                }}>
                <ListItemText primary={res.name} />
                <ListItemText secondary={res.locality} />
              </ListItem>
              <Divider />
            </div>
          )))}
        </List>
      </Drawer>
      </MuiThemeProvider>
  );
}

SideBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SideBar);
