import React from "react";
import { pColors, rColors } from "../../../Constants";
import { maps } from "../../../mapconfig/maps";
import { clone2DArray } from "../../utility/Utility";

function CloneGridmap(props) {
  let index = props.mapNo;

  if (index < 0) {
    index = 4;
  } else if (index > 4) {
    index = 0;
  }
  let updatedGridMap = null;
  updatedGridMap = clone2DArray(maps[index]);
  return <Board map={updatedGridMap} />;
}
function Board(props) {
  let backgroundColor;

  function renderSquare(rowIndex, colIndex) {
    if (props.map[rowIndex][colIndex] === "@") {
      backgroundColor = "black";
    } else {
      backgroundColor = "white";
    }
    return <Square backgroundColor={backgroundColor} />;
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

export default CloneGridmap;
