import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactMapGL, {NavigationControl, Marker, Popup} from 'react-map-gl';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import { withStyles } from '@material-ui/core/styles';
// import classes from './Map.module.css';

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
                {details.thumb === "" ? null : (
                <img src={details.thumb} alt={details.name} width="100px" height="100px" />
                )}
                <p>{user_rating === undefined ? null : user_rating.aggregate_rating}
                <span>{this.props.displayStarRating(Rating)}</span>
                <span>{user_rating === undefined ? null : (user_rating.votes === "1" ? ` 1 vote` : ` ${user_rating.votes} votes`)}</span></p><br />
                <p className={classes.address}>{location === undefined ? null : location.address}</p>
            </div>
            <div className="restaurant reviews">
                <h5 className={classes.title}>Reviews</h5>
                <ul className={classes.list}>
                {reviews.user_reviews === undefined ? null : (
                    reviews.user_reviews.map((review, index) => index < 2 ? (
                    <li className={classes.listItem} key={`${details.id}${index}`}>{`"${review.review.review_text}"`}</li>) : null)
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
                <RestaurantIcon className={classes.icon}
                onClick={() => this.props.clickInfo(coords)} />
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