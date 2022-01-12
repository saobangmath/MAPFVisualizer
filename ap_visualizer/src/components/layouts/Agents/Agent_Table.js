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
  let [validateStart, hasStart] = useState(false); //to validate only 1 startpoint in the start array.
  let [validateEnd, hasEnd] = useState(false); //to validate only 1 endpoint in the end array
  let [startBoard, setStartBoard] = useState(maps.mapdefault);
  let [endBoard, setEndBoard] = useState(maps.mapdefault);
  let [start, startPoint] = useState([]); //the start point of the robot
  let [end, endPoint] = useState([]); //the end point of the robot
  var [selectedAgent, setSelectedAgent] = useState(); //get the selected agents
  const showPopup = (agent) => {
    setSelectedAgent(agent);
    setStartMap(agent);
    setModalIsOpen(!addModal);
  };
  const setStartMap = (agent) => {
    const board = props.gridMap;
    let boardCopy = [...board];
    boardCopy[agent.startPoint.row][agent.startPoint.col] = "O";
    props.mapping(boardCopy);
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

  //close/open the start modal using the assign button(future implementation for validation)
  const startMapModal = () => {
    setStartModalOpen(!startModal);
  };

  // show the end modal to indicate the end location of the new agent;
  const endMapModal = () => {
    setEndModalOpen(!endModal);
  };
  const closeStartMapModal = () => {
    setStartModalOpen(!startModal);
  };
  const closeEndMapModal = (end) => {
    if (end.length === 0) {
      alert("please select one end point");
    } else {
      setEndModalOpen(!endModal);
    }
  };
  // select the priority of the agents;
  const selectPriority = (e) => {
    setPriority(e);
  };

  const AddAgent = () => {
    // update the selectedAgent
    let updatedAgent = selectedAgent;
    updatedAgent.status = "Assigned";
    if (start.length !== 0) {
      updatedAgent.startPoint = start[start.length - 1];
    }
    if (priority === "") {
      alert("Please choose your task priority!");
    } else if (end.length === 0) {
      alert("Please select the robot destination!");
    } else {
      updatedAgent.priority = priority;
      updatedAgent.endPoint = end[end.length - 1];
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
    }
  };

  for (let index = 1; index <= Object.keys(props.agents).length; index++) {
    console.log(
      "status is ",
      props.agents[index].status,
      props.agents[index].curStep,
      props.agents[index].maxStep
    );
  }

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

            <button className={classes.btn} onClick={startMapModal}>
              Click to Set
            </button>
            <button className={classes.btn} onClick={endMapModal}>
              Click to set
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
          <div className={classes.overlay} onClick={startMapModal}></div>
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
                agents={props.agents}
              ></Map>
              <button
                className={classes.btn}
                onClick={() => closeStartMapModal(end)}
              >
                Set StartPoint
              </button>
            </div>
          </div>
        </div>
      )}
      {endModal && (
        <div className={classes.modalAdd}>
          <div className={classes.overlay} onClick={endMapModal}></div>
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
                agents={props.agents}
              ></Map>
              <button
                className={classes.btn}
                onClick={() => closeEndMapModal(selectedAgent)}
              >
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
      {/* Only display the value if it is X or O */}
      {typeof props.value === "object"
        ? null
        : props.value === "O" && props.boardType === "start"
        ? props.value
        : props.value === "X" && props.boardType === "end"
        ? props.value
        : null}
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
        boardType={props.boardType}
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
      if (map[i][j] === "X" || map[i][j] === "O") {
        map[i][j] = ".";
      }
    }
  }
  return map;
}
function Map(props) {
  const handleClick = (rowIndex, colIndex, check) => {
    const board = props.board;
    let boardCopy = [...board];
    if (typeof boardCopy[rowIndex][colIndex] === "object") {
      alert(
        "Please choose another start/end point! Please do not choose the same as other agents!"
      );
    } else if (boardCopy[rowIndex][colIndex] === "@") {
      alert("Please do not choose the obstacles.");
    } else {
      //Using an checker for a final check againts all the agents start and end point.
      let startChecker = false;
      let endChecker = false;
      for (var index = 1; index <= Object.keys(props.agents).length; index++) {
        //validate the start points between agents
        if (
          props.agents[index].startPoint.row === rowIndex &&
          props.agents[index].startPoint.col === colIndex
        ) {
          if (props.destination === "start") {
            startChecker = !startChecker;
            break;
          }
        }
        //validate the end points between agents
        if (props.agents[index].endPoint.length !== 0) {
          if (props.destination === "end") {
            if (
              props.agents[index].endPoint.row === rowIndex &&
              props.agents[index].endPoint.col === colIndex
            ) {
              endChecker = !endChecker;
              break;
            }
          }
        }
        // 'O' represent the start position 'X' represent the end position
        if (props.destination === "start") {
          if (!startChecker) {
            props.isChecked(); //to push and pull the end array stack.(ensure is only one value)
            boardCopy = resetMap(boardCopy); //reset to the orignal layout map
            boardCopy[rowIndex][colIndex] = "O";
            props.onStart(rowIndex, colIndex, check);
            props.gridMap(boardCopy);
          } else {
            alert(
              "Please choose another start point that is not the same as other agents"
            );
          }
        }
        if (props.destination === "end") {
          if (!endChecker) {
            props.isChecked(); //to push and pull the end array stack.(ensure is only one value)
            boardCopy = resetMap(boardCopy); //reset to the orignal layout map
            boardCopy[rowIndex][colIndex] = "X";
            props.onEnd(rowIndex, colIndex, check);
            props.gridMap(boardCopy);
          } else {
            alert(
              "Please choose another end point that is not the same as other agents"
            );
          }
        }
      }
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
          boardType={props.destination}
          isChecked={props.check}
        />
      </div>
    </div>
  );
}

export default Agent_Table;
