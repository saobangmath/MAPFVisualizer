import logo from "./images/ap_visualizer-logo.png";
import PathImage from "./images/path.png";
import LandingPage from "./components/layouts/Landing_Page/Landing_page";
import "./App.css";
import * as React from "react";
import CelebrateLogo from "./images/celebration.png";
import Game from "./components/layouts/Boards/gridmap";
import AgentsPage from "./components/layouts/Agents/Agents_Page";
import { useState } from "react";
import { robots, pColors } from "./utility/Constants";

function App() {
  let [agents, setAgentsList] = useState({}); // {id : {{startPoint: {row: 1, col: 1}, endPoint: {row: 1, col: 4}}}
  let [gridMap, setGridMap] = useState(
    // hard-coded for now;
    Array(5)
      .fill(null)
      .map((row) => new Array(5).fill(null))
  );
  let [agentPaths, setAgentPaths] = useState([]);
  let [step, setStep] = useState(0); // display the step that the current grid map is visualized;

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
            robotImage={robots[Object.keys(agents).length + 1]}
            agentNo={Object.keys(agents).length + 1}
            endColor={pColors[Object.keys(agents).length + 1]}
            agents={agents}
            setAgentsList={setAgentsList}
            gridMap={gridMap}
            mapping={setMap}
            setStep={setStep}
            agentStep={step}
            setAgentPaths={setAgentPaths}
          ></AgentsPage>
        </div>
      </div>
    </div>
  );
}

export default App;
