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
import { maps } from './maps';



function App() {
  var [agents, setAgentList] = useState([]);
  var [gridMap, setGridMap] = useState(maps.mapdefault);

  function changeGrid(value){

    
    switch(value) {
      case "1":
        setGridMap(prevGridMap => 
        maps.map1)
        break;
      case "2":
        setGridMap(prevGridMap => 
        maps.map2)
        break;
      case "3":
        setGridMap(prevGridMap => 
        maps.map3)
        break;
      case "4":
        setGridMap(prevGridMap => 
        maps.map4)
        break;
      default:
        setGridMap(prevGridMap => 
        maps.mapdefault)
  }
}

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
          <Game gridMap={gridMap} agents={agents} mapping={setMap}></Game>
        </div>
        <div className="Container">
          <AgentsPage
            robotImage={robots}
            agentNo={1}
            agents={agents}
            gridMap={gridMap}
            mapping={setMap}
          ></AgentsPage>
        </div>
      </div>
      <span>Map</span>
      <select onChange={e=>changeGrid(e.target.value)}>
    <option value="N/A">N/A</option>
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
      </select>
    </div>
  );
}

export default App;
