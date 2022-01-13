import React from "react";
import classes from "./Agent_Page.module.css";
import AgentTable from "./Agent_Table";

import "bootstrap/dist/css/bootstrap.min.css";

const map = require("../../../pathFinding/Map");
const Cell = require("../../../pathFinding/Cell");
const CBS = require("../../../pathFinding/cbs/highLevelSolver");
let interval = null; // the interval created to display the auto-movement of the agents;

function Agents_Page(props) {
  function newAgent() {
    let agentId = Object.keys(props.agents).length + 1;
    let endColor = props.endColor;
    let pathColor = props.pathColor;
    let robotColor = props.robotColor;
    let robot = props.robotImage;
    let startP = generateStartPosition(props.gridMap);
    let agent = {
      img: robot,
      endColor: endColor,
      pathColor: pathColor,
      robotColor: robotColor,
      agentId: agentId,
      startPoint: startP,
      endPoint: "",
      status: "Available",
      priority: null,
      curStep: "",
      maxStep: "",
      path: [],
    };
    props.agents[agentId] = agent;
    props.setAgentsList(props.agents);
    props.setAgentPaths({});
    const boardCopy = [...props.gridMap];
    let lastAgent = props.agents[agentId];
    boardCopy[props.agents[agentId].startPoint.row][
      props.agents[agentId].startPoint.col
    ] = lastAgent;

    props.mapping(boardCopy);
  }
  function generateStartPosition(map) {
    let rowIndex, colIndex;
    do {
      rowIndex = Math.floor(Math.random() * 9);
      colIndex = Math.floor(Math.random() * 14);
    } while (map[rowIndex][colIndex] !== ".");
    let sPosition = { row: rowIndex, col: colIndex };
    return sPosition;
  }

  // get the display speed in ms;
  const getSpeed = (e) => {
    if (e === "Fast") {
      return 200;
    } else if (e === "Average") {
      return 500;
    } else {
      return 1000;
    }
  };

  // get the choosen algo from the Algorithm drop down list;
  const getAlgo = (mp) => {
    if (props.algo === "CBS") {
      return new CBS(mp);
    }
    return null; // this line never reached!;
  };

  // run the chosen algo with the added agents;
  const runAlgo = () => {
    let mp = new map();
    mp.height = props.gridMap.length;
    mp.width = props.gridMap[0].length;
    mp.grid = [...props.gridMap];
    mp.no_agents = Object.keys(props.agents).length;
    if (mp.no_agents === 0) {
      alert("There is no agents to run the CBS!");
      return;
    }
    // add agents in props to map agents with the format used in the cbs;
    for (let id = 1; id <= mp.no_agents; id++) {
      let start_row = props.agents[id].startPoint.row;
      let start_col = props.agents[id].startPoint.col;
      let end_row = props.agents[id].endPoint.row;
      let end_col = props.agents[id].endPoint.col;
      let agent = {
        START: new Cell(start_row, start_col),
        DEST: new Cell(end_row, end_col),
      };
      mp.agents[id] = agent;
    }
    let algo = getAlgo(mp);
    let paths = algo.solve();
    if (Object.keys(paths).length === 0) {
      // there is no possible plan;
      alert("No possible plan found!");
      return;
    }
    //store the agent path into the agents list
    for (let agentId in paths) {
      storeAgentMapPath(paths[agentId], props.agents[agentId]);
    }
    props.setStep(0);
    props.setAgentPaths(paths);
    runMap(paths);
  };
  //store the algo path into each agents
  const storeAgentMapPath = (paths, agent) => {
    let agentPath = agent.path;
    for (let cellId = 0; cellId < paths.length; cellId++) {
      let path = { row: paths[cellId].x, col: paths[cellId].y };
      agentPath.push(path);
    }
    agent.path = agentPath;
    agent.status = "Busy";
    agent.maxStep = paths.length; //exclude start point, only count the path and the destination steps.

    props.agents[agent.agentId] = agent;
    props.setAgentsList(props.agents);
    console.log(props.agents);
  };
  const runMap = (paths) => {
    if (interval != null) {
      clearInterval(interval);
    }
    let maxLength = 1;
    for (let agentID in paths) {
      maxLength = Math.max(maxLength, paths[agentID].length);
    }
    let curStep = 0;
    interval = setInterval(function () {
      updateAgentStep(curStep, props.agents); //update the current steps in the for each agents
      if (curStep >= maxLength) {
        return;
      }
      props.setStep(curStep + 1);
      curStep += 1;
    }, getSpeed(props.speed));
    props.setAgentsList(props.agents);
  };

  const updateAgentStep = (curStep, agents) => {
    for (let index = 1; index <= Object.keys(agents).length; index++) {
      let curAgent = agents[index];
      curAgent.curStep = curStep;
      if (curStep === curAgent.maxStep) {
        curAgent.status = "Completed";
      }
      let clone_agents = {... props.agents};
      clone_agents[curAgent.agentId] = curAgent;
      props.setAgentsList(clone_agents);
    }
  };

  return (
    <>
      <AgentTable
        agents={props.agents}
        setAgentsList={props.setAgentsList}
        setAgentPaths={props.setAgentPaths}
        gridMap={props.gridMap}
        mapping={props.mapping}
      ></AgentTable>
      <button className={classes.btn} onClick={newAgent}>
        Add
      </button>
      <button className={classes.btn} onClick={runAlgo}>
        Start
      </button>
    </>
  );
}

export default Agents_Page;
