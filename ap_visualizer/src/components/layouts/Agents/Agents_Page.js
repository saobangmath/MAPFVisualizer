import React from "react";
import classes from "./Agent_Page.module.css";
import AgentTable from "./Agent_Table";

import "bootstrap/dist/css/bootstrap.min.css";
import {clone2DArray, getSpeed, getNextAgentID} from '../../utility/Utility';

const map = require("../../../pathFinding/Map");
const Cell = require("../../../pathFinding/Cell");
const CBS = require("../../../pathFinding/cbs/highLevelSolver");
let interval = null; // the interval created to display the auto-movement of the agents;

function Agents_Page(props) {
  function newAgent() {
    let agentId = getNextAgentID(props.agents);
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
    const boardCopy = clone2DArray(props.gridMap);
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

  // get the chosen algo from the Algorithm drop down list;
  const getAlgo = (mp) => {
    if (props.algo === "CBS") {
      return new CBS(mp);
    }
    return null; // this line never reached!;
  };

  // run the chosen algo with the added agents;
  const runAlgo = () => {
    if (interval != null) {
      clearInterval(interval);
    }
    let mp = new map();
    mp.height = props.gridMap.length;
    mp.width = props.gridMap[0].length;
    mp.grid = clone2DArray(props.gridMap);
    // add agents in props to map agents with the format used in the cbs;
    for (let id in props.agents) {
      let start_row = props.agents[id].startPoint.row;
      let start_col = props.agents[id].startPoint.col;
      let status = props.agents[id].status;
      if (status === "Assigned"){ // only added those assigned agent into the algorithm plan;
        let end_row = props.agents[id].endPoint.row;
        let end_col = props.agents[id].endPoint.col;
        let agent = {
          START: new Cell(start_row, start_col),
          DEST: new Cell(end_row, end_col),
        };
        mp.agents[id] = agent;
      }
      else if (status === "Available"){ // treat those unassigned agents as the obstacles in the grid map;
        mp.grid[start_row][start_col] = "@";
      }
    }
    props.setAlgoFinished(false); // the algorithm is in executing progress;
    mp.no_agents = Object.keys(mp.agents).length;
    if (mp.no_agents === 0) {
      alert("There is no agents to run the CBS!");
      return;
    }
    let algo = getAlgo(mp);
    let paths = algo.solve();
    console.log(paths);
    if (Object.keys(paths).length === 0) { // there is no possible plan;
      alert("No possible plan found!");
      return;
    }
    props.setStep(0);
    props.setAgentPaths(paths);
    let maxLength = 1;
    for (let agentID in paths) {
      maxLength = Math.max(maxLength, paths[agentID].length);
    }
    let curStep = 0;
    interval = setInterval(function () {
      if (curStep >= maxLength) {
        props.setAlgoFinished(true);
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
        algoFinished={props.algoFinished}
        setAlgoFinished={props.setAlgoFinished}
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
