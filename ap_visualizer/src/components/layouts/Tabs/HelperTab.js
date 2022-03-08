import React from "react";
import { Tabs } from "react-simple-tabs-component";
// (Optional) if you don't want to include bootstrap css stylesheet
import "react-simple-tabs-component/dist/index.css";
import classes from "../Tabs/HelperTab.module.css";
// Component Example
const TabOne = () => {
  return (
    <>
      <h4>What is AP Visualizer?</h4>
      <p>
        AP Visualizer is a robot fleet management application that simulate
        robots moving in a grid map. It will use the most optimised algorithm to
        find the fastest path to the specific destination.
      </p>
    </>
  );
};

const TabTwo = () => {
  return (
    <>
      <h3>AP Visualizer Common-Terminology</h3>
      <h5>Type of status</h5>
      <ul className={classes.list_style}>
        <li>Available: The robot is available for assigning of task.</li>
        <li>Busy: The robot is still running the algorithm.</li>
        <li>Completed: The robot has finished running the algorithm.</li>
      </ul>
      <h5>Type of actions</h5>
      <ul className={classes.list_style}>
        <li>Assign: You can click on it to assign task.</li>
        <li>
          Ready: The robot is ready to start, but you can still make changes to
          the destination.
        </li>
        <li>
          Running: The robot has finished running the algorithm.Nothing can be
          change at this point of time.
        </li>
        <li>
          Detail: The robot has finished running the algorithm, you can click on
          it to view the details.
        </li>
      </ul>
    </>
  );
};
const TabThree = () => {
  return (
    <>
      <h3>Frequent Asked Questions</h3>
      <p className={classes.section_style}>
        Q1. What is the max number of robots I can add into my map?
      </p>
      <p className={classes.answer_style1}>
        Ans: Below are the max number of robots that you can add into our map:
      </p>
      <ul className={classes.list_style}>
        <li>-Less than 30 squares: 2 robots</li>
        <li>-More than 30 squares but less than 100 squares: 5 robots</li>
        <li>-More than 100 squares: 8 robots</li>
      </ul>
      <p className={classes.section_style}>
        Q2. How do I upload/change my map?
      </p>
      <p className={classes.answer_style}>
        Ans: You can change the map by clicking "Default Map" at the bottom of
        our page.
      </p>
      <p className={classes.section_style}>
        Q3. What is the recommended speed and algorithms to start with?
      </p>
      <p className={classes.answer_style}>
        Ans: Our recommended speed is "Average" and algorithm will be "CBS".
      </p>
      <p className={classes.section_style}>Q4. What is the chart showing?</p>
      <p className={classes.answer_style}>
        Ans: Execution Time Comparison Chart refers to the time needed to finish
        running the algorithms. The shorter the time the better the algorithm.
      </p>
    </>
  );
};
// Tabs structure Array
const tabs = [
  {
    label: "Who Are We", // Tab Title - String
    Component: TabOne, // Tab Body - JSX.Element
  },
  {
    label: "Common-Terminology",
    Component: TabTwo,
  },
  {
    label: "Frequent Asked Questions",
    Component: TabThree,
  },
];
const HelperTab = () => {
  return (
    <Tabs
      textColor="secondary"
      indicatorColor="secondary"
      tabs={tabs} /* Props */
    />
  );
};

export default HelperTab;
