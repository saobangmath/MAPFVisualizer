import React from "react";
import classes from "./Agent_Page.module.css";
import { useState } from "react";
import AgentTable from "./Agent_Table";
function Agents_Page(props) {
  var [addModal, setModalIsOpen] = useState(false);
  var [startBoard, setStartBoard] = useState(props.gridMap);
  var [endBoard, setEndBoard] = useState(props.gridMap);
  var [start, startPoint] = useState("");
  var [end, endPoint] = useState("");

  //Add Agent
  const AddAgent = () => {
    var agentNum = props.agentNo;

    var agent = {
      height: props.gridMap.length,
      width: props.gridMap[0].length,
      agentNo: agentNum,
      startPoint: start,
      endPoint: end,
      gridMap: null,
      status: null,
      path: null,
      priority: null,
    };
    props.agents.push(agent);

    const boardCopy = [...props.gridMap];
    for (var index = 0; index < props.agents.length; index++) {
      boardCopy[Math.floor(props.agents[index].startPoint / boardCopy[0].length)][props.agents[index].startPoint % boardCopy[0].length] = "S" + (index + 1);
      boardCopy[Math.floor(props.agents[index].endPoint / boardCopy[0].length)][props.agents[index].endPoint % boardCopy[0].length] = "E" + (index + 1);
    }
    props.mapping(boardCopy);
    showPopup();
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

  const runCBSAlgo = () => {
    console.log(props.agents)
    console.log(props.gridMap)
    for (let row = 0; row < props.gridMap.length; row++){
        for (let col = 0; col < props.gridMap[0].length; col++){
            props.gridMap[row][col] = '.'
        }
    }
    props.mapping(props.gridMap)
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
    let boards = []
    let rows = props.squares.length;
    let cols = props.squares[0].length;

    function renderSquare(id) {
        let x = Math.floor(id/cols)
        let y = id % cols
        return <Square value={props.squares[x][y]} onClick={() => props.onClick(id)} />;
    }
    for (let row = 0; row < rows; row++){
        boards.push(<div className="board-row"/>)
        for (let col = 0; col < cols; col++){
            boards.push(renderSquare(row * cols + col))
        }
        boards.push(<div/>)
    }
    return (
        <div>
            {boards}
        </div>
    );
}
function Map({ destination, board, gridMap, onStart, onEnd, mainMap}) {
  const handleClick = (i) => {
    const boardCopy = [];
    for (let row = 0; row < board.length; row++){
        boardCopy.push([])
        for (let col = 0; col < board[0].length; col++){
            boardCopy[row].push(board[row][col])
        }
    }
    let x = Math.floor(i / board[0].length);
    let y = i % board[0].length
    console.log(x, y)
    if (destination == "start") {
        boardCopy[x][y] = "S";
    }
    else {
        boardCopy[x][y] = "E"
    }
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

export default Agents_Page;
