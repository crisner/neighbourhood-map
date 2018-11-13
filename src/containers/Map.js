import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactMapGL, {NavigationControl, Marker} from 'react-map-gl';
import Popup from './Popup';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import ChipPin from '../components/ChipPin';
import { withStyles } from '@material-ui/core/styles';

// Set bounds to Coimbatore, TN
const bounds = [
  [10.993437, 76.909858], // Southwest coordinates
  [11.037247, 76.985733]  // Northeast coordinates
];

// Styles for materialui components
const styles = theme => ({
  root: {
    color: theme.palette.text.primary,
  },
  chip: {
    margin: theme.spacing.unit,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '1.8em',
    height: '1.8em',
    borderRadius: '100%',
    transform: 'rotateZ(45deg)',
    borderBottomRightRadius: 0
  },
  icon: {
    position: 'relative',
    left: '50%',
    margin: 0,
    alignSelf: 'center',
    color: '#FFF',
    cursor: 'pointer',
    fontSize: '16px',
    transform: 'rotateZ(315deg)'
  },
  details: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'left',
    fontSize: '0.5em',
  },
  list: {
    listStyle: 'none',
    padding: 0
  },
  listItem: {
    padding: '0.2em',
    fontStyle: 'italic'
  },
  title: {
    marginBottom: '-9px'
  },
  address: {
    width: '100%',
    maxWidth: '100%',
    fontWeight: 500,
    marginBottom: 0
  }
});

class Map extends Component {

  state = {
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      latitude: 11.004556,
      longitude: 76.961632,
      zoom: 11,
      maxBounds: bounds
    },
    top: 0
  };

  /*
   *  Update viewport state on viewport change
   */
  onViewportChange = viewport => {
    this.setState({viewport});
  };

  /*
   *  Function call to display restaurant information
   *  as popup
   */
  showPopup = () => {
    const {popupInfo, details, reviews} = this.props;
    const {location, user_rating} = this.props.details;

    return popupInfo && (
      <Popup
        popupInfo={popupInfo}
        details={details}
        reviews={reviews}
        user_rating={user_rating}
        location={location}
        displayStarRating={this.props.displayStarRating}
        closeOnClick={this.props.closeOnClick}
         />
    )
  }

  componentDidMount() {
    const height = this.props.height(); // height setter for map element
    const topPosition = this.props.topPosition(); // position setter for map element
    this.setState({
      viewport: {
      width: window.innerWidth,
      height,
      latitude: 11.004556,
      longitude: 76.961632,
      zoom: 11,
      maxBounds: bounds
      },
      top: topPosition
  })
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.popupInfo !== nextProps.popupInfo && nextProps.popupInfo !== null) {
      const resId = nextProps.popupInfo.res_id;
      this.props.setRestaurantInfo(resId);
    }
  }

  render() {
    // console.log(this.props);
    const { classes, location } = this.props;
    const DroppedPin = ChipPin('#f7b148');

    return (
      <div style={{position: 'absolute', top: `${this.state.top}px`}}>
        <ReactMapGL
        role="application"
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        mapStyle={"mapbox://styles/crisner/cjo2rsbau30eo2sns60vykal6" || "mapbox://styles/mapbox/light-v9"}
        {...this.state.viewport}
        onViewportChange={this._onViewportChange}>
          <div style={{position: 'absolute', right: 0, top: '40px'}}>
            <NavigationControl onViewportChange={(viewport) => this.setState({viewport})} />
          </div>
          { location.hasOwnProperty('status') && location.status !== 200 ? null : (
            location.map(coords => {
              return (
                <Marker
                key={coords.res_id}
                latitude={Number(coords.latitude)}
                longitude={Number(coords.longitude)}
                offsetLeft={-20} offsetTop={-10}>
                  <DroppedPin className={classes.chip} icon={<RestaurantIcon className={classes.icon} />}
                  onClick={() => {this.props.clickInfo(coords)}} />
                </Marker>
              )
            })
          )}
          {this.showPopup()}
        </ReactMapGL>
      </div>
    );
  }
}

Map.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Map);