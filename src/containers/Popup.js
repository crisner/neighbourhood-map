import React from 'react';
import classes from './Modal.module.css';

function Popup(props) {
  const conditionDetails = ((props.details.hasOwnProperty('status') && props.details.status !== 200) || props.details.hasOwnProperty('message'));
  const conditionReviews = ((props.reviews.hasOwnProperty('status') && props.reviews.status !== 200) || props.reviews.hasOwnProperty('message'));
  const Rating = props.user_rating === undefined ? null : Number(props.user_rating.aggregate_rating);

  return (
    <div className={classes.Modal}>
      <button title="Close" className={classes.button}
      onClick={props.closeOnClick}>x</button>
      <h4 tabIndex="0">{props.popupInfo.name}</h4>
      {
        // Display restaurant details
      }
      <div tabIndex="0" className={props.classes.details}>
        {conditionDetails ? <p className={props.classes.address}>No details found</p> : null}
        {conditionDetails || props.details.thumb === "" ? null : (
        <img src={props.details.thumb} alt={props.details.name} width="100px" height="100px" />
        )}
        <p>{conditionDetails || props.user_rating === undefined ? null : props.user_rating.aggregate_rating}
        <span>{conditionDetails ? null : props.displayStarRating(Rating)}</span>
        <span>{conditionDetails || props.user_rating === undefined ? null : (
          props.user_rating.votes === "1" ? ` 1 vote` : ` ${props.user_rating.votes} votes`
        )}</span></p><br />
        <p className={props.classes.address}>{conditionDetails || props.location === undefined ? null : props.location.address}</p>
        {
          // Display restaurant reviews
        }
        <div tabIndex="0">
            <h5 className={props.classes.title}>Reviews</h5>
            <ul className={props.classes.list}>
            {conditionReviews || props.reviews.user_reviews === undefined ? (
              <li className={props.classes.listItem} key={`${props.details.id}0`}>{`No reviews found`}</li>
            ) : (
              props.reviews.user_reviews.map((review, index) => index < 2 ? (
              <li className={props.classes.listItem} key={`${props.details.id}${index}`}>{`"${review.review.review_text}"`}</li>
              ) : null)
            )}
            </ul>
        </div>
      </div>
    </div>
  )
}

export default Popup;