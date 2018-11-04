import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactMapGL, {NavigationControl, Marker} from 'react-map-gl';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import { withStyles } from '@material-ui/core/styles';
// import icon from './Map.module.css';

// mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
const styles = theme => ({
  root: {
    color: theme.palette.text.primary,
  },
  icon: {
    margin: theme.spacing.unit,
    fontSize: 32,
    color: '#dca845',
    cursor: 'pointer'
  },
});

class Map extends Component {

  state = {
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      latitude: 11.004556,
      longitude: 76.961632,
      zoom: 11
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <ReactMapGL
        mapStyle="mapbox://styles/crisner/cjo2rsbau30eo2sns60vykal6"
        {...this.state.viewport}
        onViewportChange={(viewport) => this.setState({viewport})}>
        <div style={{position: 'absolute', right: 0, top: '75px'}}>
          <NavigationControl onViewportChange={(viewport) => this.setState({viewport})} />
        </div>
        <Marker
        // className={icon.marker}
        latitude={10.95} longitude={76.94} offsetLeft={-20} offsetTop={-10}>
        <RestaurantIcon className={classes.icon} />
        </Marker>
      </ReactMapGL>
    );
  }
}

Map.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Map);