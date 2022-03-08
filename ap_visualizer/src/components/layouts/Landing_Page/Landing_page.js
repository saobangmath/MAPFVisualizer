import React from "react";
import classes from "./Landing_Page.module.css";
import { useState } from "react";

function Landing_page(props) {
  ///create a state replace the content of the cild when u set the state.

  var [firstModal, setModalIsOpen] = useState(true);
  const [secondModal, setPage] = useState(false);
  const [thirdModal, setThirdPage] = useState(false);
  const [finalModal, setFinalPage] = useState(false);
  const togglePage = () => {
    if (firstModal) {
      setModalIsOpen(!firstModal);
      setPage(!secondModal);
    } else if (secondModal) {
      // setModalIsOpen(!firstModal);
      setPage(!secondModal);
      setThirdPage(!thirdModal);
    } else if (thirdModal) {
      setThirdPage(!thirdModal);
      setFinalPage(!finalModal);
    } else {
      setFinalPage(!finalModal);
    }
  };
  const backPage = () => {
    if (secondModal) {
      setPage(!secondModal);
      setModalIsOpen(!firstModal);
    } else {
      setPage(!secondModal);
      setThirdPage(!thirdModal);
    }
  };
  return (
    <>
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
            <p>
              Users can select between A* algorithm or Conflict Based Search
              algorithm to find the best optimised path for the robots.
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
            <div className={classes.model_desc}>
              <strong>A* search</strong>
              <p className={classes.desc}>
                A* search is an informed search algorithm, or a best-first
                search, meaning that it is formulated in terms of weighted
                graphs.
              </p>
            </div>
            <div>
              <strong>Conflict Based Search(CBS)</strong>
              <p className={classes.desc}>
                CBS is a two-level algorithm that does not convert the problem
                into the single ‘joint agent’ model. At the high level, a search
                is performed on a Conflict Tree (CT) which is a tree based on
                conflicts between individual agents. Each node in the CT
                represents a set of constraints on the motion of the agents. At
                the low level, fast single-agent searches are performed to
                satisfy the constraints imposed by the high level CT node.{" "}
              </p>
            </div>
            <button className={classes.btn} onClick={backPage}>
              Back
            </button>{" "}
            <button className={classes.btn} onClick={togglePage}>
              Next
            </button>
          </div>
        </div>
      )}
      {finalModal && (
        <div className={classes.modal}>
          <div className={classes.overlay} onClick={togglePage}></div>
          <div className={classes.modal_content}>
            <img
              src={props.image}
              className={classes.landing_image}
              alt="logo"
            />
            <p className={classes.model_desc}>Congratulations and BRAVO!</p>
            <p>
              You have a basic knowledge of the different algorithms.You can
              proceed on to assigning task to the robots.If you have any
              questions, feel free to approach our robot helper at the bottom
              right of the page.
            </p>
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
