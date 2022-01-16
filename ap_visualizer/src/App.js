import logo from "./images/ap_visualizer-logo.png";
import PathImage from "./images/path.png";
import LandingPage from "./components/layouts/Landing_Page/Landing_page";
import "./App.css";
import * as React from "react";
import CelebrateLogo from "./images/celebration.png";
import Game from "./components/layouts/Boards/gridmap";
import AgentsPage from "./components/layouts/Agents/Agents_Page";
import { useState } from "react";
import { robots, pColors, sColors, rColors } from "./Constants";
import { maps } from "./maps";
import {clone2DArray, getNextAgentID} from './components/utility/Utility'

function App() {
  let [agents, setAgentsList] = useState({}); // {id : {{startPoint: {row: 1, col: 1}, endPoint: {row: 1, col: 4}}}
  let [gridMap, setGridMap] = useState(clone2DArray(maps["0"]));
  let [agentPaths, setAgentPaths] = useState({});
  let [step, setStep] = useState(0); // display the step that the current grid map is visualized;
  let [speed, setSpeed] = useState("Fast"); // the speed of the animation for auto-move of the agent; default value is Slow
  let [algo, setAlgo] = useState("CBS"); // the algorithm options; default value is CBS algorithm;
  let [algoFinished, setAlgoFinished] = useState(true); // the boolean value to indicate whether the algorithm is finished running;
  let [startBoard, setStartBoard] = useState(gridMap); // the start board in each agent entry;
  let [endBoard, setEndBoard] = useState(gridMap); // the end board in each agent entry;

  // reset all the variables of the gridMap;
  function resetMap(mapID) {
    if (!algoFinished){
      alert("Can't reset the map when the algorithm is executed!");
      return;
    }
    console.log(mapID);
    let updatedGridMap = null;
    // reset the gridMap
    if (mapID === "N/A"){
        updatedGridMap= clone2DArray(maps["0"]);
    }
    else{
        updatedGridMap = clone2DArray(maps[mapID]);
    }
    setMap(updatedGridMap);
    // reset the old agents;
    setAgentsList({});
    setAgentPaths({});
  }
  const setMap = (points) => {
    setGridMap(points);
  };
  let nextID = getNextAgentID(agents);
  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <LandingPage image={logo} image1={PathImage} image2={CelebrateLogo} />
      <div className="Main-Container">
        <div className="Map-Container">
          <Game
            gridMap={gridMap}
            agents={agents}
            mapping={setMap}
            step={step}
            agentPaths={agentPaths}
          ></Game>
        </div>
        <div className="Agent-Container">
          <AgentsPage
            robotImage={robots[nextID]}
            agentNo={nextID}
            endColor={pColors[nextID]}
            pathColor={sColors[nextID]}
            robotColor={rColors[nextID]}
            agents={agents}
            setAgentsList={setAgentsList}
            gridMap={gridMap}
            mapping={setMap}
            setStep={setStep}
            setAgentPaths={setAgentPaths}
            speed={speed}
            algo={algo}
            algoFinished={algoFinished}
            setAlgoFinished={setAlgoFinished}
            startBoard={startBoard}
            endBoard={endBoard}
            setStartBoard={setStartBoard}
            setEndBoard={setEndBoard}
          ></AgentsPage>
        </div>
      </div>
      <span>Map</span>
      <select onChange={(e) => resetMap(e.target.value)}>
        <option value="N/A">N/A</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
      <span>Speed</span>
      <select onChange={(e) => setSpeed(e.target.value)}>
        <option value="Fast">Fast</option>
        <option value="Average">Average</option>
        <option value="Slow">Slow</option>
      </select>
      <span>Algorithm</span>
      <select onChange={(e) => setAlgo(e.target.value)}>
        <option value="CBS">CBS</option>
      </select>
    </div>
  );
}

export default App;
