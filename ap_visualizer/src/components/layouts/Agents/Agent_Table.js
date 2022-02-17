import React from "react";
import { useState, useEffect } from "react";
import styles from "./Agent_Table.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AgentPathMap from "./Agent_PathMap";
import { DataTable } from "../../utility/DataTable";
import DataTableFooter from "../../utility/DataTableFooter";
import "alertifyjs/build/css/alertify.css";
import alertify from "alertifyjs";

const Agent_Table = (props) => {
  let [addModal, setModalIsOpen] = useState(false);
  let [startModal, setStartModalOpen] = useState(false);
  let [endModal, setEndModalOpen] = useState(false);
  let [validateStart, hasStart] = useState(false); //to validate only 1 startpoint in the start array.
  let [validateEnd, hasEnd] = useState(false); //to validate only 1 endpoint in the end array
  let [start, startPoint] = useState([]); //the start point of the robot
  let [end, endPoint] = useState([]); //the end point of the robot

  let [selectedAgent, setSelectedAgent] = useState(); //get the selected agents
  let [detailModal, setDetailModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  let { slice, range } = DataTable(props.agents, page, props.rowsPerPage);

  const showPopup = (agent) => {
    setSelectedAgent(agent);
    switch (agent.status) {
      case "Available":
      case "Assigned": {
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
  const setInitalBoardState = (agent, startArray, endArray) => {
    console.log("the selected agent is", agent);
    const startboard = props.gridMap;
    const endBoard = props.gridMap;
    let initalStartBoard = [...startboard];
    let initalEndBoard = [...endBoard];
    initalStartBoard = resetMap(initalStartBoard);
    initalEndBoard = resetMap(initalEndBoard);

    if (startArray.length !== 0 && startArray[0].agentId === agent.agentId) {
      initalStartBoard[startArray[0].row][startArray[0].col] = "O";
      props.setStartBoard(initalStartBoard);
    } else if (agent.startPoint && startArray.length === 0) {
      initalStartBoard[agent.startPoint.row][agent.startPoint.col] = "O";
      props.setStartBoard(initalStartBoard);
    } else {
    }
    if (endArray.length !== 0 && endArray[0].agentId === agent.agentId) {
      initalEndBoard[endArray[0].row][endArray[0].col] = "X";
      props.setEndBoard(initalEndBoard);
    } else if (agent.endPoint && endArray.length === 0) {
      initalEndBoard[agent.endPoint.row][agent.endPoint.col] = "X";
      props.setEndBoard(initalEndBoard);
    } else {
    }
  };
  const closePopup = () => {
    let revertMap = props.gridMap;
    revertMap = resetMap(revertMap);
    props.setEndBoard(revertMap);
    props.setStartBoard(revertMap);
    start.length = 0;
    end.length = 0;
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
  // set start location for the new agent, agentId is used to keep track of the points it belongs to which robots;
  const setStartPoint = (row, col, check, agentId) => {
    let sPosition = { row: row, col: col, agentId: agentId };
    if (!check) {
      start.push(sPosition);
    } else {
      //remove the previous clicked data.
      start.pop();
      start.push(sPosition);
    }
  };

  // set end location for the new agent;
  const setEndPoint = (row, col, check, agentId) => {
    let ePosition = { row: row, col: col, agentId: agentId };
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
    setInitalBoardState(selectedAgent, start, end);
    setStartModalOpen(!startModal);
  };

  // show the end modal to indicate the end location of the new agent;
  const endMapModal = () => {
    setInitalBoardState(selectedAgent, start, end);
    setEndModalOpen(!endModal);
  };
  const closeStartMapModal = () => {
    setStartModalOpen(!startModal);
  };
  const closeEndMapModal = (end) => {
    if (end != null && end.length === 0) {
      alertify.alert("please select one end point");
    } else {
      setEndModalOpen(!endModal);
    }
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
    if (end.length === 0) {
      alertify.alert("Please select the robot destination!");
    } else {
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
      alertify.alert("The number of agent could not be zero!");
      return;
    }
    if (!props.algoFinished) {
      alertify.alert(
        "Can't remove the agent when the algorithm is in progress!"
      );
      return;
    }
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
          {Object.keys(slice).map((key, index) => (
            <tr key={key}>
              <td>
                <p>
                  Robot {slice[key].agentId}
                  {
                    <img
                      className={styles.image}
                      src={slice[key].img}
                      alt="logo"
                    />
                  }
                </p>
              </td>
              <td>
                <label className={statusLblColor(slice[key].status)}>
                  {slice[key].status}
                </label>
              </td>
              <td>
                <button
                  className={actionBtnColor(slice[key].status)}
                  onClick={() => showPopup(slice[key])}
                >
                  {actionTxt(slice[key].status)}
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
      <DataTableFooter
        range={range}
        slice={slice}
        setPage={setPage}
        page={page}
      />

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
          <div className={styles.overlay} onClick={closeStartMapModal}></div>
          <div className={styles.spacing}></div>
          <div className={styles.modal_content}>
            <div className={styles.map}>
              <button className={styles.closeBtn} onClick={closeStartMapModal}>
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
                startPointArray={start}
                endPointArray={end}
              ></Map>

              <button
                className={styles.btn}
                onClick={() => closeStartMapModal()}
              >
                Set StartPoint
              </button>
            </div>
          </div>
        </div>
      )}
      {endModal && (
        <div className={styles.modalAdd}>
          <div className={styles.overlay} onClick={closeEndMapModal}></div>
          <div className={styles.spacing}></div>
          <div className={styles.modal_content}>
            <div className={styles.map}>
              <button className={styles.closeBtn} onClick={closeEndMapModal}>
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
                startPointArray={start}
                endPointArray={end}
              ></Map>
              <button
                className={styles.btn}
                onClick={() => closeEndMapModal(end)}
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
                  {selectedAgent.maxStep} Sec
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
function showPoint(agent, boardType, value) {
  if (value === "O" && boardType === "start")
    return <img className={styles.map_image} src={agent.img} alt="logo" />;
  else if (value === "X" && boardType === "end") return "";
  else return null;
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
            : showPoint(props.selectedAgent, props.boardType, props.value) ===
              ""
            ? props.selectedAgent.endColor
            : "white",
      }}
    >
      {/* Only display the value if it is X or O */}
      {typeof props.value === "object"
        ? null
        : props.value === "@"
        ? null
        : showPoint(props.selectedAgent, props.boardType, props.value)}
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
      if (map[i][j] === "O" || map[i][j] === "X") {
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
      alertify.alert(
        "A robot has been assigned to this point! Please choose another point as your start/end point."
      );
    } else if (boardCopy[rowIndex][colIndex] === "@") {
      alertify.alert("Unable to set obstacles as destination!");
    } else {
      let startChecker = false;
      let endChecker = false;
      //Using an checker for a final check against all the agents start and end point.
      if (props.startPointArray.length !== 0) {
        if (
          props.startPointArray[0].row === rowIndex &&
          props.startPointArray[0].col === colIndex &&
          props.startPointArray[0].agentId === props.selectedAgent.agentId
        ) {
          alertify.alert("Please do not set same point as the start point!");
          if (props.destination === "start") {
            startChecker = !startChecker;
          } else {
            endChecker = !endChecker;
          }
        }
      } else if (props.endPointArray.length !== 0) {
        if (
          props.endPointArray[0].row === rowIndex &&
          props.endPointArray[0].col === colIndex &&
          props.endPointArray[0].agentId === props.selectedAgent.agentId
        ) {
          alertify.alert("Please do not set same point as the end point!");
          if (props.destination === "start") {
            startChecker = !startChecker;
          } else {
            endChecker = !endChecker;
          }
        }
      }

      // 'O' represent the start position 'X' represent the end position
      if (props.destination === "start") {
        if (!startChecker) {
          props.isChecked(); //to push and pull the end array stack.(ensure is only one value)
          boardCopy = resetMap(boardCopy); //reset to the original layout map
          boardCopy[rowIndex][colIndex] = "O";
          props.onStart(rowIndex, colIndex, check, props.selectedAgent.agentId);
          props.setBoardFunction(boardCopy);
        }
        // else {
        //   alertify.alert(
        //     "Please choose another start point that is not the same as other robots"
        //   );
        // }
      }
      if (props.destination === "end") {
        if (!endChecker) {
          props.isChecked(); //to push and pull the end array stack.(ensure is only one value)
          boardCopy = resetMap(boardCopy); //reset to the original layout map
          boardCopy[rowIndex][colIndex] = "X";
          props.onEnd(rowIndex, colIndex, check, props.selectedAgent.agentId);
          props.setBoardFunction(boardCopy);
        }
        // else {
        //   alertify.alert(
        //     "Please choose another end point that is not the same as other robots"
        //   );
        // }
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
          selectedAgent={props.selectedAgent}
        />
      </div>
    </div>
  );
}

export default Agent_Table;
