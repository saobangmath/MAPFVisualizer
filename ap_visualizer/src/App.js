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

function App() {
  var [agents, setAgentList] = useState([]);
  var [gridMap, setGridMap] = useState(
    Array(5)
      .fill(null)
      .map((row) => new Array(5).fill(null))
  );
  var robots = [agent1, agent2, agent3];
  var pColors = ["#EC10FF", "#06538D", "#FFAE11"];

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
          <Game
            robotImage={robots[0]}
            gridMap={gridMap}
            agents={agents}
            mapping={setMap}
          ></Game>
        </div>
        <div className="Container">
          <AgentsPage
            robotImage={robots[agents.length ? agents.length - 1 : 0]}
            agentNo={agents.length + 1}
            endColor={pColors[agents.length ? agents.length - 1 : 0]}
            agents={agents}
            gridMap={gridMap}
            mapping={setMap}
          ></AgentsPage>
        </div>
      </div>
    </div>
  );
}

export default App;
