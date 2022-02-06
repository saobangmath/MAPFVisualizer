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
import { maps } from "./mapconfig/maps";
import { clone2DArray, getNextAgentID } from "./components/utility/Utility";
import CloneGridmap from "./components/layouts/Boards/Clone_Gridmap";
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
  let [mapName, setMapName] = useState("");

  // if(Object.keys(agents).length){
  //   let newAgents=agents;
  //   for(let index=1;index<=2;index++){
  //     newAgents[index]=GenerateDefaultAgents(index);
  //   }
  //   setAgentsList(agents);
  // }
  // reset all the variables of the gridMap;
  function resetMap(mapID) {
    if (!algoFinished) {
      alert("Can't reset the map when the algorithm is executed!");
      return;
    }
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
    // reset the old agents;
    setAgentsList({});
    setAgentPaths({});
    showMapModal();
  }

  const setMap = (points) => {
    setGridMap(points);
  };

  const showMapModal = () => {
    setMapModal(!mapModal);
  };
  const closeMapModal = (mapID) => {
    showMapModal();
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
              <button className="customise_btn">
                Click here to customise your map
              </button>
            </div>
          </div>
        </div>
      )}

      <span>Speed</span>
      <select onChange={(e) => setSpeed(e.target.value)}>
        <option value="Fast">Fast</option>
        <option value="Average">Average</option>
        <option value="Slow">Slow</option>
      </select>
      <span>Algorithm</span>
      <select onChange={(e) => setAlgo(e.target.value)}>
        <option value="CBS">CBS</option>
        <option value="A*+OD">A*+OD</option>
      </select>
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
