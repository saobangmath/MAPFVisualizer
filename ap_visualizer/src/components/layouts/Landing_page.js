import React from "react";
import classes from "./Landing_Page.module.css";
import { useState } from "react";

function Landing_page(props) {
  ///create a state replace the content of the cild when u set the state.

  var [firstModal, setModalIsOpen] = useState(true);
  const [secondModal, setPage] = useState(false);
  const [thirdModal, setFinalPage] = useState(false);
  const togglePage = () => {
    if (firstModal) {
      setModalIsOpen(!firstModal);
      setPage(!secondModal);
    } else if (secondModal) {
      // setModalIsOpen(!firstModal);
      setPage(!secondModal);
      setFinalPage(!thirdModal);
    } else {
      setFinalPage(!thirdModal);
    }
  };
  const backPage = () => {
    setPage(!secondModal);
    setModalIsOpen(!firstModal);
  };
  return (
    <>
      {/* <button onClick={togglePage()} className={classes.btn}>
        Click
      </button> */}
      {firstModal && (
        <div className={classes.modal}>
          <div className={classes.overlay} onClick={togglePage}></div>
          <div className={classes.modal_content}>
            <h2> Welcome To </h2>
            <img
              src={props.image}
              className={classes.landing_image}
              alt="logo"
            />
            <p className={classes.model_desc}>
              This short tutorial will walk you through all of the features of
              this application and give you more information about us.
            </p>
            <img src={props.image1} className={classes.image} alt="logo" />
            <button className={classes.btn} onClick={togglePage}>
              Next
            </button>
          </div>
        </div>
      )}
      {secondModal && (
        <div className={classes.modal}>
          <div className={classes.overlay} onClick={togglePage}></div>
          <div className={classes.modal_content}>
            <img
              src={props.image}
              className={classes.landing_image}
              alt="logo"
            />
            <p className={classes.modal_title}>Who are we?</p>
            <p className={classes.modal_desc}>
              AP Visualizer is a robot fleet management application that
              simulate robots moving in a grid map. It will use the most
              optimised algorithm to find the fastest path to the specific
              destination
            </p>
            <img src={props.image1} className={classes.image} alt="logo" />
            <button className={classes.btn} onClick={backPage}>
              Back
            </button>{" "}
            <button className={classes.btn} onClick={togglePage}>
              Next
            </button>
          </div>
        </div>
      )}
      {thirdModal && (
        <div className={classes.modal}>
          <div className={classes.overlay} onClick={togglePage}></div>
          <div className={classes.modal_content}>
            <img
              src={props.image}
              className={classes.landing_image}
              alt="logo"
            />
            <p className={classes.model_desc}>Congratulations and BRAVO!</p>
            <p>You have completed the tutorial, feel free to contact us</p>
            <img src={props.image2} className={classes.image} alt="logo" />
            <button className={classes.btn} onClick={togglePage}>
              Start Exploring
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Landing_page;
