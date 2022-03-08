import logo from "./images/ap_visualizer-logo.png";
import PathImage from "./images/path.png";
import LandingPage from "./components/layouts/Landing_Page/Landing_page";
import "alertifyjs/build/css/alertify.css";
import "../src/alertify/css/themes/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import * as React from "react";
import CelebrateLogo from "./images/celebration.png";
import Game from "./components/layouts/Boards/gridmap";
import AgentsPage from "./components/layouts/Agents/Agents_Page";
import { useState, useRef } from "react";
import alertify from "alertifyjs";
import { maps } from "./mapconfig/maps";
import CloneGridmap from "./components/layouts/Boards/Clone_Gridmap";
import HelperTab from "./components/layouts/Tabs/HelperTab";
import {
  robots,
  pColors,
  sColors,
  rColors,
  browser,
  uploadFile,
  laptopImg,
} from "./Constants";

import {
  clone2DArray,
  getNextAgentID,
  generateDefaultAgent,
} from "./components/utility/Utility";

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
  let [mapModal, setMapModal] = useState(false);
  let [mapNum, setMapNum] = useState(0);
  let [customiseModal, setCustomiseModal] = useState(false);
  const fileRef = useRef();
  const [isHover, setHover] = useState(false);
  let [helperModal, setHelperModal] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const boxRef = React.useRef(null);

  const handleMouseEnter = () => {
    setHover(!isHover);
  };
  const showHelperModal = () => {
    setHelperModal(!helperModal);
  };

  if (isHover) {
    document.getElementById("speechBubble").style.animationName =
      "expand-bounce";
    document.getElementById("speechBubble").style.animationDuration = "0.5s";

    setTimeout(() => {
      document.getElementById("speechBubble").style.animationName = "shrink";
      document.getElementById("speechBubble").style.animationDuration = "0.5s";
    }, 2000);
    handleMouseEnter();
  }

  if (Object.keys(agents).length < 1) {
    let defaultAgent = generateDefaultAgent(
      1,
      gridMap,
      robots[1],
      pColors[1],
      sColors[1],
      rColors[1]
    );
    agents[1] = defaultAgent;
    setAgentsList(agents);
    // let joke = Object.keys(agents).slice(1, 3);
    // joke.map((key, index) => console.log("data is", agents[key]));
  }

  function resetMap(mapID) {
    if (!algoFinished) {
      alert("Can't reset the map when the algorithm is executed!");
      return;
    } else {
      alertify.confirm(
        "Do you want to change to this map?",
        "All robots will be removed excluding the default first robot during the process.",
        function () {
          let index = mapNum;
          index = mapID;
          if (index < 1) {
            index = 4;
          } else if (index > 4) {
            index = 1;
          }
          let updatedGridMap = null;
          updatedGridMap = clone2DArray(maps[index]);
          setMap(updatedGridMap);
          setStartBoard(updatedGridMap);
          setEndBoard(updatedGridMap);
          // reset the old agents;
          setAgentsList({});
          setAgentPaths({});
          showMapModal();
          alertify.success("Changed Map Successfully");
        },
        function () {
          showMapModal();
        }
      );
    }
  }

  const setMap = (points) => {
    setGridMap(points);
  };

  const handleFile = (event) => {
    console.log("event.target.files test:", event.target.files);
    // FileReader is built in to browser JS
    const fileReader = new FileReader();

    // Convert file to text
    fileReader.readAsText(event.target.files[0], "UTF-8");

    // When file is convertgged...
    fileReader.onload = (event) => {
      console.log("event.target.result", event.target.result);
      // Convert text to JS data
      const data = JSON.parse(event.target.result);

      // Updata state with file data
      let updatedGridMap = null;
      updatedGridMap = clone2DArray(data);
      setMap(updatedGridMap);
      setStartBoard(updatedGridMap);
      setEndBoard(updatedGridMap);
      // reset the old agents;
      setAgentsList({});
      setAgentPaths({});
      closeCustomiseModal();
    };
  };
  const showMapModal = () => {
    setMapModal(!mapModal);
  };
  const closeMapModal = (mapID) => {
    showMapModal();
  };

  const showCustomiseModal = () => {
    closeMapModal();
    setCustomiseModal(!customiseModal);
  };
  const closeCustomiseModal = () => {
    setCustomiseModal(!customiseModal);
  };
  const changeMapNo = (num) => {
    let index = mapNum;
    index = num;
    if (index < 1) {
      index = 4;
    } else if (index > 4) {
      index = 1;
    }
    setMapNum(index);
  };
  let nextID = getNextAgentID(agents);

  const handleMouseClick = () => {
    console.log("lol");
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
            setGridMapFunction={setMap}
            step={step}
            agentPaths={agentPaths}
          ></Game>
          <div className="legend_container">
            {agents != null
              ? Object.keys(agents).map((key, index) => (
                  <ul key={index}>
                    <div className="legend_header">
                      Robot {agents[key].agentId}
                    </div>
                    <div className="legend_row">
                      <li>
                        <img
                          className="legend_image"
                          src={agents[key].img}
                          alt="logo"
                        />
                        <div className="legend_text">
                          Robot {agents[key].agentId}
                        </div>
                      </li>
                      <li>
                        <div className="legend_icon">
                          <Square backgroundColor={agents[key].robotColor} />
                        </div>

                        <div className="legend_text">StartPoint</div>
                      </li>
                      <li>
                        <div className="legend_icon">
                          <Square backgroundColor={agents[key].endColor} />
                        </div>

                        <div className="legend_text">EndPoint</div>
                      </li>

                      <li>
                        <div className="legend_icon">
                          <Square backgroundColor={agents[key].pathColor} />
                        </div>
                        <div className="legend_text">Pathway</div>
                      </li>
                    </div>
                  </ul>
                ))
              : null}
            <div className="legend_footer">
              <div className="footer_text">Map:</div>
              <button className="legend_btn" onClick={showMapModal}>
                {retreiveMapName(mapNum)}
              </button>
            </div>
          </div>
          <div></div>
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
            setGridMapFunction={setMap}
            setStep={setStep}
            agentPaths={agentPaths}
            setAgentPaths={setAgentPaths}
            algoFinished={algoFinished}
            setAlgoFinished={setAlgoFinished}
            startBoard={startBoard}
            endBoard={endBoard}
            setStartBoard={setStartBoard}
            setEndBoard={setEndBoard}
          ></AgentsPage>
        </div>

        <div onClick={showHelperModal} className="helperContainer">
          <div
            className="cute-robot-v1"
            ref={boxRef}
            onMouseEnter={handleMouseEnter}
          >
            <div className="circle-bg">
              <div className="robot-ear left"></div>
              <div className="robot-head">
                <div className="robot-face">
                  <div className="eyes left"></div>
                  <div className="eyes right"></div>
                  <div className="mouth"></div>
                </div>
              </div>
              <div className="robot-ear right"></div>
              <div className="robot-body"></div>
            </div>
          </div>

          <div id="speechBubble" className="box3 sb13">
            Hi,I'm robot helper.<br></br>
            Feel free to click me for help.
          </div>
        </div>
      </div>
      {mapModal && (
        <div className="modalAdd">
          <div className="overlay" onClick={showMapModal}></div>
          <div className="spacing"></div>
          <div className="modal_content">
            <div className="modal_header">
              <button
                className="arrow left"
                onClick={() => changeMapNo(mapNum - 1)}
              ></button>
              <div className="modal_title">{retreiveMapName(mapNum)}</div>
              <button
                className="arrow right"
                onClick={() => changeMapNo(mapNum + 1)}
              ></button>
            </div>
            <button className="closeBtn" onClick={() => closeMapModal(mapNum)}>
              X
            </button>
            <div className="modal_map">
              <CloneGridmap mapNo={mapNum}></CloneGridmap>
            </div>
            <div className="btn_container">
              <button className="map_btn" onClick={() => resetMap(mapNum)}>
                Choose Map
              </button>

              <button
                className="customise_btn"
                onClick={() => showCustomiseModal()}
              >
                Click Here To Customise Your Own Map
              </button>
            </div>
          </div>
        </div>
      )}
      {customiseModal && (
        <div className="modalAdd">
          <div className="overlay" onClick={showMapModal}></div>
          <div className="spacing"></div>
          <div className="modal_content">
            <button className="closeBtn" onClick={showCustomiseModal}>
              X
            </button>
            <div className="modalTitle">
              <p>How To Customise Your Map</p>
            </div>
            <div className="firstContainer">
              <p className="containerHeader">Step 1</p>
              <img
                className="customiseImage"
                src={laptopImg}
                alt="laptop"
              ></img>
              <p className="containerDesc">
                Go to our{" "}
                <a
                  href="https://theturtle27.github.io/map_editor/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="containerLink"
                >
                  Map Crafting Website
                </a>
              </p>
            </div>
            <div className="secondContainer">
              <p className="containerHeader">Step 2</p>
              <img className="customiseImage" src={browser} alt="browser"></img>
              <p className="containerDesc">
                Craft your own map & download the map
              </p>
            </div>
            <div className="thirdContainer">
              <p className="containerHeader">Step 3</p>
              <img
                className="containerImage"
                src={uploadFile}
                alt="uploadFile"
              ></img>
              <button
                className="uploadBtn"
                onClick={() => fileRef.current.click()}
              >
                Click here to upload your map
              </button>
              <input
                ref={fileRef}
                onChange={handleFile}
                multiple={false}
                type="file"
                hidden
              ></input>
            </div>
          </div>
        </div>
      )}
      {/* robot helper */}
      {helperModal && (
        <div className="modalHelper">
          <div className="overlay" onClick={showHelperModal}></div>
          <div className="spacing"></div>
          <div className="modal_content">
            <HelperTab></HelperTab>
          </div>
        </div>
      )}
    </div>
  );
}
function Square(props) {
  return (
    <button
      className="square"
      style={{
        backgroundColor: props.backgroundColor ?? "white",
      }}
    ></button>
  );
}
function retreiveMapName(mapNum) {
  switch (mapNum) {
    case "1":
      return "Map 1";
    case "2":
      return "Map 2";
    case "3":
      return "Map 3";
    case "4":
      return "Map 4";
    default:
      return "Default Map";
  }
}

export default App;
