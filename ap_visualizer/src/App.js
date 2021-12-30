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
import agent1 from "./images/agent1.png";
import agent2 from "./images/agent2.png";
import agent3 from "./images/agent3.png";

// hard coded map for now;
let grid =  [['@', '.', '.', '@'],
             ['.', '.', '.', '.'],
             ['.', '.', '.', '.'],
             ['@', '.', '.', '@']]

//1: [[0,1] -> [0,2]]; 2: [[0,3] -> [0,4]] -> [[[0,1], [0,2]], [[0,3],[0,4]]]
function App() {
  let [agents, setAgentList] = useState([]);
  let [gridMap, setGridMap] = useState( // hard-coded for now;
      Array(5)
          .fill(null)
          .map((row) => new Array(5).fill(null))
  );
  let [agentPaths, setAgentPaths] = useState([]);
  let [step, setStep] = useState(0); // display the step that the current gridmap is visualized;

  let robots = [agent1, agent2, agent3]; // hard-coded robots image;
  let pColors = ["#EC10FF", "#06538D", "#FFAE11"]; // hard-coded colors;

  const getAgentList = (agent) => {
    setAgentList(agent);
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
                agentPaths = {agentPaths}
                robotImage={robots[0]}>
          </Game>
        </div>
        <div className="Agent-Container">
          <AgentsPage
            robotImage={robots[agents.length ? agents.length : 0]}
            agentNo={agents.length + 1}
            endColor={pColors[agents.length ? agents.length : 0]}
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
