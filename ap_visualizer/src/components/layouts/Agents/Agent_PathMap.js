import React from "react";
import classes from "./Agent_PathMap.module.css";

function Agent_PathMap(props) {
  return (
    <>
      <div className={classes.map}>
        <Board map={props.map} agent={props.agent} />
      </div>
    </>
  );
}
function Board(props) {
  let backgroundColor;

  function renderSquare(rowIndex, colIndex) {
    if (props.map[rowIndex][colIndex] === "@") {
      backgroundColor = "black";
    } else {
      backgroundColor = "white";

      //pathway coloring if the algo is being run.
      if (props.agent.path.length !== 0) {
        for (let pathId = 1; pathId < props.agent.path.length - 1; pathId++) {
          if (
            rowIndex === props.agent.path[pathId].row &&
            colIndex === props.agent.path[pathId].col
          ) {
            backgroundColor = props.agent.pathColor;
          }
        }
      }
      if (
        props.agent.startPoint.row === rowIndex &&
        props.agent.startPoint.col === colIndex
      ) {
        backgroundColor = props.agent.robotColor;
      }
      if (
        props.agent.endPoint.row === rowIndex &&
        props.agent.endPoint.col === colIndex
      ) {
        backgroundColor = props.agent.endColor;
      }
    }
    return <Square backgroundColor={backgroundColor} />;
  }
  return (
    <div className={classes.map}>
      {props.map.map((row, rowIndex) => {
        return (
          <div>
            {row.map((col, colIndex) => renderSquare(rowIndex, colIndex))}
          </div>
        );
      })}
    </div>
  );
}
function Square(props) {
  return (
    <button
      className="square"
      style={{
        backgroundColor: props.backgroundColor ?? "white",
      }}
    ></button>
  );
}

export default Agent_PathMap;
