import React from "react";
import classes from "./Agent_Page.module.css";
import { useState } from "react";
import AgentTable from "./Agent_Table";

import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

import "bootstrap/dist/css/bootstrap.min.css";

const map = require('../../../pathFinding/Map');
const Cell = require('../../../pathFinding/Cell');
const HighLevelSolver = require('../../../pathFinding/cbs/highLevelSolver');

// function Agents_Page(props) {
//   var [addModal, setModalIsOpen] = useState(false);
//   var [startBoard, setStartBoard] = useState(props.gridMap);
//   var [endBoard, setEndBoard] = useState(props.gridMap);
//   var [start, startPoint] = useState("");
//   var [end, endPoint] = useState("");
// =======

function Agents_Page(props) {
  var [addModal, setModalIsOpen] = useState(false);
  var [startModal, setStartModalOpen] = useState(false);
  var [endModal, setEndModalOpen] = useState(false);
  var [priority, setPriority] = useState("");
  var [algo, setAlgo] = useState("");
  var [startCheck, setStartCheck] = useState(false);
  var [endCheck, setEndCheck] = useState(false);

  var [startBoard, setStartBoard] = useState(
      Array(props.gridMap.length)
          .fill(null)
          .map((row) => new Array(props.gridMap[0].length).fill(null))
  );
  var [endBoard, setEndBoard] = useState(
      Array(props.gridMap.length)
          .fill(null)
          .map((row) => new Array(props.gridMap[0].length).fill(null))
  );

  var [start, startPoint] = useState([]);
  var [end, endPoint] = useState([]);

  //Add Agent
  const AddAgent = () => {
    let agentNum = props.agentNo;
    let endColor = props.endColor;
    let robot = props.robotImage;
    let agent = {
      height: props.gridMap.length,
      width: props.gridMap[0].length,
      img: robot,
      endColor: endColor,
      agentNo: agentNum,
      startPoint: start[start.length - 1],
      endPoint: end[end.length - 1],
      gridMap: null,
      status: "Assigned",
      path: null,
      priority: null,
    };
    props.agents.push(agent);
    props.setAgentPaths()
    console.log(agent)
    const boardCopy = [...props.gridMap];

    let lastAgent = props.agents.slice(-1);

    boardCopy[props.agents[props.agents.length - 1].startPoint.row][
      props.agents[props.agents.length - 1].startPoint.col[0]] = lastAgent;

    boardCopy[props.agents[props.agents.length - 1].endPoint.row][
      props.agents[props.agents.length - 1].endPoint.col] = lastAgent;

    props.mapping(boardCopy);
    endBoard = new Array(props.gridMap.length).fill("").map((row) => new Array(props.gridMap[0].length).fill(null));
    startBoard = new Array(props.gridMap.length).fill("").map((row) => new Array(props.gridMap[0].length).fill(null));
    setStartBoard(startBoard);
    setEndBoard(endBoard);
    showPopup();
  };

  const showPopup = () => {
    setModalIsOpen(!addModal);
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

  // TODO add comment
  const showStart = () => {
    setStartModalOpen(!startModal);
  };

  // TODO add comment
  const showEnd = () => {
    setEndCheck(!endCheck);
    setEndModalOpen(!endModal);
  };

  // TODO add comment
  const selectPriority = (e) => {
    console.log(e);
    setPriority(e);
  };

  // select the algo to apply the planning; for now it is the CBS;
  const selectAlgo = (e) => {
    console.log(e);
    setAlgo(e);
  };

  // run the CBS algo with the added agents;
  // TODO refactor tomorrow;
  const runCBSAlgo = () => {
      let mp = new map();
      mp.height = props.gridMap.length;
      mp.width = props.gridMap[0].length;
      mp.grid = [...props.gridMap];
      mp.no_agents = props.agents.length;
      if (mp.no_agents == 0) {
          alert("There is no agents to run the CBS!");
          return;
      }
      // add agents in props to map agents with the format used in the cbs;
      for (let i = 0; i < props.agents.length; i++){
          let start_row = props.agents[i].startPoint.row;
          let start_col = props.agents[i].startPoint.col;
          let end_row = props.agents[i].endPoint.row;
          let end_col = props.agents[i].endPoint.col;
          let agent = {"START" : new Cell(start_row, start_col),
                       "DEST" : new Cell(end_row, end_col)};
          mp.agents[i + 1] = agent;
      }
      let paths = new HighLevelSolver().solve(mp);
      console.log(paths);
      if (paths.length == 0){
          alert("No possble plan found!");
          return;
      }
      props.setStep(0)
      props.setAgentPaths(paths); // TODO: set the path here for each agents;
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
              ></Map>
              <button className={classes.btn} onClick={showStart}>
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
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Board(props) {
  function renderSquare(item, rowIndex, colIndex) {
    return <Square onClick={() => props.onClick(rowIndex, colIndex)} value={item} />;
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

function Map({ destination, board, gridMap, onStart, onEnd, mainMap }) {
  const handleClick = (rowIndex, colIndex) => {
    const boardCopy = [...board];
    boardCopy[rowIndex][colIndex] = "X";
    gridMap(boardCopy);
    if (destination === "start") {
      onStart(rowIndex, colIndex);
    } else {
      onEnd(rowIndex, colIndex);
    }
  };
  return (
    <div className="game">
      <div className="game-board">
        <Board
          map={board}
          onClick={(rowIndex, colIndex) => handleClick(rowIndex, colIndex)}
        />
      </div>
    </div>
  );
}

export default Agents_Page;
