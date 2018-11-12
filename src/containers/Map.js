import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactMapGL, {NavigationControl, Marker, Popup} from 'react-map-gl';
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
  popupInfo: {
    padding: '1.4em'
  },
  details: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'left'
  },
  list: {
    listStyle: 'none',
    fontSize: '0.95em',
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

    }
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
    const { classes } = this.props;
    const Rating = user_rating === undefined ? null : Number(user_rating.aggregate_rating);
    const conditionDetails = ((details.hasOwnProperty('status') && details.status !== 200) || details.hasOwnProperty('message'));
    const conditionReviews = ((reviews.hasOwnProperty('status') && reviews.status !== 200) || reviews.hasOwnProperty('message'));

    return popupInfo && (
        <Popup
        className={classes.popupInfo}
        latitude={Number(popupInfo.latitude)}
        longitude={Number(popupInfo.longitude)}
        closeButton={true}
        onClose={this.props.closeOnClick}
        anchor="bottom">
            <h4 tabIndex="0">{popupInfo.name}</h4>
            {
              // Display restaurant details
            }
            <div tabIndex="0" className={classes.details}>
              {conditionDetails ? <p className={classes.address}>No details found</p> : null}
              {conditionDetails || details.thumb === "" ? null : (
              <img src={details.thumb} alt={details.name} width="100px" height="100px" />
              )}
              <p>{conditionDetails || user_rating === undefined ? null : user_rating.aggregate_rating}
              <span>{conditionDetails ? null : this.props.displayStarRating(Rating)}</span>
              <span>{conditionDetails || user_rating === undefined ? null : (
                user_rating.votes === "1" ? ` 1 vote` : ` ${user_rating.votes} votes`
              )}</span></p><br />
              <p className={classes.address}>{conditionDetails || location === undefined ? null : location.address}</p>
            </div>
            {
              // Display restaurant reviews
            }
            <div tabIndex="0" className="restaurant reviews">
                <h5 className={classes.title}>Reviews</h5>
                <ul className={classes.list}>
                {conditionReviews || reviews.user_reviews === undefined ? (
                  <li className={classes.listItem} key={`${details.id}0`}>{`No reviews found`}</li>
                ) : (
                  reviews.user_reviews.map((review, index) => index < 2 ? (
                  <li className={classes.listItem} key={`${details.id}${index}`}>{`"${review.review.review_text}"`}</li>
                  ) : null)
                )}
                </ul>
            </div>
        </Popup>
      )
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
        <ReactMapGL
        role="application"
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        mapStyle={"mapbox://styles/crisner/cjo2rsbau30eo2sns60vykal6" || "mapbox://styles/mapbox/light-v9"}
        {...this.state.viewport}
        onViewportChange={this._onViewportChange}>
          <div style={{position: 'absolute', right: 0, top: '75px'}}>
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
    );
  }
}

Map.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Map);