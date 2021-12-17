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

function Map({ gridMap, agents, mapping }) {
  const handleClick = (i) => {};
  return (
    <div className="game">
      <div className="game-board">
        <Board squares={gridMap} onClick={(i) => handleClick(i)} />
      </div>
    </div>
  );
}

export default Map;

// ========================================
