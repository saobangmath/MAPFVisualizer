import React from "react";
import classes from "./Agent_Page.module.css";
import { useState } from "react";
import AgentTable from "./Agent_Table";

import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { maps } from "../../../maps";
import "bootstrap/dist/css/bootstrap.min.css";

const map = require("../../../pathFinding/Map");
const Cell = require("../../../pathFinding/Cell");
const HighLevelSolver = require("../../../pathFinding/cbs/highLevelSolver");

function Agents_Page(props) {
  function newAgent() {
    let agentId = Object.keys(props.agents).length + 1;
    let endColor = props.endColor;
    let robot = props.robotImage;
    var startP = generateStartPosition(props.gridMap);
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
    const boardCopy = [...props.gridMap];
    let lastAgent = props.agents[agentId];
    boardCopy[props.agents[agentId].startPoint.row][
      props.agents[agentId].startPoint.col
    ] = lastAgent;

    props.mapping(boardCopy);
  }
  function generateStartPosition(map) {
    var rowIndex, colIndex;
    do {
      rowIndex = Math.floor(Math.random() * 4);
      colIndex = Math.floor(Math.random() * 4);
    } while (map[rowIndex][colIndex] !== ".");
    let sPosition = { row: rowIndex, col: colIndex };
    return sPosition;
  }

  // run the CBS algo with the added agents;
  const runCBSAlgo = () => {
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
    let paths = new HighLevelSolver(mp).solve();
    console.log(paths);
    if (Object.keys(paths).length === 0) {
      // there is no possible plan;
      alert("No possible plan found!");
      return;
    }
    props.setStep(0);
    props.setAgentPaths(paths);
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
      <button className={classes.btn} onClick={runCBSAlgo}>
        Start
      </button>
      <button
        className={classes.btn}
        onClick={() => {
          props.setStep(props.agentStep + 1);
        }}
      >
        Next
      </button>
      <button
        className={classes.btn}
        onClick={() => {
          props.setStep(Math.max(props.agentStep - 1, 0));
        }}
      >
        Prev
      </button>
    </>
  );
}

export default Agents_Page;
