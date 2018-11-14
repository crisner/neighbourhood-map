import React from 'react';
import styles from './Popup.module.css';

function Popup(props) {
  const conditionDetails = ((props.details.hasOwnProperty('status') && props.details.status !== 200) || props.details.hasOwnProperty('message'));
  const conditionReviews = ((props.reviews.hasOwnProperty('status') && props.reviews.status !== 200) || props.reviews.hasOwnProperty('message'));
  const Rating = props.user_rating === undefined ? null : Number(props.user_rating.aggregate_rating);

  return (
    <div className={styles.Popup}>
      <button title="Close" className={styles.button}
      onClick={props.closeOnClick}>x</button>
      <h4 tabIndex="0" className={styles.title}>{props.popupInfo.name}</h4>
      {
        // Display restaurant details
      }
      <div tabIndex="0" className={styles.details}>
        {conditionDetails ? <p className={styles.address}>No details found</p> : null}
        {conditionDetails || props.details.thumb === "" ? null : (
        <img className={styles.img} src={props.details.thumb} alt={props.details.name} />
        )}
        <p className={styles.ratingDetails}>
        <span className={styles.stars}>{conditionDetails ? null : props.displayStarRating(Rating)}</span>
        <span className={styles.ratingValue}>{conditionDetails || props.user_rating === undefined ? null : props.user_rating.aggregate_rating}</span>
        <br />
        <span>{conditionDetails || props.user_rating === undefined ? null : (
          props.user_rating.votes === "1" ? ` 1 vote` : ` ${props.user_rating.votes} votes`
        )}</span><br />
        <span className={styles.address}>{conditionDetails || props.location === undefined ? null : props.location.address}</span></p>

        {
          // Display restaurant reviews
        }
        {/* <div tabIndex="0">
            <h5 className={styles.subtitle}>Reviews</h5>
            <ul className={styles.list}>
            {conditionReviews || props.reviews.user_reviews === undefined ? (
              <li className={styles.listItem} key={`${props.details.id}0`}>{`No reviews found`}</li>
            ) : (
              props.reviews.user_reviews.map((review, index) => index < 2 ? (
              <li className={styles.listItem} key={`${props.details.id}${index}`}>{`"${review.review.review_text}"`}</li>
              ) : null)
            )}
            </ul>
        </div> */}
      </div>
    </div>
  )
}

export default Popup;