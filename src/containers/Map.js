import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactMapGL, {NavigationControl, Marker, Popup} from 'react-map-gl';
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
    },
    popupInfo: null,
    restaurant_details: [],
    restaurant_reviews: []
  };

  getRestasurantDetails = (resId) => {
    const Url = `https://developers.zomato.com/api/v2.1/restaurant?res_id=${resId}`;
    const headers = new Headers({
        "Content-Type": "application/json",
        "user-key": process.env.REACT_APP_ZOMATO_ACCESS_TOKEN
    });
    return fetch(Url, {headers}).then(res => res.json());
  }

  getReviews = (resId) => {
      const Url = `https://developers.zomato.com/api/v2.1/reviews?res_id=${resId}`;
      const headers = new Headers({
          "Content-Type": "application/json",
          "user-key": process.env.REACT_APP_ZOMATO_ACCESS_TOKEN
      });
      return fetch(Url, {headers}).then(res => res.json());
  }

  showPopup = () => {
    const {popupInfo, restaurant_details, restaurant_reviews} = this.state;
    const {location, user_rating} = this.state.restaurant_details;

    return popupInfo && (
        <Popup
        latitude={Number(popupInfo.latitude)}
        longitude={Number(popupInfo.longitude)}
        closeButton={true}
        onClose={() => this.setState({popupInfo: null})}
        anchor="bottom">
        <div className="restaurant details">
          <h4>{popupInfo.name}</h4>
          {restaurant_details.thumb === "" ? null : (
            <img src={restaurant_details.thumb} alt={restaurant_details.name} width="100px" />
          )}
          <p>{user_rating === undefined ? null : user_rating.aggregate_rating}
          <span>{user_rating === undefined ? null : (user_rating.votes === "1" ? ` 1 vote` : ` ${user_rating.votes} votes`)}</span></p>
          <p>{location === undefined ? null : location.address}</p>
        </div>
        <div className="restaurant reviews">
          <h5>Reviews</h5>
          <ul>
            {restaurant_reviews.user_reviews === undefined ? null : (
              restaurant_reviews.user_reviews.map((review, index) => index < 2 ? (
              <li key={`${restaurant_details.id}${index}`}>{review.review.review_text}</li>) : null)
            )}
          </ul>
        </div>
        </Popup>
    )
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.popupInfo !== prevState.popupInfo && this.state.popupInfo !== null) {
      const resId = this.state.popupInfo.res_id;
      this.getRestasurantDetails(resId)
      .then(details => {
        this.setState({restaurant_details: details})
        this.getReviews(resId)
        .then(reviews => this.setState({restaurant_reviews: reviews}))
        .catch(error => console.log(error, 'Cannot find restaurant reviews'))
      }).catch(error => console.log(error, 'Cannot find restaurant details'))
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
              onClick={() => {this.setState({
                popupInfo: coords,
                restaurant_details: [],
                restaurant_reviews: []
                })
              }} />
            </Marker>
          )
        })}
        {this.showPopup()}
        {console.log(this.state)}
      </ReactMapGL>
    );
  }
}

Map.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Map);