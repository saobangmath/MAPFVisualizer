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
    let robot = props.robotImage;
    let startP = generateStartPosition(props.gridMap);
    let agent = {
      img: robot,
      endColor: endColor,
      agentId: agentId,
      startPoint: startP,
      endPoint: "",
      status: "Available",
      priority: null,
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
      rowIndex = Math.floor(Math.random() * 4);
      colIndex = Math.floor(Math.random() * 4);
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
    if (props.algo === "CBS"){
      return new CBS(mp);
    }
    return null; // this line never reached!;
  };

  // run the chosen algo with the added agents;
  const runAlgo = () => {
    if (interval != null){
      clearInterval(interval);
    }
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
    console.log(paths);
    if (Object.keys(paths).length === 0) {
      // there is no possible plan;
      alert("No possible plan found!");
      return;
    }
    props.setStep(0);
    props.setAgentPaths(paths);
    let maxLength = 1;
    for (let agentID in paths){
      maxLength = Math.max(maxLength, paths[agentID].length);
    }
    let curStep = 0;
    interval = setInterval(function (){
      if (curStep >= maxLength){
        return;
      }
      props.setStep(curStep + 1);
      curStep += 1;
    }, getSpeed(props.speed));
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
