import React from "react";
import { pColors } from "../../../Constants";
import { maps } from "../../../maps";

/** props : {robotImage={props.robotImage},
 *         onClick={() => props.onClick(rowIndex, colIndex)},
 *         row={rowIndex},
 *         col={colIndex},
 *         value={val}}
 */
function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={{
        backgroundColor: props.backgroundColor,
      }}
    >
      {props.robotImage != null ? ( // in case there is a robot at that position;
        <img
          src={props.robotImage}
          style={{
            height: "80%",
            width: "60%",
            paddingBottom: "4px",
          }}
          alt="logo"
        />
      ) : null}
    </button>
  );
}

function Game(props) {
  const handleClick = (i) => {};
  return (
    <div className="game">
      <div className="game-board">
        <Board
          map={props.gridMap}
          agents={props.agents}
          mapping={props.mapping}
          step={props.step}
          agentPaths={props.agentPaths}
          onClick={(i) => handleClick(i)}
        />
      </div>
    </div>
  );
}

function Board(props) {
  function renderSquare(rowIndex, colIndex) {
    let agentId = -1; // at step i, if there is an agent at the square -> the agentId != -1 else it is equal to -1;
    let no_agent = Object.keys(props.agents).length;
    let backgroundColor;
    if (Object.keys(props.agentPaths).length > 0) {
      // the CBS algorithm has been run;
      for (let id = 1; id <= no_agent; id++) {
        let cell =
          props.agentPaths[id][
            Math.min(props.step, props.agentPaths[id].length - 1)
          ];
        if (cell.x === rowIndex && cell.y === colIndex) {
          agentId = id;
          break;
        }
      }
    } else {
      //When CBS is not run yet
      for (let index = 1; index <= Object.keys(props.agents).length; index++) {
        if (
          props.agents[index].startPoint.row === rowIndex &&
          props.agents[index].startPoint.col === colIndex
        ) {
          agentId = props.agents[index].agentId;
        }
      }
    }

    if (props.map[rowIndex][colIndex] === "@") {
      backgroundColor = "black";
    } else {
      backgroundColor = "white";
      // check if the square is the destination of any robots -> change it background color accordingly
      for (let id = 1; id <= no_agent; id++) {
        if (
          props.agents[id].endPoint.row === rowIndex &&
          props.agents[id].endPoint.col === colIndex
        ) {
          backgroundColor = pColors[id];
        }
        //pathway coloring if the algo is being run.
        if (props.agents[id].path.length !== 0) {
          for (
            let pathId = 1;
            pathId < props.agents[id].path.length - 1;
            pathId++
          ) {
            if (
              rowIndex === props.agents[id].path[pathId].row &&
              colIndex === props.agents[id].path[pathId].col
            ) {
              backgroundColor = props.agents[id].pathColor;
            }
          }
        }
      }
    }

    return (
      <Square
        robotImage={agentId !== -1 ? props.agents[agentId].img : null}
        onClick={() => props.onClick(rowIndex, colIndex)}
        row={rowIndex}
        col={colIndex}
        backgroundColor={backgroundColor}
      />
    );
  }
  return (
    <div>
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

export default Game;
