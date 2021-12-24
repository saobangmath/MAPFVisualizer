import React from "react";
import classes from "./Agent_Page.module.css";
import { useState } from "react";
import AgentTable from "./Agent_Table";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

import "bootstrap/dist/css/bootstrap.min.css";

function Agents_Page(props) {
  var [addModal, setModalIsOpen] = useState(false);
  var [startModal, setStartModalOpen] = useState(false);
  var [endModal, setEndModalOpen] = useState(false);
  var [priority, setPriority] = useState("");
  var [algo, setAlgo] = useState("");
  var [startCheck, setStartCheck] = useState(false);
  var [endCheck, setEndCheck] = useState(false);

  var [startBoard, setStartBoard] = useState(
    Array(5)
      .fill("")
      .map((row) => new Array(5).fill(null))
  );
  var [endBoard, setEndBoard] = useState(
    Array(5)
      .fill("")
      .map((row) => new Array(5).fill(null))
  );
  var [start, startPoint] = useState([]);
  var [end, endPoint] = useState([]);

  //Add Agent
  const AddAgent = () => {
    var agentNum = props.agentNo;
    var endColor = props.endColor;
    var robot = props.robotImage;
    var tempAgent = {
      height: 5,
      width: 5,
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

    props.agents.push(tempAgent);
    var lastAgent = props.agents.slice(-1);

    const boardCopy = [...props.gridMap];

    boardCopy[props.agents[props.agents.length - 1].startPoint.row[0]][
      props.agents[props.agents.length - 1].startPoint.col[0]
    ] = lastAgent;
    boardCopy[props.agents[props.agents.length - 1].endPoint.row[0]][
      props.agents[props.agents.length - 1].endPoint.col[0]
    ] = lastAgent;

    props.mapping(boardCopy);
    endBoard = new Array(5).fill("").map((row) => new Array(5).fill(null));
    startBoard = new Array(5).fill("").map((row) => new Array(5).fill(null));
    setStartBoard(startBoard);
    setEndBoard(endBoard);
    showPopup();
  };
  const showPopup = () => {
    setModalIsOpen(!addModal);
  };

  const setStartPoint = (row, col) => {
    // start.length = 0;
    var sPosition = { row: row, col: col };
    start.push(sPosition);
  };
  const setEndPoint = (row, col) => {
    // end.length = 0;
    var ePosition = { row: row, col: col };
    end.push(ePosition);
  };
  const showStart = () => {
    setStartModalOpen(!startModal);
  };
  const showEnd = () => {
    setEndCheck(!endCheck);
    setEndModalOpen(!endModal);
  };
  const selectPriority = (e) => {
    console.log(e);
    setPriority(e);
  };
  const selectAlgo = (e) => {
    console.log(e);
    setAlgo(e);
  };
  return (
    <>
      <AgentTable agents={props.agents}></AgentTable>
      <button className={classes.btn} onClick={showPopup}>
        Add
      </button>
      <button className={classes.btn} onClick={showPopup}>
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

            {/* <div className={classes.map}>
              <Map
                destination="start"
                board={startBoard}
                gridMap={setStartBoard}
                onStart={setStartPoint}
              ></Map>
            </div> */}

            <button className={classes.btn} onClick={showEnd}>
              Set Your Destination
            </button>

            {/* <div className={classes.map}>
              <Map
                destination="end"
                board={endBoard}
                gridMap={setEndBoard}
                onEnd={setEndPoint}
              ></Map>
            </div> */}
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

function Board({ map, onClick }) {
  function renderSquare(item, rowIndex, colIndex) {
    return <Square onClick={() => onClick(rowIndex, colIndex)} value={item} />;
  }
  return (
    <div>
      {map.map((row, rowIndex) => {
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
      onStart([rowIndex], [colIndex]);
    } else {
      onEnd([rowIndex], [colIndex]);
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
