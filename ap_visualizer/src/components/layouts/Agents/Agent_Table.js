import React from "react";
import { useState } from "react";
import styles from "./Agent_Table.module.css";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { maps } from "../../../mapconfig/maps";
import "bootstrap/dist/css/bootstrap.min.css";
import classes from "./Agent_Page.module.css";

import Switch from "react-bootstrap/esm/Switch";
import { clone2DArray } from "../../utility/Utility";
import AgentPathMap from "./Agent_PathMap";

const Agent_Table = (props) => {
  let [addModal, setModalIsOpen] = useState(false);
  let [startModal, setStartModalOpen] = useState(false);
  let [endModal, setEndModalOpen] = useState(false);
  let [priority, setPriority] = useState("");
  let [validateStart, hasStart] = useState(false); //to validate only 1 startpoint in the start array.
  let [validateEnd, hasEnd] = useState(false); //to validate only 1 endpoint in the end array
  let [start, startPoint] = useState([]); //the start point of the robot
  let [end, endPoint] = useState([]); //the end point of the robot

  let [selectedAgent, setSelectedAgent] = useState(); //get the selected agents
  let [detailModal, setDetailModalOpen] = useState(false);

  const showPopup = (agent) => {
    setSelectedAgent(agent);
    switch (agent.status) {
      case "Available":
      case "Assigned": {
        setStartMap(agent);
        setModalIsOpen(!addModal);
        break;
      }
      case "Completed": {
        setDetailModalOpen(!detailModal);
        break;
      }
      default:
        break;
    }
  };
  const setStartMap = (agent) => {
    const board = props.gridMap;
    let boardCopy = [...board];
    boardCopy[agent.startPoint.row][agent.startPoint.col] = "O";
    props.setGridMapFunction(boardCopy);
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
  const openDetailModal = () => {
    setDetailModalOpen(!detailModal);
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
  const statusLblColor = (status) => {
    switch (status) {
      case "Available":
        return styles.lblAvailable;
      case "Assigned":
        return styles.lblAssigned;
      case "Busy":
        return styles.lblBusy;
      default:
        return styles.lblCompleted;
    }
  };
  const actionBtnColor = (status) => {
    switch (status) {
      case "Available":
        return styles.btnAssign;
      case "Assigned":
        return styles.btnReady;
      case "Busy":
        return styles.btnRunning;
      default:
        return styles.btnDetail;
    }
  };
  const actionTxt = (status) => {
    switch (status) {
      case "Available":
        return "Assign";
      case "Assigned":
        return "Ready";
      case "Busy":
        return "Running";
      default:
        return "Detail";
    }
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
      props.setAgentPaths({}); // reset the agent path from the previous CBS algo run;
      props.setAlgoFinished(true); // reset the algoFinished to be true;

      // Update the main map in gridMap.js
      const boardCopy = [...props.gridMap];
      let lastAgent = selectedAgent;
      boardCopy[props.agents[updatedAgent.agentId].startPoint.row][
        props.agents[updatedAgent.agentId].startPoint.col
      ] = lastAgent;

      boardCopy[props.agents[updatedAgent.agentId].endPoint.row][
        props.agents[updatedAgent.agentId].endPoint.col
      ] = lastAgent;
      props.setGridMapFunction(boardCopy);
      closePopup();
    }
  };

  // remove the agent in the map;
  const RemoveAgent = (id) => {
    if (Object.keys(props.agents).length == 1) {
      alert("The number of agent could not be zero!");
      return;
    }
    if (!props.algoFinished) {
      alert("Can't remove the agent when the algorithm is in progress!");
      return;
    }
    console.log("Remove agent id: " + id);
    for (let row = 0; row < props.gridMap.length; row++) {
      for (let col = 0; col < props.gridMap[0].length; col++) {
        if (
          props.gridMap[row][col] !== null &&
          props.gridMap[row][col].agentId === id
        ) {
          props.gridMap[row][col] = null;
        }
      }
    }
    let new_agents = {};
    for (let key in props.agents) {
      if (key != id) {
        new_agents[key] = props.agents[key];
      }
    }
    props.setAgentsList(new_agents);
    props.setAgentPaths({});
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
                  Robot {index + 1}
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
                <label className={statusLblColor(props.agents[key].status)}>
                  {props.agents[key].status}
                </label>
              </td>
              <td>
                <button
                  className={actionBtnColor(props.agents[key].status)}
                  onClick={() => showPopup(props.agents[key])}
                >
                  {actionTxt(props.agents[key].status)}
                </button>
                <button
                  className={styles.removeBtn}
                  onClick={() => RemoveAgent(key)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {addModal && (
        <div className={styles.modalAdd}>
          <div className={styles.overlay} onClick={closePopup}></div>
          <div className={styles.spacing}></div>
          <div className={styles.modal_content}>
            <img
              className={styles.modal_image}
              src={selectedAgent.img}
              alt="logo"
            />
            <button className={styles.closeBtn} onClick={closePopup}>
              X
            </button>
            <p className={styles.heading}>Robot {selectedAgent.agentId}</p>
            <div>
              <p className={styles.title}>Task Priority:</p>
              <select
                className={styles.dropDownBtn}
                onChange={(priority) => selectPriority(priority.target.value)}
              >
                <option className={styles.dropDownCtn} value="">
                  Choose the priority level...
                </option>
                <option className={styles.dropDownCtn} value="Low">
                  Low
                </option>
                <option className={styles.dropDownCtn} value="Medium">
                  Medium
                </option>
                <option className={styles.dropDownCtn} value="High">
                  High
                </option>
              </select>
            </div>
            <div className={styles.points}>
              <button className={styles.btnPoint} onClick={startMapModal}>
                Click to Set Start Point
              </button>

              <button className={styles.btnPoint} onClick={endMapModal}>
                Click to Set End Point
              </button>
            </div>
            <div></div>
            <button className={styles.btn} onClick={AddAgent}>
              Assign
            </button>
          </div>
        </div>
      )}
      {startModal && (
        <div className={styles.modalAdd}>
          <div className={styles.overlay} onClick={startMapModal}></div>
          <div className={styles.spacing}></div>
          <div className={styles.modal_content}>
            <div className={styles.map}>
              <button className={styles.closeBtn} onClick={startMapModal}>
                X
              </button>

              <Map
                destination="start"
                board={props.startBoard}
                setBoardFunction={props.setStartBoard}
                onStart={setStartPoint}
                isChecked={startCheck}
                check={validateStart}
                agents={props.agents}
                selectedAgent={selectedAgent}
                pointArray={start}
              ></Map>

              <button
                className={styles.btn}
                onClick={() => closeStartMapModal(end)}
              >
                Set StartPoint
              </button>
            </div>
          </div>
        </div>
      )}
      {endModal && (
        <div className={styles.modalAdd}>
          <div className={styles.overlay} onClick={endMapModal}></div>
          <div className={styles.spacing}></div>
          <div className={styles.modal_content}>
            <div className={styles.map}>
              <button className={styles.closeBtn} onClick={endMapModal}>
                X
              </button>
              <Map
                destination="end"
                board={props.endBoard}
                setBoardFunction={props.setEndBoard}
                onEnd={setEndPoint}
                isChecked={endCheck}
                check={validateEnd}
                agents={props.agents}
                selectedAgent={selectedAgent}
                pointArray={end}
              ></Map>
              <button
                className={styles.btn}
                onClick={() => closeEndMapModal(selectedAgent)}
              >
                Set Destination
              </button>
            </div>
          </div>
        </div>
      )}
      {detailModal && (
        <div className={styles.modalAdd}>
          <div className={styles.overlay} onClick={openDetailModal}></div>
          <div className={styles.spacing}></div>
          <div className={styles.modal_content}>
            <img className={styles.image} src={selectedAgent.img} alt="logo" />
            <button className={styles.closeBtn} onClick={openDetailModal}>
              X
            </button>
            <p className={styles.heading}>Robot {selectedAgent.agentId}</p>
            <table className={styles.detailTable}>
              {/* detail NOt confirm */}
              <tr>
                <td>Total Time Taken: </td>
                <td className={styles.detailColumn}>
                  {selectedAgent.maxStep}'Sec'
                </td>
              </tr>
              <tr>
                <td>No. of steps:</td>
                <td className={styles.detailColumn}>{selectedAgent.maxStep}</td>
              </tr>
            </table>
            <div className={styles.map}>
              <AgentPathMap
                agent={selectedAgent}
                map={props.startBoard}
              ></AgentPathMap>
            </div>

            <button className={styles.btn} onClick={openDetailModal}>
              Okay
            </button>
          </div>
        </div>
      )}
    </>
  );
};
function showPoint(array, agent, boardType, value) {
  if (boardType === "start") {
    if (value === "O") {
      return <img className={styles.map_image} src={agent.img} alt="logo" />;
    } else if (array.length) {
      if (
        array[array.length - 1].row === agent.startPoint.row &&
        array[array.length - 1].col === agent.startPoint.col
      ) {
        return <img className={styles.map_image} src={agent.img} alt="logo" />;
      }
    } else {
      return null;
    }
  } else {
    if (value === "X") {
      return "";
    } else if (array.length) {
      if (
        array[array.length - 1].row === agent.endPoint.row &&
        array[array.length - 1].col === agent.endPoint.col
      ) {
        return "";
      }
    } else {
      return null;
    }
  }
}

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={{
        backgroundColor:
          props.value === "@"
            ? "black"
            : showPoint(
                props.pointArray,
                props.selectedAgent,
                props.boardType,
                props.value
              ) === ""
            ? props.selectedAgent.endColor
            : "white",
      }}
    >
      {/* Only display the value if it is X or O */}
      {typeof props.value === "object"
        ? null
        : showPoint(
            props.pointArray,
            props.selectedAgent,
            props.boardType,
            props.value
          )}
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
        selectedAgent={props.selectedAgent}
        pointArray={props.pointArray}
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
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
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
      //Using an checker for a final check against all the agents start and end point.
      let startChecker = false;
      let endChecker = false;
      for (let index in props.agents) {
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
            boardCopy = resetMap(boardCopy); //reset to the original layout map
            boardCopy[rowIndex][colIndex] = "O";
            props.onStart(rowIndex, colIndex, check);
            props.setBoardFunction(boardCopy);
          } else {
            alert(
              "Please choose another start point that is not the same as other agents"
            );
          }
        }
        if (props.destination === "end") {
          if (!endChecker) {
            props.isChecked(); //to push and pull the end array stack.(ensure is only one value)
            boardCopy = resetMap(boardCopy); //reset to the original layout map
            boardCopy[rowIndex][colIndex] = "X";
            props.onEnd(rowIndex, colIndex, check);
            props.setBoardFunction(boardCopy);
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
          pointArray={props.pointArray}
          boardType={props.destination}
          isChecked={props.check}
          selectedAgent={props.selectedAgent}
        />
      </div>
    </div>
  );
}

export default Agent_Table;
