import React from "react";

import "./Node.css";

const Node = ({isStart, isEnd, isTransition, row, col }) => {
    const classes = isStart ? "node-start" : isEnd ? "node-end" : isTransition ? "node-transition" : "";
    return <div className={`node ${classes}`} id={`node-${row}-${col}`}></div>;
};

export default Node;