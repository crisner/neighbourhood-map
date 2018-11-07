import React, {Component} from 'react';
import PropTypes from 'prop-types';
import NavBar from '../components/NavBar';
import ReactMapGL, {NavigationControl, Marker, Popup} from 'react-map-gl';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarHalfIcon from '@material-ui/icons/StarHalf';
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

  displayStarRating = (rating) => {
    const FullRating = 5;
    let ratingScore = rating;
    let starRating = [];
    for(let i = 0; i < FullRating; i++) {
      if(ratingScore > 1) {
        starRating.push(1);
      } else if(ratingScore > 0 && ratingScore < 1) {
        starRating.push(0.5);
      } else {
        starRating.push(0);
      }
      ratingScore--;
    }
    return starRating.map((star) => {
      return (
        star === 1 ? <StarIcon /> : (star === 0.5 ? <StarHalfIcon /> : <StarBorderIcon />)
      )
    });
  }

  showPopup = () => {
    const {popupInfo, restaurant_details, restaurant_reviews} = this.state;
    const {location, user_rating} = this.state.restaurant_details;
    const { classes } = this.props;
    const Rating = user_rating === undefined ? null : Number(user_rating.aggregate_rating);

    return popupInfo && (
      <Popup
      className={classes.popupInfo}
      latitude={Number(popupInfo.latitude)}
      longitude={Number(popupInfo.longitude)}
      closeButton={true}
      onClose={() => this.setState({popupInfo: null})}
      anchor="bottom">
        <h4>{popupInfo.name}</h4>
        <div className={classes.details}>
          {restaurant_details.thumb === "" ? null : (
            <img src={restaurant_details.thumb} alt={restaurant_details.name} width="100px" height="100px" />
          )}
          <p>{user_rating === undefined ? null : user_rating.aggregate_rating}
          <span>{this.displayStarRating(Rating)}</span>
          <span>{user_rating === undefined ? null : (user_rating.votes === "1" ? ` 1 vote` : ` ${user_rating.votes} votes`)}</span></p><br />
          <p className={classes.address}>{location === undefined ? null : location.address}</p>
        </div>
        <div className="restaurant reviews">
          <h5 className={classes.title}>Reviews</h5>
          <ul className={classes.list}>
            {restaurant_reviews.user_reviews === undefined ? null : (
              restaurant_reviews.user_reviews.map((review, index) => index < 2 ? (
              <li className={classes.listItem} key={`${restaurant_details.id}${index}`}>{`"${review.review.review_text}"`}</li>) : null)
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
      <React.Fragment>
      <NavBar location={location} />

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
      </React.Fragment>
    );
  }
}

Map.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Map);