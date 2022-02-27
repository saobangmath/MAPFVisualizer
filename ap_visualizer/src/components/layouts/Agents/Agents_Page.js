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
const recurCBS = require("../../../pathFinding/recursive-cbs/recurCBS");

let interval = null; // the interval created to display the auto-movement of the agents;

function Agents_Page(props) {
  let [startModal, setStartModal] = useState(false);
  let [speed, setSpeed] = useState("Fast"); //
  let [algo, setAlgo] = useState("CBS"); // the algorithm options; default value is CBS algorithm;
  const showStartModal = () => {
    setStartModal(!startModal);
  };
  var x = document.getElementById("addBtn");
  if (Object.keys(props.agentPaths).length !== 0) {
    x.style.display = "none";
  }
  const startFunction = () => {
    //For Start Button
    if (Object.keys(props.agentPaths).length === 0) {
      if (props.algoFinished) {
        let check = true;
        for (let id in props.agents) {
          let status = props.agents[id].status;
          if (status !== "Assigned") {
            check = false;
            alertify
                .alert(
                    "Please assigned the task for all agents or remove the agent with no assigned task!"
                )
                .setHeader('<em style="color:black;">Alert</em>');

            break;
          }
        }
        if (check) {
          showStartModal();
        }
      } else {
        alertify.alert("The algorithm has started, please wait patiently");
      }
    }
    //for reset button
    else {
      resetAgents();
    }
  };
  function maxRobotChecker() {
    let copy = props.gridMap;
    let width = copy[0].length;
    let height = Object.keys(copy).length;
    let maxLimit = 10;
    console.log("the agents list is ", Object.keys(props.agents).length);
    if (Object.keys(props.agents).length >= maxLimit) {
      return true;
    } else {
      return false;
    }
  }
  function newAgent() {
    let checker = maxRobotChecker();
    if (!props.algoFinished) {
      alertify
          .alert("Can't add new agent when the algorithm is in-progress!")
          .setHeader('<em style="color:black;">Error</em>');
      return;
    } else if (!checker) {
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
        mainAlgoExpandedNode: "",
        mainAlgoExecutionTime: "",
        subAlgoExpandedNode: "",
        subAlgoExecutionTime: "",
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
    } else {
      alertify
          .alert(
              "You have exceed the max number of robot in the map. For more clarification on max limit, please click on our robot helper !"
          )
          .setHeader('<em style="color:black;">Error</em>');
    }
  }
  const setRunningSpeed = (value) => {
    setSpeed(value);
  };
  const setRunningAlgo = (value) => {
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
  const getSubAlgo = (mp, algo) => {
    if (algo === "CBS") {
      return new AStar(mp);
    }
    if (algo === "A*+OD") {
      return new CBS(mp);
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
    let secondAlgo = getSubAlgo(mp, algo); //the algos that the user never select
    console.log("WAIT");
    {
      let solutions = runningAlgo.solve();
      let paths = solutions["paths"];
      let expandedNodes = solutions["expanded_nodes"];
      let executionTime = solutions["execution_time"];
      if (Object.keys(paths).length === 0) {
        // there is no possible plan;
        alert("No possible plan found!");
        props.setAlgoFinished(true);
        return;
      }
      //store the agent path into the agents list
      for (let agentId in paths) {
        storeAgentMapPath(
            paths[agentId],
            props.agents[agentId],
            expandedNodes,
            executionTime
        );
      }
      props.setStep(0);
      props.setAgentPaths(paths);
      runMap(paths, speed);
    }
    // Storing the algo that the user never select
    {
      let solutions = secondAlgo.solve();
      let paths = solutions["paths"];
      let expandedNodes = solutions["expanded_nodes"];
      let executionTime = solutions["execution_time"];

      if (Object.keys(paths).length === 0) {
        // there is no possible plan;
        for (let id = 1; id <= Object.keys(props.agents).length; id++) {
          storeSubAlgoData(props.agents[id], 0, 0);
        }
      } else {
        //store the agent path into the agents list
        for (let agentId in paths) {
          storeSubAlgoData(props.agents[agentId], expandedNodes, executionTime);
        }
      }
    }
    showStartModal();
    console.log(props.agents);
  };
  const storeSubAlgoData = (agent, expandedNodes, executionTime) => {
    agent.subAlgoExpandedNode = expandedNodes;
    agent.subAlgoExecutionTime = executionTime;
    props.agents[agent.agentId] = agent;
    props.setAgentsList(props.agents);
  };
  //store the algo path into each agents
  const storeAgentMapPath = (paths, agent, expandedNodes, executionTime) => {
    let agentPath = agent.path;
    for (let cellId = 0; cellId < paths.length; cellId++) {
      let path = { row: paths[cellId].x, col: paths[cellId].y };
      agentPath.push(path);
    }
    agent.path = agentPath;
    agent.status = "Busy";
    agent.mainAlgoExpandedNode = expandedNodes;
    agent.mainAlgoExecutionTime = executionTime;
    agent.maxStep = paths.length; //exclude start point, only count the path and the destination steps.

    props.agents[agent.agentId] = agent;
    props.setAgentsList(props.agents);
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
            "Robot" + agents[index].agentId + " has finished the allocated task",
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
      alertify.alert("Can't reset the map when the algorithm is executed!");
      return;
    } else {
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
      props.setGridMapFunction(originalGridMap);
      alertify.success("Map reset successfully");
      var x = document.getElementById("addBtn");

      x.style.display = "inline-block";
    }
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
            selectedAlgo={algo}
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
                    <p>Speed</p>

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
        <button id="addBtn" className={classes.btn} onClick={newAgent}>
          Add
        </button>
        <button className={classes.btn} onClick={startFunction}>
          {Object.keys(props.agentPaths).length === 0 ? "Start" : "Reset"}
        </button>
      </>
  );
}

export default Agents_Page;