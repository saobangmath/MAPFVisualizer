import React from "react";
import { Tabs } from "react-simple-tabs-component";
// (Optional) if you don't want to include bootstrap css stylesheet
import "react-simple-tabs-component/dist/index.css";
// Component Example
const TabOne = () => {
  return (
    <>
      <h4>Who We Are</h4>
      <p>We are creator of AP Visualizer.</p>
    </>
  );
};

const TabTwo = () => {
  return (
    <>
      <h3>How To Start</h3>
      <p>The steps is actually easy.</p>
      <p>
        Type of status: -Available (When there's no task being assigned to the
        agents) -Assigned (When the agent is being assigned with a task) -Busy
        (the agent is running the algorithm) -Completed (Agent has finish
        running the algorithm and is available for user to view their algorithm
        details)
      </p>
      <p>
        -Type of actions: -Assign (the agent is available for user to assign the
        robot task) (CLICKABLE) -Ready (After agent has been assigned with an
        task) (CLICKABLE) -Running (Agent is still running the algorithm)(NOT
        CLICKABLE) -Detail (the agent has finish running the algorithm and users
        is able to click on it to view the details) (CLICKABLE)
      </p>
    </>
  );
};
const TabThree = () => {
  return (
    <>
      <h3>Tab One</h3>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perferendis
        sint illum iusto nostrum cumque qui voluptas tenetur inventore ut quis?
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
    label: "How To Start",
    Component: TabTwo,
  },
  {
    label: "Map guidelines",
    Component: TabThree,
  },
];
const HelperTab = () => {
  return <Tabs tabs={tabs} /* Props */ />;
};

export default HelperTab;
