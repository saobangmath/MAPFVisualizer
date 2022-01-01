import React from "react";
import {pColors, robots} from '../../../utility/Constants';

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
        backgroundColor: props.backgroundColor
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
          />) : null
      }
    </button>
  );
}

function Game(props) {
  const handleClick = (i) => {};
  return (
    <div className="game">
      <div className="game-board">
        <Board map={props.gridMap}
               agents = {props.agents}
               mapping = {props.mapping}
               step = {props.step}
               agentPaths = {props.agentPaths}
               onClick={(i) => handleClick(i)}
        />
      </div>
    </div>
  )
}

function Board(props) {
  function renderSquare(rowIndex, colIndex) {
    let agentId = -1; // at step i, if there is an agent at the square -> the agentId != -1 else it is equal to -1;
    let no_agent = Object.keys(props.agents).length;
    if (Object.keys(props.agentPaths).length > 0) { // the CBS algorithm has been run;
        console.log(props.agentPaths);
        console.log(no_agent)
        for (let id = 1; id <= no_agent; id++) {
            console.log("id " + id + ": ");
            console.log(props.agentPaths[id]);
            let cell = props.agentPaths[id][Math.min(props.step, props.agentPaths[id].length - 1)];
            if (cell.x == rowIndex && cell.y == colIndex) {
                agentId = id;
                break;
            }
        }
    }
    let backgroundColor="white";
    // check if the square is the destination of any robots -> change it background color accordingly
    for (let id = 1; id <= no_agent; id++){
      if (props.agents[id].endPoint.row == rowIndex &&
       props.agents[id].endPoint.col == colIndex){
       backgroundColor = pColors[id];
       break;
      }
    }
    return (
      <Square
        robotImage={agentId!=-1? robots[agentId] : null}
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