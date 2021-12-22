import React from "react";
import { useState } from "react";
import styles from "./Agent_Table.module.css";

const Agent_Table = ({ agents }) => {
  const [agent, setAgentList] = useState(agents);

  return (
    <table>
      <tr key={"header"}>
        {/* {Object.keys(agent[0]).map((key) => (
          <th>{key}</th>
        ))} */}
        <th>Robot No.</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
      {agent.map((item) => (
        <tr key={item.id}>
          <td>{item.agentNo}</td>
          <td>
            <button className={styles.statusBtn}>Available</button>
          </td>
          <td>
            <button className={styles.actionBtn}>Assign</button>
          </td>
        </tr>
      ))}
    </table>
  );
};

export default Agent_Table;
