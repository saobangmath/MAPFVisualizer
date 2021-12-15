import React from "react";
import classes from "./Landing_Page.module.css";
import { useState } from "react";

function Agents_page(props) {
  var [addModal, setModalIsOpen] = useState(false);
  var [value, setValue] = useState("");
  var [startPoint, setStartPoint] = useState(null);
  var [endPoint, setEndPoint] = useState(null);
  const addAgents = () => {
    setModalIsOpen(!addModal);
  };
  var agentArray = [];

  const handleStartPoint = (point) => {
    // setStartPoint(startPoint);
    console.log("the start point is ", startPoint.setStartPoint);
  };
  const handleEndPoint = () => {
    setEndPoint(value);
    console.log("the end point is ", endPoint);
  };

  return (
    <>
      <button className={classes.btn} onClick={addAgents}>
        Add
      </button>
      <button className={classes.btn} onClick={showAgent(agentArray)}>
        joke
      </button>
      {addModal && (
        <div className={classes.modalAdd}>
          <div className={classes.overlay} onClick={addAgents}></div>
          <div className={classes.spacing}></div>
          <div className={classes.modal_content}>
            <img src={props.robotImage} alt="logo" />
            <h1>Agent {props.agentNo}</h1>
            <p>Start Point:</p>
            <Map
              destination="start"
              gridMap=""
              startPoint={() => handleStartPoint}
            ></Map>
            <p>End Point:</p>

            <Map
              destination="end"
              gridMap=""
              endPoint={() => handleEndPoint}
            ></Map>
            <button
              onClick={(createAgent(agentArray, props.agentNo), addAgents)}
            >
              Assign
            </button>
          </div>
        </div>
      )}
    </>
  );
}
function showAgent(agentArray) {
  for (var j = 0; j < agentArray.length; j++) {
    // console.log(agentArray[j]);
  }
  // console.log("done");
}
function createAgent(agentArray, agentNo, startPoint, endPoint) {
  // var map = [];

  var agent = {
    height: 5,
    width: 5,
    agentNo: agentNo,
    startPoint: startPoint,
    endPoint: endPoint,
  };
  agentArray.push(agent);
  // console.log("push");
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
function Map(props) {
  var [board, setBoard] = useState(Array(9).fill(null));
  const handleClick = (i) => {
    const boardCopy = [...board];
    for (var j = 0; j < boardCopy.length; j++) {
      boardCopy[j] = null;
    }
    boardCopy[i] = i;
    setBoard(boardCopy);
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
