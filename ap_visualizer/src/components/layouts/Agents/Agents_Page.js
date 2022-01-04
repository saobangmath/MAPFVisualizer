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
  let [addModal, setModalIsOpen] = useState(false);
  let [startModal, setStartModalOpen] = useState(false);
  let [endModal, setEndModalOpen] = useState(false);
  let [priority, setPriority] = useState("");
  let [algo, setAlgo] = useState("");
  let [validateStart, hasStart] = useState(false); //validate only 1 startpoint
  let [validateEnd, hasEnd] = useState(false); //validate only 1 endpoint

  let [startBoard, setStartBoard] = useState(props.gridMap);

  let [endBoard, setEndBoard] = useState(props.gridMap);

  let [start, startPoint] = useState([]); //the start point of the robot
  let [end, endPoint] = useState([]); //the end point of the robot

  //Add Agent
  const AddAgent = () => {
    let agentId = Object.keys(props.agents).length + 1;
    let endColor = props.endColor;
    let robot = props.robotImage;
    let agent = {
      img: robot,
      endColor: endColor,
      agentId: agentId,
      startPoint: start[start.length - 1],
      endPoint: end[end.length - 1],
      status: "Assigned",
      priority: null,
    };
    props.agents[agentId] = agent;
    props.setAgentsList(props.agents); // add the new agents to the current agents;
    props.setAgentPaths([]); // reset the agent path from the previous CBS algo run;

    const boardCopy = [...props.gridMap];
    let lastAgent = props.agents[agentId];

    boardCopy[props.agents[agentId].startPoint.row][
      props.agents[agentId].startPoint.col
    ] = lastAgent;

    boardCopy[props.agents[agentId].endPoint.row][
      props.agents[agentId].endPoint.col
    ] = lastAgent;

    props.mapping(boardCopy);
    endBoard = new Array(props.gridMap.length)
      .fill("")
      .map((row) => new Array(props.gridMap[0].length).fill(null));
    startBoard = new Array(props.gridMap.length)
      .fill("")
      .map((row) => new Array(props.gridMap[0].length).fill(null));
    setStartBoard(startBoard);
    setEndBoard(endBoard);
    showPopup();
  };

  const showPopup = () => {
    setModalIsOpen(!addModal);
  };
  const startCheck = () => {
    hasStart(!validateStart);
  };
  const endCheck = () => {
    hasEnd(!validateEnd);
  };
  // set start location for the new agent;
  const setStartPoint = (row, col) => {
    let sPosition = { row: row, col: col };
    start.push(sPosition);
  };

  // set end location for the new agent;
  const setEndPoint = (row, col) => {
    let ePosition = { row: row, col: col };
    end.push(ePosition);
  };
  // show the start modal to indicate the start location of the new agent;
  const showStart = () => {
    setStartModalOpen(!startModal);
  };
  //close the start modal using the assign button(future implementation for validation)
  const closeStart = () => {
    setStartModalOpen(!startModal);
  };

  // show the end modal to indicate the end location of the new agent;
  const showEnd = () => {
    setEndModalOpen(!endModal);
  };

  // select the priority of the agents;
  const selectPriority = (e) => {
    setPriority(e);
  };

  // select the algo to apply the planning; for now it is the CBS;
  const selectAlgo = (e) => {
    setAlgo(e);
  };

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
      <AgentTable agents={props.agents}></AgentTable>
      <button className={classes.btn} onClick={showPopup}>
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
      {addModal && (
        <div className={classes.modalAdd}>
          <div className={classes.overlay} onClick={showPopup}></div>
          <div className={classes.spacing}></div>
          <div className={classes.modal_content}>
            <img className={classes.image} src={props.robotImage} alt="logo" />
            <p className={classes.heading}>Agent {props.agentNo}</p>
            <div>
              <p className={classes.title}>Task Priority:</p>
              <DropdownButton
                alignRight
                title={
                  priority !== "" ? priority : "Choose the priority level..."
                }
                id="dropdown-menu-align-right"
                onSelect={selectPriority}
              >
                <Dropdown.Item eventKey="Low">Low</Dropdown.Item>
                <Dropdown.Item eventKey="Medium">Medium</Dropdown.Item>
                <Dropdown.Item eventKey="High">High</Dropdown.Item>
              </DropdownButton>
            </div>
            <div>
              <p className={classes.title}>Algorithm:</p>
              <DropdownButton
                alignRight
                title={algo !== "" ? algo : "Select Algorithm"}
                id="dropdown-menu-align-right"
                onSelect={selectAlgo}
              >
                <Dropdown.Item eventKey="Conflict Based Search">
                  Conflict Based Search
                </Dropdown.Item>
                <Dropdown.Item eventKey="A* Search">A* Search</Dropdown.Item>
              </DropdownButton>
            </div>

            <button className={classes.btn} onClick={showStart}>
              Set Start Point
            </button>
            <button className={classes.btn} onClick={showEnd}>
              Set Your Destination
            </button>
            <div></div>

            <button className={classes.btn} onClick={AddAgent}>
              Assign
            </button>
          </div>
        </div>
      )}
      {startModal && (
        <div className={classes.modalAdd}>
          <div className={classes.overlay} onClick={showStart}></div>
          <div className={classes.spacing}></div>
          <div className={classes.modal_content}>
            <div className={classes.map}>
              <Map
                destination="start"
                board={startBoard}
                gridMap={setStartBoard}
                onStart={setStartPoint}
                isChecked={startCheck}
                mapNo={props.mapNo}
                check={validateStart}
              ></Map>
              <button className={classes.btn} onClick={closeStart}>
                Set StartPoint
              </button>
            </div>
          </div>
        </div>
      )}
      {endModal && (
        <div className={classes.modalAdd}>
          <div className={classes.overlay} onClick={showEnd}></div>
          <div className={classes.spacing}></div>
          <div className={classes.modal_content}>
            <div className={classes.map}>
              <Map
                destination="end"
                board={endBoard}
                gridMap={setEndBoard}
                onEnd={setEndPoint}
                isChecked={endCheck}
                mapNo={props.mapNo}
                check={validateEnd}
              ></Map>
              <button className={classes.btn} onClick={showEnd}>
                Set Destination
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={{
        backgroundColor: props.value === "@" ? "black" : "white",
      }}
    >
      {props.value !== "." && props.value !== "@" ? props.value : null}
    </button>
  );
}

function Board(props) {
  function renderSquare(item, rowIndex, colIndex) {
    return (
      <Square onClick={() => props.onClick(rowIndex, colIndex)} value={item} />
    );
  }
  return (
    <div>
      {props.map.map((row, rowIndex) => {
        return (
          <div>
            {row.map((col, colIndex) => renderSquare(col, rowIndex, colIndex))}
          </div>
        );
      })}
    </div>
  );
}

function Map(props) {
  console.log("the map is", props.mapNo);
  let currentMap;
  switch (props.mapNo) {
    case "1":
      currentMap = maps.map1;
      break;
    case "2":
      currentMap = maps.map2;
      break;
    case "3":
      currentMap = maps.map3;
      break;
    case "4":
      currentMap = maps.map4;
      break;
    default:
      currentMap = maps.mapdefault;
      break;
  }
  const handleClick = (rowIndex, colIndex, check) => {
    let reset = currentMap;
    let boardCopy = [...reset];

    props.isChecked();
    boardCopy[rowIndex][colIndex] = "X";
    props.gridMap(boardCopy);
    if (props.destination === "start") {
      props.onStart(rowIndex, colIndex);
    } else {
      props.onEnd(rowIndex, colIndex);
    }
  };
  return (
    <div className="game">
      <div className="game-board">
        <Board
          map={props.board}
          onClick={(rowIndex, colIndex) =>
            handleClick(rowIndex, colIndex, props.check)
          }
        />
      </div>
    </div>
  );
}

export default Agents_Page;
