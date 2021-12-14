import React from "react";
import classes from "./Landing_Page.module.css";
import { useState } from "react";

function Agents_page(props) {
  var [addModal, setModalIsOpen] = useState(false);
  var [startPoint, setStartPoint] = useState(null);
  var [endPoint, setEndPoint] = useState(null);
  const addAgents = () => {
    setModalIsOpen(!addModal);
  };
  var agentArray = [];

  const handleStartPoint = (point) => {
    console.log("the point is ", point);
    setStartPoint(point);
    console.log("the start point is ", startPoint);
  };
  const handleEndPoint = (point) => {
    setEndPoint(point);
    console.log("the end point is ", endPoint);
  };

  return (
    <>
      <button className={classes.btn} onClick={addAgents}>
        Add
      </button>
      <button className={classes.btn} onClick={showAgent(agentArray)}>
        joke
      </button>
      {addModal && (
        <div className={classes.modalAdd}>
          <div className={classes.overlay} onClick={addAgents}></div>
          <div className={classes.spacing}></div>
          <div className={classes.modal_content}>
            <img src={props.robotImage} alt="logo" />
            <h1>Agent {props.agentNo}</h1>
            <p>Start Point:</p>
            <Game
              destination="start"
              gridMap=""
              startPoint={() => handleStartPoint}
            ></Game>
            <p>End Point:</p>

            <Game
              destination="end"
              gridMap=""
              endPoint={() => handleEndPoint}
            ></Game>
            <button
              onClick={
                (createAgent(
                  agentArray,
                  props.agentNo
                  // startPoint,
                  // endPoint,
                ),
                addAgents)
              }
            >
              Assign
            </button>
          </div>
        </div>
      )}
    </>
  );
}
function showAgent(agentArray) {
  for (var j = 0; j < agentArray.length; j++) {
    // console.log(agentArray[j]);
  }
  // console.log("done");
}
function createAgent(agentArray, agentNo, startPoint, endPoint) {
  // var map = [];

  var agent = {
    height: 5,
    width: 5,
    agentNo: agentNo,
    startPoint: startPoint,
    endPoint: endPoint,
  };
  agentArray.push(agent);
  // console.log("push");
}

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
          {this.renderSquare(3)}
          {this.renderSquare(4)}
        </div>
        <div className="board-row">
          {this.renderSquare(5)}
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
          {this.renderSquare(9)}
        </div>
        <div className="board-row">
          {this.renderSquare(10)}
          {this.renderSquare(11)}
          {this.renderSquare(12)}
          {this.renderSquare(13)}
          {this.renderSquare(14)}
        </div>
        <div className="board-row">
          {this.renderSquare(15)}
          {this.renderSquare(16)}
          {this.renderSquare(17)}
          {this.renderSquare(18)}
          {this.renderSquare(19)}
        </div>
        <div className="board-row">
          {this.renderSquare(20)}
          {this.renderSquare(21)}
          {this.renderSquare(22)}
          {this.renderSquare(23)}
          {this.renderSquare(24)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
    };
  }
  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    for (var j = 0; j < squares.length; j++) {
      squares[j] = null;
    }
    squares[i] = i;
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
    });
    switch (this.props.destination) {
      case "start":
        console.log("the start", this.props.startPoint);
        // this.props.startPoint.handleStartPoint(i);
        break;
      case "end":
        console.log("the end", i);
        // this.props.startPoint.handleEndPoint(i);

        break;
      default:
        break;
    }
  }
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
      </div>
    );
  }
}

export default Agents_page;
