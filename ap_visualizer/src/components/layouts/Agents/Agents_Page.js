import React from "react";
import classes from "./Agent_Page.module.css";
import AgentTable from "./Agent_Table";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import "../../../alertify/css/themes/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { clone2DArray, getSpeed, getNextAgentID } from "../../utility/Utility";
import { useState } from "react";
const map = require("../../../pathFinding/Map");
const Cell = require("../../../pathFinding/Cell");
const CBS = require("../../../pathFinding/cbs/highLevelSolver");
const AStar = require("../../../pathFinding/aStar/AStar");

let interval = null; // the interval created to display the auto-movement of the agents;

function Agents_Page(props) {
  let [startModal, setStartModal] = useState(false);
  let [speed, setSpeed] = useState("Fast"); //
  let [algo, setAlgo] = useState("CBS"); // the algorithm options; default value is CBS algorithm;
  const showStartModal = () => {
    setStartModal(!startModal);
  };
  const startFunction = () => {
    let check = true;
    for (let id in props.agents) {
      let status = props.agents[id].status;
      if (status !== "Assigned") {
        check = false;
        alertify.alert(
          "Please assigned the task for all agents or remove the agent with no assigned task!"
        );
        break;
      }
    }
    if (check) {
      showStartModal();
    }
  };
  function newAgent() {
    if (!props.algoFinished) {
      alertify.alert("Can't add new agent when the algorithm is in-progress!");
      return;
    }
    let agentId = getNextAgentID(props.agents);
    let endColor = props.endColor;
    let pathColor = props.pathColor;
    let robotColor = props.robotColor;
    let robot = props.robotImage;
    let startP = generateStartPosition(props.gridMap);
    let agent = {
      img: robot,
      endColor: endColor,
      pathColor: pathColor,
      robotColor: robotColor,
      agentId: agentId,
      startPoint: startP,
      endPoint: "",
      status: "Available",
      curStep: "",
      maxStep: "",
      path: [],
    };
    props.agents[agentId] = agent;
    props.setAgentsList(props.agents);
    props.setAgentPaths({});

    props.setAlgoFinished(true); // reset the algoFinished to be true;

    const boardCopy = [...props.gridMap];
    let lastAgent = props.agents[agentId];
    boardCopy[props.agents[agentId].startPoint.row][
      props.agents[agentId].startPoint.col
    ] = lastAgent;

    props.setStartBoard(boardCopy);
    props.setEndBoard(boardCopy);
    props.setGridMapFunction(boardCopy);
  }
  const setRunningSpeed = (value) => {
    setSpeed(value);
  };
  const setRunningAlgo = (value) => {
    console.log("the", algo);
    setAlgo(value);
  };
  function generateStartPosition(map) {
    let rowIndex, colIndex;
    do {
      rowIndex = Math.floor(Math.random() * map.length);
      colIndex = Math.floor(Math.random() * map[0].length);
    } while (map[rowIndex][colIndex] !== ".");
    let sPosition = { row: rowIndex, col: colIndex };
    return sPosition;
  }

  // get the chosen algo from the Algorithm drop down list;
  const getAlgo = (mp, algo) => {
    if (algo === "CBS") {
      return new CBS(mp);
    }
    if (algo === "A*+OD") {
      return new AStar(mp);
    }
    return null; // this line never reached!;
  };

  // run the chosen algo with the added agents;
  const runAlgo = ({ speed, algo }) => {
    let mp = new map();
    mp.height = props.gridMap.length;
    mp.width = props.gridMap[0].length;
    mp.grid = clone2DArray(props.gridMap);
    // add agents in props to map agents with the format used in the cbs;
    for (let id in props.agents) {
      let start_row = props.agents[id].startPoint.row;
      let start_col = props.agents[id].startPoint.col;
      let status = props.agents[id].status;
      if (status === "Assigned") {
        // only added those assigned agent into the algorithm plan;
        let end_row = props.agents[id].endPoint.row;
        let end_col = props.agents[id].endPoint.col;
        let agent = {
          START: new Cell(start_row, start_col),
          DEST: new Cell(end_row, end_col),
        };
        mp.agents[id] = agent;
      } else {
        alertify.alert(
          "Please assigned the task for all agents or remove the agent with no assigned task!"
        );
        // for simplicity in case there is some robot in the map has not been assigned with any place -> the algo could not be executed;

        return;
      }
    }
    props.setAlgoFinished(false); // the algorithm is in executing progress;
    mp.no_agents = Object.keys(mp.agents).length;
    if (mp.no_agents === 0) {
      alertify.alert("There is no agents to run the CBS!");
      return;
    }
    let runningAlgo = getAlgo(mp, algo);
    console.log("WAIT");
    runningAlgo.solve().then((solutions) => {
      let paths = solutions["paths"];
      console.log(paths);
      if (Object.keys(paths).length === 0) {
        // there is no possible plan;
        alert("No possible plan found!");
        props.setAlgoFinished(true);
        return;
      }
      //store the agent path into the agents list
      for (let agentId in paths) {
        storeAgentMapPath(paths[agentId], props.agents[agentId]);
      }
      props.setStep(0);
      props.setAgentPaths(paths);
      runMap(paths, speed);
    });
    showStartModal();
  };
  //store the algo path into each agents
  const storeAgentMapPath = (paths, agent) => {
    let agentPath = agent.path;
    for (let cellId = 0; cellId < paths.length; cellId++) {
      let path = { row: paths[cellId].x, col: paths[cellId].y };
      agentPath.push(path);
    }
    agent.path = agentPath;
    agent.status = "Busy";
    agent.maxStep = paths.length; //exclude start point, only count the path and the destination steps.

    props.agents[agent.agentId] = agent;
    props.setAgentsList(props.agents);
    console.log(props.agents);
  };
  const runMap = (paths, speed) => {
    if (interval != null) {
      clearInterval(interval);
    }
    let maxLength = 1;
    for (let agentID in paths) {
      maxLength = Math.max(maxLength, paths[agentID].length);
    }
    let curStep = 0;
    interval = setInterval(function () {
      if (curStep >= maxLength) {
        props.setAlgoFinished(true);
        return;
      }
      updateAgentStep(curStep, props.agents); //update the current steps in the for each agents
      props.setStep(curStep + 1);
      curStep += 1;
    }, getSpeed(speed));
    props.setAgentsList(props.agents);
  };

  const updateAgentStep = (curStep, agents) => {
    for (let index in agents) {
      let curAgent = agents[index];
      curAgent.curStep = curStep;
      if (curStep === curAgent.maxStep - 1) {
        curAgent.status = "Completed";
        alertify.notify(
          "Robot" + agents[index].agentId + "has finished the allocated task",
          "success",
          2,
          function () {
            console.log("dismissed");
          }
        );
      }
      let clone_agents = { ...props.agents };
      clone_agents[curAgent.agentId] = curAgent;

      props.setAgentsList(clone_agents);
    }
  };

  // reset all of the configuration related to current MAPF problem;
  const resetAgents = () => {
    if (!props.algoFinished) {
      alert("Can't reset the map when the algorithm is executed!");
      return;
    }
    props.setAgentsList({}); // reset the list of the agent to empty;
    props.setAgentPaths({}); // reset the agent path;
    let originalGridMap = [...props.gridMap];
    for (let row = 0; row < originalGridMap.length; row++) {
      for (let col = 0; col < originalGridMap[0].length; col++) {
        if (originalGridMap[row][col] === "@") {
          continue;
        } else {
          originalGridMap[row][col] = ".";
        }
      }
    }
    props.setGridMapFunction(originalGridMap); // reset the gridmap to the original version;
  };

  return (
    <>
      <AgentTable
        agents={props.agents}
        setAgentsList={props.setAgentsList}
        setAgentPaths={props.setAgentPaths}
        gridMap={props.gridMap}
        setGridMapFunction={props.setGridMapFunction}
        algoFinished={props.algoFinished}
        setAlgoFinished={props.setAlgoFinished}
        startBoard={props.startBoard}
        endBoard={props.endBoard}
        setStartBoard={props.setStartBoard}
        setEndBoard={props.setEndBoard}
        rowsPerPage={3}
      ></AgentTable>
      {startModal && (
        <div className={classes.modalAdd}>
          <div className={classes.overlay} onClick={showStartModal}></div>
          <div className={classes.spacing}></div>
          <div className={classes.modal_content}>
            <div className={classes.modal_container}>
              <button className={classes.closeBtn} onClick={showStartModal}>
                X
              </button>
              <div className={classes.modalTitle}>
                <h2>Choose Your Speed & Algorithm</h2>
                <p>
                  Based on your preference,choose the suitable running speed &
                  the algorithm to use.
                </p>
              </div>
              <div className={classes.speedContainer}>
                <p>speed</p>

                <select
                  className={classes.dropDownBtn}
                  onChange={(e) => setRunningSpeed(e.target.value)}
                >
                  <option value="Fast">Fast</option>
                  <option value="Average">Average</option>
                  <option value="Slow">Slow</option>
                </select>
              </div>
              <div className={classes.algorithmContainer}>
                <p>Algorithm</p>
                <select
                  className={classes.dropDownBtn}
                  onChange={(e) => setRunningAlgo(e.target.value)}
                >
                  <option value="CBS">CBS</option>
                  <option value="A*+OD">A*+OD</option>
                </select>
              </div>
              <div className={classes.btnContainer}>
                <button
                  className={classes.btn}
                  onClick={() => runAlgo({ speed, algo })}
                >
                  Start
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <button className={classes.btn} onClick={newAgent}>
        Add
      </button>
      <button className={classes.btn} onClick={startFunction}>
        Start
      </button>
      <button className={classes.btn} onClick={resetAgents}>
        Reset
      </button>
    </>
  );
}

export default Agents_Page;
