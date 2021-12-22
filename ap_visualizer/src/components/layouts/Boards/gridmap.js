import React from "react";
var assert = require('assert')

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Board(props) {
    console.log(props)
    let boards = []
    let rows = props.squares.length;
    let cols = props.squares[0].length;

    function renderSquare(id) {
        let x = Math.floor(id/cols)
        let y = id % cols
        assert(x < rows && y < cols);
        let val = props.squares[x][y];
        if (val != '@'){
            val = '.';
            console.log("Agent Paths: ")
            console.log(props.agentPaths);
            try {
                for (let agentId = 1; agentId <= props.agentPaths.length; agentId++) {
                    let time = Math.min(props.step, props.agentPaths[agentId - 1].length - 1);
                    console.log(x, y, time, props.agentPaths[agentId-1][time])
                    if (props.agentPaths[agentId - 1][time].x == x &&
                        props.agentPaths[agentId - 1][time].y == y) {
                        val = "S" + agentId;
                        break;
                    }
                }
            }
            catch (err){

            }
        }
        return <Square value={val} onClick={() => props.onClick(id)} />;
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

function Map({ gridMap, agents, mapping, step, agentPaths}) {
  const handleClick = (i) => {};
  return (
    <div className="game">
      <div className="game-board">
        <Board squares={gridMap}
               agents = {agents}
               mapping = {mapping}
               step = {step}
               agentPaths = {agentPaths}
               onClick={(i) => handleClick(i)} />
      </div>
    </div>
  );
}

export default Map;

// ========================================
