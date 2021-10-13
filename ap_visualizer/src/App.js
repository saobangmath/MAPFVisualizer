import logo from "./images/ap_visualizer-logo.png";
import PathImage from "./images/path.png";
import LandingPage from "./components/layouts/Landing_Page";
import "./App.css";
import { useState } from "react";
import * as React from "react";
import CelebrateLogo from "./images/celebration.png";
function App() {
  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />

      <LandingPage image={logo} image1={PathImage} image2={CelebrateLogo} />
    </div>
  );
}

export default App;
