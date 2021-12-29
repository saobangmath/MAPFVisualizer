import logo from "./images/ap_visualizer-logo.png";
import PathImage from "./images/path.png";
import LandingPage from "./components/layouts/Landing_Page/Landing_page";
import "./App.css";
import * as React from "react";
import CelebrateLogo from "./images/celebration.png";
import Game from "./components/layouts/Boards/gridmap";
import robots from "./images/robot.png";
import AgentsPage from "./components/layouts/Agents/Agents_Page";
import { useState } from "react";

// hard coded map for now;
let grid =  [['.', '.', '.', '.'],
             ['.', '.', '.', '.'],
             ['.', '@', '@', '.'],
             ['@', '.', '.', '.']]

function App() {
  var [agents, setAgentList] = useState([]);
  var [gridMap, setGridMap] = useState(grid);
  var [agentPaths, setAgentPaths] = useState([]);
  var [step, setStep] = useState(0); // display the step that the current gridmap is visualized;

  const getAgentList = (agent) => {
    setAgentList(agent);
    console.log("the agent is ", agent);
  };
  const setMap = (points) => {
    setGridMap(points);
  };
  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <LandingPage image={logo} image1={PathImage} image2={CelebrateLogo} />
      <div>
        <div className="Container">
          <Game gridMap={gridMap}
                agents={agents}
                mapping={setMap}
                step = {step}
                agentPaths = {agentPaths}>
          </Game>
        </div>
        <div className="Container">
          <AgentsPage
            robotImage={robots}
            agentNo={1}
            agents={agents}
            gridMap={gridMap}
            mapping={setMap}
            setStep={setStep}
            setAgentPaths={setAgentPaths}
          ></AgentsPage>
        </div>
          <button onClick={() => {setStep(step + 1)}}>NEXT</button>
          <button onClick={() => {setStep(Math.max(step-1, 0))}}>PREV</button>
      </div>
    </div>
  );
}

export default App;
