import React from "react";

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={{
        backgroundColor:
          props.value != null
            ? props.value[props.value.length - 1].endPoint.col[0] ===
                props.col &&
              props.value[props.value.length - 1].endPoint.row[0] === props.row
              ? props.value[props.value.length - 1].endColor
              : null
            : null,
      }}
    >
      {props.value != null ? (
        props.value[props.value.length - 1].startPoint.col[0] === props.col &&
        props.value[props.value.length - 1].startPoint.row[0] === props.row ? (
          <img
            src={props.value[props.value.length - 1].img}
            style={{
              paddingTop: "15%",
              height: "80%",
              width: "60%",
            }}
            alt="logo"
          />
        ) : null
      ) : null}
    </button>
  );
}

function Board({ map, onClick, robotImage }) {
  function renderSquare(item, rowIndex, colIndex) {
    return (
      <Square
        robotImage={robotImage}
        onClick={() => onClick(rowIndex, colIndex)}
        row={rowIndex}
        col={colIndex}
        value={item}
      />
    );
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

function Map({ gridMap, agents, mapping, robotImage }) {
  const handleClick = (rowIndex, colIndex) => {};
  return (
    <div className="game">
      <div className="game-board">
        <Board
          map={gridMap}
          robotImage={robotImage}
          onClick={(rowIndex, colIndex) => handleClick(rowIndex, colIndex)}
        />
      </div>
    </div>
  );
}

export default Map;

// ========================================
