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

  let [startBoard, setStartBoard] = useState(maps.mapdefault);

  let [endBoard, setEndBoard] = useState(maps.mapdefault);

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
    let newMap = resetMap(boardCopy);

    setStartBoard(newMap);
    setEndBoard(newMap);
    showPopup();
  };
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
  const setStartPoint = (row, col, check) => {
    let sPosition = { row: row, col: col };
    if (!check) {
      start.push(sPosition);
    } else {
      //remove the previous clicked data.
      start.pop();
      start.push(sPosition);
    }
  };

  // set end location for the new agent;
  const setEndPoint = (row, col, check) => {
    let ePosition = { row: row, col: col };
    if (!check) {
      end.push(ePosition);
    } else {
      //remove the previous clicked data.
      end.pop();
      end.push(ePosition);
    }
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
                originalMap={props.originalMap}
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
                originalMap={props.originalMap}
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
      {/* if the sqaure value has an agents */}
      {typeof props.value === "object" ||
      props.value === "@" ||
      props.value === "."
        ? null
        : props.value}
    </button>
  );
}

function Board(props) {
  function renderSquare(item, rowIndex, colIndex) {
    return (
      <Square
        onClick={() => props.onClick(rowIndex, colIndex)}
        value={item}
        rowIndex={rowIndex}
        colIndex={colIndex}
        isChecked={props.isChecked}
      />
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
function resetMap(map) {
  for (var i = 0; i < Object.keys(map).length; i++) {
    for (var j = 0; j < Object.keys(map).length; j++) {
      if (map[i][j] === "X") {
        map[i][j] = ".";
      }
    }
  }
  return map;
}
function Map(props) {
  const handleClick = (rowIndex, colIndex, check) => {
    const board = props.board;
    let boardCopy = [...board];
    if (boardCopy[rowIndex][colIndex] !== "@") {
      props.isChecked();

      boardCopy = resetMap(boardCopy);
      boardCopy[rowIndex][colIndex] = "X";
      props.gridMap(boardCopy);
      if (props.destination === "start") {
        props.onStart(rowIndex, colIndex, check);
      } else {
        props.onEnd(rowIndex, colIndex, check);
      }
    } else {
      alert("Please do not choose the obstacles.");
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
          isChecked={props.check}
        />
      </div>
    </div>
  );
}

export default Agents_Page;
