import React from "react";
import classes from "./Landing_Page.module.css";
import { useState } from "react";

function Agents_page(props) {
  var [addModal, setModalIsOpen] = useState(false);
  var [startBoard, setStartBoard] = useState(Array(9).fill(null));
  var [endBoard, setEndBoard] = useState(Array(9).fill(null));
  var [start, startPoint] = useState("");
  var [end, endPoint] = useState("");
  var [agents, setAgentList] = useState([]);

  // var [agentNo, setAgentNo] = useState("");
  //Add Agent
  const AddAgent = () => {
    var agentNum = props.agentNo;

    var agent = {
      height: 5,
      width: 5,
      agentNo: agentNum,
      startPoint: start,
      endPoint: end,
    };
    agents.push(agent);
    showPopup();
    console.log(agents);
  };
  const showPopup = () => {
    setModalIsOpen(!addModal);
  };

  const setStartPoint = (point) => {
    startPoint(point);
  };
  const setEndPoint = (point) => {
    endPoint(point);
  };

  return (
    <>
      <button className={classes.btn} onClick={showPopup}>
        Add
      </button>
      {addModal && (
        <div className={classes.modalAdd}>
          <div className={classes.overlay} onClick={showPopup}></div>
          <div className={classes.spacing}></div>
          <div className={classes.modal_content}>
            <img src={props.robotImage} alt="logo" />
            <h1>Agent {props.agentNo}</h1>
            <p>Start Point:</p>
            <Map
              destination="start"
              board={startBoard}
              gridMap={setStartBoard}
              onStart={setStartPoint}
            ></Map>
            <p>End Point:</p>
            <Map
              destination="end"
              board={endBoard}
              gridMap={setEndBoard}
              onEnd={setEndPoint}
            ></Map>
            <button onClick={AddAgent}>Assign</button>
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
  function renderSquare(i) {
    return <Square value={props.squares[i]} onClick={() => props.onClick(i)} />;
  }
  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
        {renderSquare(3)}
        {renderSquare(4)}
      </div>
      <div className="board-row">
        {renderSquare(5)}
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
        {renderSquare(9)}
      </div>
      <div className="board-row">
        {renderSquare(10)}
        {renderSquare(11)}
        {renderSquare(12)}
        {renderSquare(13)}
        {renderSquare(14)}
      </div>
      <div className="board-row">
        {renderSquare(15)}
        {renderSquare(16)}
        {renderSquare(17)}
        {renderSquare(18)}
        {renderSquare(19)}
      </div>
      <div className="board-row">
        {renderSquare(20)}
        {renderSquare(21)}
        {renderSquare(22)}
        {renderSquare(23)}
        {renderSquare(24)}
      </div>
    </div>
  );
}
function Map({ destination, board, gridMap, onStart, onEnd }) {
  const handleClick = (i) => {
    const boardCopy = [...board];
    for (var j = 0; j < boardCopy.length; j++) {
      boardCopy[j] = null;
    }
    boardCopy[i] = i;
    gridMap(boardCopy);
    if (destination === "start") {
      onStart(i);
    } else {
      onEnd(i);
    }
  };
  return (
    <div className="game">
      <div className="game-board">
        <Board squares={board} onClick={(i) => handleClick(i)} />
      </div>
    </div>
  );
}

export default Agents_page;
