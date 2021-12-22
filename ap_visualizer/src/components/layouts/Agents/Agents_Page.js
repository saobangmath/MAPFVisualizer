import React from "react";
import classes from "./Agent_Page.module.css";
import { useState } from "react";
import AgentTable from "./Agent_Table";
function Agents_Page(props) {
  var [addModal, setModalIsOpen] = useState(false);
  var [startBoard, setStartBoard] = useState(
    Array(5)
      .fill("")
      .map((row) => new Array(5).fill(""))
  );
  var [endBoard, setEndBoard] = useState(
    Array(5)
      .fill("")
      .map((row) => new Array(5).fill(""))
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
      startPoint: start,
      endPoint: end,
      gridMap: null,
      status: "Assigned",
      path: null,
      priority: null,
    };

    props.agents.push(tempAgent);
    var lastAgent = props.agents.slice(-1);

    const boardCopy = [...props.gridMap];
    if (
      boardCopy[lastAgent[0].startPoint[0].row[0]][
        lastAgent[0].startPoint[0].col[0]
      ] != null
    ) {
      boardCopy[lastAgent[0].startPoint[0].row[0]][
        lastAgent[0].startPoint[0].col[0]
      ].push(lastAgent);
    } else {
      boardCopy[lastAgent[0].startPoint[0].row[0]][
        lastAgent[0].startPoint[0].col[0]
      ] = lastAgent;
    }
    if (
      boardCopy[lastAgent[0].endPoint[0].row[0]][
        lastAgent[0].endPoint[0].col[0]
      ] != null
    ) {
      boardCopy[lastAgent[0].endPoint[0].row[0]][
        lastAgent[0].endPoint[0].col[0]
      ].push(lastAgent);
    } else {
      boardCopy[lastAgent[0].endPoint[0].row[0]][
        lastAgent[0].endPoint[0].col[0]
      ] = lastAgent;
    }
    console.log(
      "the end is",
      boardCopy[lastAgent[0].endPoint[0].row[0]][
        lastAgent[0].endPoint[0].col[0]
      ]
    );
    props.mapping(boardCopy);

    showPopup();
  };
  const showPopup = () => {
    setModalIsOpen(!addModal);
  };

  const setStartPoint = (row, col) => {
    var sPosition = { row: row, col: col };
    start.push(sPosition);
  };
  const setEndPoint = (row, col) => {
    var ePosition = { row: row, col: col };
    end.push(ePosition);
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

function Board({ board, onClick }) {
  function renderSquare(item, rowIndex, colIndex) {
    return <Square onClick={() => onClick(rowIndex, colIndex)} value={item} />;
  }
  return (
    <div>
      {board.map((row, rowIndex) => {
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
          board={board}
          onClick={(rowIndex, colIndex) => handleClick(rowIndex, colIndex)}
        />
      </div>
    </div>
  );
}

export default Agents_Page;
