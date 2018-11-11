import React from 'react';
import classes from './Modal.module.css';

function Modal(props) {
  return (
    <div className={classes.Modal}>
      <button title="Close" className={classes.button} onClick={props.handleClose}>x</button>
      <h4 className={classes.text}>{props.text}</h4>
    </div>
  )
}

export default Modal;