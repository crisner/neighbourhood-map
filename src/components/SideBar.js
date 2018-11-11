import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const drawerWidth = 240;

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
});

function SideBar(props) {
  const { classes, location } = props;

  return (
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
            <ListItem role="listitem" button>
              <ListItemText primary="No restaurants found" />
            </ListItem>
            <Divider />
          </div>
          ) : (location.map(res => ( // response success
            <div key={res.res_id}>
              <ListItem role="listitem" button onClick={() => props.clickInfo(res)}>
                <ListItemText primary={res.name} />
                <ListItemText secondary={res.locality} />
              </ListItem>
              <Divider />
            </div>
          )))}
        </List>
      </Drawer>
  );
}

SideBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SideBar);
