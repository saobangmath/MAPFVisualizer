import React from "react";
import { useState } from "react";
import styles from "./Agent_Table.module.css";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { maps } from "../../../maps";
import "bootstrap/dist/css/bootstrap.min.css";
import classes from "./Agent_Page.module.css";

const Agent_Table = (props) => {
  let [addModal, setModalIsOpen] = useState(false);
  let [startModal, setStartModalOpen] = useState(false);
  let [endModal, setEndModalOpen] = useState(false);
  let [priority, setPriority] = useState("");
  let [algo, setAlgo] = useState("");
  let [validateStart, hasStart] = useState(false); //validate only 1 startpoint
  let [validateEnd, hasEnd] = useState(false); //validate only 1 endpoint
  let [startBoard, setStartBoard] = useState(maps.mapdefault);
  let [endBoard, setEndBoard] = useState(maps.mapdefault);
  let [start, startPoint] = useState([]); //the start point of the robot
  let [end, endPoint] = useState([]); //the end point of the robot
  var [selectedAgent, setSelectedAgent] = useState();
  const showPopup = (agent) => {
    console.log("agents", agent);
    setSelectedAgent(agent);
    console.log("first", selectedAgent);
    setModalIsOpen(!addModal);
  };
  const closePopup = () => {
    setModalIsOpen(!addModal);
  };
  const startCheck = () => {
    hasStart(!validateStart);
  };
  const endCheck = () => {
    hasEnd(!validateEnd);
  };
  // set start location for the new agent;
  const setStartPoint = (row, col, check) => {
    let sPosition = { row: row, col: col };
    if (!check) {
      start.push(sPosition);
    } else {
      //remove the previous clicked data.
      start.pop();
      start.push(sPosition);
    }
  };

  // set end location for the new agent;
  const setEndPoint = (row, col, check) => {
    let ePosition = { row: row, col: col };
    if (!check) {
      end.push(ePosition);
    } else {
      //remove the previous clicked data.
      end.pop();
      end.push(ePosition);
    }
  };
  // show the start modal to indicate the start location of the new agent;
  const showStart = () => {
    setStartModalOpen(!startModal);
  };
  //close the start modal using the assign button(future implementation for validation)
  const closeStart = () => {
    var updatedAgent = selectedAgent;

    updatedAgent.startPoint = start[start.length - 1];
    updatedAgent.endPoint = end[end.length - 1];
    setSelectedAgent(updatedAgent);
    props.agents[updatedAgent.agentId] = updatedAgent;
    props.setAgentsList(props.agents);
    setStartModalOpen(!startModal);
    const boardCopy = [...startBoard];

    startBoard[props.agents[updatedAgent.agentId].startPoint.row][
      props.agents[updatedAgent.agentId].startPoint.col
    ] = updatedAgent;

    setStartBoard(boardCopy);
    setStartModalOpen(!startModal);
  };

  // show the end modal to indicate the end location of the new agent;
  const showEnd = () => {
    setEndModalOpen(!endModal);
  };
  const closeEnd = () => {
    var updatedAgent = selectedAgent;
    updatedAgent.endPoint = end[end.length - 1];
    setSelectedAgent(updatedAgent);
    props.agents[updatedAgent.agentId] = updatedAgent;
    props.setAgentsList(props.agents);
    const boardCopy = [...endBoard];
    boardCopy[props.agents[updatedAgent.agentId].endPoint.row][
      props.agents[updatedAgent.agentId].endPoint.col
    ] = updatedAgent;
    setEndBoard(boardCopy);
    setEndModalOpen(!endModal);
  };

  // select the priority of the agents;
  const selectPriority = (e) => {
    setPriority(e);
  };

  // select the algo to apply the planning; for now it is the CBS;
  const selectAlgo = (e) => {
    setAlgo(e);
  };
  const AddAgent = () => {
    // update the selectedAgent
    var updatedAgent = selectedAgent;
    updatedAgent.status = "Assigned";
    props.agents[updatedAgent.agentId] = updatedAgent;
    props.setAgentsList(props.agents);
    props.setAgentPaths([]); // reset the agent path from the previous CBS algo run;

    // Update the main map in gridMap.js
    const boardCopy = [...props.gridMap];
    let lastAgent = selectedAgent;
    boardCopy[props.agents[updatedAgent.agentId].startPoint.row][
      props.agents[updatedAgent.agentId].startPoint.col
    ] = lastAgent;

    boardCopy[props.agents[updatedAgent.agentId].endPoint.row][
      props.agents[updatedAgent.agentId].endPoint.col
    ] = lastAgent;

    props.mapping(boardCopy);
    closePopup();
  };

  return (
    <>
      <table id="agentTable" className={styles.styledTable}>
        <thead>
          <tr>
            <th>Robot No.</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(props.agents).map((key, index) => (
            <tr key={key}>
              <td>
                <p>
                  Robot {key}
                  {
                    <img
                      className={styles.image}
                      src={props.agents[key].img}
                      alt="logo"
                    />
                  }
                </p>
              </td>
              <td>
                <button className={styles.statusBtn}>
                  {props.agents[key].status}
                </button>
              </td>
              <td>
                <button
                  className={styles.actionBtn}
                  onClick={() => showPopup(props.agents[key])}
                >
                  Assign
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {addModal && (
        <div className={classes.modalAdd}>
          <div className={classes.overlay} onClick={showPopup}></div>
          <div className={classes.spacing}></div>
          <div className={classes.modal_content}>
            <img className={classes.image} src={selectedAgent.img} alt="logo" />
            <p className={classes.heading}>Agent {selectedAgent.agentId}</p>
            <div>
              <p className={classes.title}>Task Priority:</p>
              <DropdownButton
                alignRight
                title={
                  priority !== "" ? priority : "Choose the priority level..."
                }
                id="dropdown-menu-align-right"
                onSelect={selectPriority}
              >
                <Dropdown.Item eventKey="Low">Low</Dropdown.Item>
                <Dropdown.Item eventKey="Medium">Medium</Dropdown.Item>
                <Dropdown.Item eventKey="High">High</Dropdown.Item>
              </DropdownButton>
            </div>
            <div>
              <p className={classes.title}>Algorithm:</p>
              <DropdownButton
                alignRight
                title={algo !== "" ? algo : "Select Algorithm"}
                id="dropdown-menu-align-right"
                onSelect={selectAlgo}
              >
                <Dropdown.Item eventKey="Conflict Based Search">
                  Conflict Based Search
                </Dropdown.Item>
                <Dropdown.Item eventKey="A* Search">A* Search</Dropdown.Item>
              </DropdownButton>
            </div>

            <button className={classes.btn} onClick={showStart}>
              Set Start Point
            </button>
            <button className={classes.btn} onClick={showEnd}>
              Set Your Destination
            </button>
            <div></div>

            <button className={classes.btn} onClick={AddAgent}>
              Assign
            </button>
          </div>
        </div>
      )}
      {startModal && (
        <div className={classes.modalAdd}>
          <div className={classes.overlay} onClick={showStart}></div>
          <div className={classes.spacing}></div>
          <div className={classes.modal_content}>
            <div className={classes.map}>
              <Map
                destination="start"
                board={startBoard}
                gridMap={setStartBoard}
                onStart={setStartPoint}
                isChecked={startCheck}
                originalMap={props.originalMap}
                check={validateStart}
              ></Map>
              <button className={classes.btn} onClick={closeStart}>
                Set StartPoint
              </button>
            </div>
          </div>
        </div>
      )}
      {endModal && (
        <div className={classes.modalAdd}>
          <div className={classes.overlay} onClick={showEnd}></div>
          <div className={classes.spacing}></div>
          <div className={classes.modal_content}>
            <div className={classes.map}>
              <Map
                destination="end"
                board={endBoard}
                gridMap={setEndBoard}
                onEnd={setEndPoint}
                isChecked={endCheck}
                originalMap={props.originalMap}
                check={validateEnd}
              ></Map>
              <button className={classes.btn} onClick={closeEnd}>
                Set Destination
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={{
        backgroundColor: props.value === "@" ? "black" : "white",
      }}
    >
      {/* if the sqaure value has an agents */}
      {typeof props.value === "object" ||
      props.value === "@" ||
      props.value === "."
        ? null
        : props.value}
    </button>
  );
}

function Board(props) {
  function renderSquare(item, rowIndex, colIndex) {
    return (
      <Square
        onClick={() => props.onClick(rowIndex, colIndex)}
        value={item}
        rowIndex={rowIndex}
        colIndex={colIndex}
        isChecked={props.isChecked}
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
function resetMap(map) {
  for (var i = 0; i < Object.keys(map).length; i++) {
    for (var j = 0; j < Object.keys(map).length; j++) {
      if (map[i][j] === "X") {
        map[i][j] = ".";
      }
    }
  }
  return map;
}
function Map(props) {
  console.log("the map props is", props.board);
  const handleClick = (rowIndex, colIndex, check) => {
    const board = props.board;
    let boardCopy = [...board];
    if (boardCopy[rowIndex][colIndex] !== "@") {
      props.isChecked();

      boardCopy = resetMap(boardCopy);
      boardCopy[rowIndex][colIndex] = "X";
      props.gridMap(boardCopy);
      if (props.destination === "start") {
        props.onStart(rowIndex, colIndex, check);
      } else {
        props.onEnd(rowIndex, colIndex, check);
      }
    } else {
      alert("Please do not choose the obstacles.");
    }
  };
  return (
    <div className="game">
      <div className="game-board">
        <Board
          map={props.board}
          onClick={(rowIndex, colIndex) =>
            handleClick(rowIndex, colIndex, props.check)
          }
          isChecked={props.check}
        />
      </div>
    </div>
  );
}

export default Agent_Table;
