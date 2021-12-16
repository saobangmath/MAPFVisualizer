import logo from "./images/ap_visualizer-logo.png";
import PathImage from "./images/path.png";
import LandingPage from "./components/layouts/Landing_Page/Landing_page";
import "./App.css";
import * as React from "react";
import CelebrateLogo from "./images/celebration.png";
import Game from "./components/layouts/Boards/gridmap";
import robots from "./images/robot.png";
import AgentsPage from "./components/layouts/Agents/Agents_Page";

function App() {
  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />

      <LandingPage image={logo} image1={PathImage} image2={CelebrateLogo} />
      <Game></Game>
      <div>
        <AgentsPage robotImage={robots} agentNo={1}></AgentsPage>
      </div>
    </div>
  );
}

export default App;
