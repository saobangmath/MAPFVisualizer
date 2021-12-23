import React from "react";
import classes from "./Agent_Page.module.css";
import { useState } from "react";
import AgentTable from "./Agent_Table";
function Agents_Page(props) {
  var [addModal, setModalIsOpen] = useState(false);
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
    // if (
    //   boardCopy[lastAgent[0].startPoint[0].row[0]][
    //     lastAgent[0].startPoint[0].col[0]
    //   ] != null
    // ) {
    //   boardCopy[lastAgent[0].startPoint[0].row[0]][
    //     lastAgent[0].startPoint[0].col[0]
    //   ].push(lastAgent);
    // } else {
    //   boardCopy[lastAgent[0].startPoint[0].row[0]][
    //     lastAgent[0].startPoint[0].col[0]
    //   ] = lastAgent;
    // }
    // if (
    //   boardCopy[lastAgent[0].endPoint[0].row[0]][
    //     lastAgent[0].endPoint[0].col[0]
    //   ] != null
    // ) {
    //   boardCopy[lastAgent[0].endPoint[0].row[0]][
    //     lastAgent[0].endPoint[0].col[0]
    //   ].push(lastAgent);
    // } else {
    //   boardCopy[lastAgent[0].endPoint[0].row[0]][
    //     lastAgent[0].endPoint[0].col[0]
    //   ] = lastAgent;
    // }
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
            <p className={classes.title}>Task Priority:</p>
            <p className={classes.title}>Algorithm:</p>
            <p className={classes.title}>Start Position:</p>
            <div className={classes.map}>
              <Map
                destination="start"
                board={startBoard}
                gridMap={setStartBoard}
                onStart={setStartPoint}
              ></Map>
            </div>

            <p className={classes.title}>Destination:</p>
            <div className={classes.map}>
              <Map
                destination="end"
                board={endBoard}
                gridMap={setEndBoard}
                onEnd={setEndPoint}
              ></Map>
            </div>

            <button className={classes.btn} onClick={AddAgent}>
              Assign
            </button>
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
