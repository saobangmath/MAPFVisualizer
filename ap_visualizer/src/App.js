import logo from "./images/ap_visualizer-logo.png";
import PathImage from "./images/path.png";
import LandingPage from "./components/layouts/Landing_Page/Landing_page";
import "./App.css";
import * as React from "react";
import CelebrateLogo from "./images/celebration.png";
import Game from "./components/layouts/Boards/gridmap";
import AgentsPage from "./components/layouts/Agents/Agents_Page";
import { useState } from "react";
import { robots, pColors } from "./Constants";
import { maps } from "./maps";
import { dupMaps } from "./dupMaps";
import {getNextAgentID} from './components/utility/Utility'

function App() {
  let [agents, setAgentsList] = useState({}); // {id : {{startPoint: {row: 1, col: 1}, endPoint: {row: 1, col: 4}}}
  let [dupMap, setDupMap] = useState(dupMaps.mapdefault); //duplicating the original map
  let [gridMap, setGridMap] = useState(maps.mapdefault);
  let [agentPaths, setAgentPaths] = useState([]);
  let [step, setStep] = useState(0); // display the step that the current grid map is visualized;
  let [speed, setSpeed] = useState("Fast"); // the speed of the animation for auto-move of the agent; default value is Slow
  let [algo, setAlgo] = useState("CBS"); // the algorithm options; default value is CBS algorithm;
  let [algoFinished, setAlgoFinished] = useState(true); // the boolean value to indicate whether the algorithm is finished running;
  function changeGrid(value) {
    switch (value) {
      case "1":
        setGridMap((prevGridMap) => maps.map1);
        setDupMap(dupMaps.map1);
        break;
      case "2":
        setGridMap((prevGridMap) => maps.map2);
        setDupMap(dupMaps.map2);
        break;
      case "3":
        setGridMap((prevGridMap) => maps.map3);
        setDupMap(dupMaps.map3);

        break;
      case "4":
        setGridMap((prevGridMap) => maps.map4);
        setDupMap(dupMaps.map4);

        break;
      default:
        setGridMap((prevGridMap) => maps.mapdefault);
        setDupMap(dupMaps.mapdefault);
        break;
    }
  }
  const setMap = (points) => {
    setGridMap(points);
  };
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
            originalMap={dupMap}
            robotImage={robots[getNextAgentID(agents)]}
            agentNo={getNextAgentID(agents)}
            endColor={pColors[getNextAgentID(agents)]}
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
          ></AgentsPage>
        </div>
      </div>
      <span>Map</span>
      <select onChange={(e) => changeGrid(e.target.value)}>
        <option value="N/A">N/A</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
      <span>Speed</span>
      <select onChange={(e) => setSpeed(e.target.value)}>
        <option value = "Fast">Fast</option>
        <option value = "Average">Average</option>
        <option value = "Slow">Slow</option>
      </select>
      <span>Algorithm</span>
      <select onChange={(e) => setAlgo(e.target.value)}>
        <option value = "CBS">CBS</option>
      </select>
    </div>
  );
}

export default App;
