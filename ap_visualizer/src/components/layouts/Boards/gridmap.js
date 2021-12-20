import React from "react";
import agent1 from "C:/Users/User/Documents/NTU  Year 4 sem1/NTU FYP/MAPFVisualizer/ap_visualizer/src/images/agent1.png";
import agent2 from "C:/Users/User/Documents/NTU  Year 4 sem1/NTU FYP/MAPFVisualizer/ap_visualizer/src/images/agent2.png";
import agent3 from "C:/Users/User/Documents/NTU  Year 4 sem1/NTU FYP/MAPFVisualizer/ap_visualizer/src/images/agent3.png";

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      background-color="#ff5c5c"
    >
      {props.value != null ? (
        <img
          src={agent1}
          style={{
            paddingTop: "15%",
            height: "80%",
            width: "60%",
          }}
          alt="logo"
        />
      ) : (
        props.value
      )}
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
