import React from "react";
var assert = require('assert')

// props : {robotImage={props.robotImage},
//         onClick={() => props.onClick(rowIndex, colIndex)},
//         row={rowIndex},
//         col={colIndex},
//         value={val}}
function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={{
        backgroundColor:
          props.value != null
            ? props.value[props.value.length - 1].endPoint.col ===
                props.col &&
              props.value[props.value.length - 1].endPoint.row === props.row
              ? props.value[props.value.length - 1].endColor
              : null
            : null,
      }}
    >
      {props.value != null ? (
        props.value[props.value.length - 1].startPoint.col === props.col &&
        props.value[props.value.length - 1].startPoint.row === props.row ? (
          <img
            src={props.value[props.value.length - 1].img}
            style={{
              height: "80%",
              width: "60%",
              paddingBottom: "4px",
            }}
            alt="logo"
          />
        ) : null
      ) : null}
    </button>
  );
}

// function Board(props) {
//     console.log(props)
//     let boards = []
//     let rows = props.squares.length;
//     let cols = props.squares[0].length;
//
//     function renderSquare(id) {
//         let x = Math.floor(id/cols)
//         let y = id % cols
//         assert(x < rows && y < cols);
//         let val = props.squares[x][y];
//         if (val != '@'){
//             val = '.';
//             console.log("Agent Paths: ")
//             console.log(props.agentPaths);
//             try {
//                 for (let agentId = 1; agentId <= props.agentPaths.length; agentId++) {
//                     let time = Math.min(props.step, props.agentPaths[agentId - 1].length - 1);
//                     console.log(x, y, time, props.agentPaths[agentId-1][time])
//                     if (props.agentPaths[agentId - 1][time].x == x &&
//                         props.agentPaths[agentId - 1][time].y == y) {
//                         val = "S" + agentId;
//                         break;
//                     }
//                 }
//             }
//             catch (err){
//
//             }
//         }
//         return <Square value={val} onClick={() => props.onClick(id)} />;
//     }
//     for (let row = 0; row < rows; row++){
//       boards.push(<div className="board-row"/>)
//       for (let col = 0; col < cols; col++){
//           boards.push(renderSquare(row * cols + col))
//       }
//       boards.push(<div/>)
//     }
//     return (
//      <div>
//         {boards}
//      </div>
//    );
// }

function Map(props) {
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
               robotImage= {props.robotImage}
        />
      </div>
    </div>
  )
}

function Board(props) {
  function renderSquare(col, rowIndex, colIndex) {
    // let val = props.squares[rowIndex][colIndex]
    // if (val != '@'){ // not an obstacle
    //     console.log("Agent Paths: ")
    //     console.log(props.agentPaths);
    //     try {
    //         for (let agentId = 1; agentId <= props.agentPaths.length; agentId++) {
    //             let time = Math.min(props.step, props.agentPaths[agentId - 1].length - 1);
    //             if (props.agentPaths[agentId - 1][time].x == rowIndex &&
    //                 props.agentPaths[agentId - 1][time].y == colIndex) {
    //                 val = "S" + agentId;
    //                 break;
    //             }
    //         }
    //     }
    //     catch (err){
    //
    //     }
    // }
    return (
      <Square
        robotImage={props.robotImage}
        onClick={() => props.onClick(rowIndex, colIndex)}
        row={rowIndex}
        col={colIndex}
        value={col}
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

export default Map;