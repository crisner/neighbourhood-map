import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactMapGL, {NavigationControl, Marker, Popup} from 'react-map-gl';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import ChipPin from '../components/ChipPin';
import { withStyles } from '@material-ui/core/styles';

// mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
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
      zoom: 11
    }
  };

  showPopup = () => {
    const {popupInfo, details, reviews} = this.props;
    const {location, user_rating} = this.props.details;
    const { classes } = this.props;
    const Rating = user_rating === undefined ? null : Number(user_rating.aggregate_rating);
    const condition = `details.hasOwnProperty('status') && details.status !== 200`;

    return popupInfo && (
        <Popup
        className={classes.popupInfo}
        latitude={Number(popupInfo.latitude)}
        longitude={Number(popupInfo.longitude)}
        closeButton={true}
        onClose={this.props.closeOnClick}
        anchor="bottom">
            <h4>{popupInfo.name}</h4>
            <div className={classes.details}>
              {condition ? <p className={classes.address}>No details found</p> : null}
              {condition || details.thumb === "" ? null : (
              <img src={details.thumb} alt={details.name} width="100px" height="100px" />
              )}
              <p>{condition || user_rating === undefined ? null : user_rating.aggregate_rating}
              <span>{condition ? null : this.props.displayStarRating(Rating)}</span>
              <span>{condition || user_rating === undefined ? null : (
                user_rating.votes === "1" ? ` 1 vote` : ` ${user_rating.votes} votes`
              )}</span></p><br />
              <p className={classes.address}>{condition || location === undefined ? null : location.address}</p>
            </div>
            <div className="restaurant reviews">
                <h5 className={classes.title}>Reviews</h5>
                <ul className={classes.list}>
                {reviews.user_reviews === undefined ? (
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
          mapStyle="mapbox://styles/crisner/cjo2rsbau30eo2sns60vykal6"
          {...this.state.viewport}
          onViewportChange={(viewport) => this.setState({viewport})}>
          <div style={{position: 'absolute', right: 0, top: '75px'}}>
            <NavigationControl onViewportChange={(viewport) => this.setState({viewport})} />
          </div>
          { location.map(coords => {
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
          })}
          {this.showPopup()}
        </ReactMapGL>
    );
  }
}

Map.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Map);