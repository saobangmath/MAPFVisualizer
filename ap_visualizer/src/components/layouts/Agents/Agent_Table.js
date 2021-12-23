import React from "react";
import { useState } from "react";
import styles from "./Agent_Table.module.css";

const Agent_Table = ({ agents }) => {
  const [agent, setAgentList] = useState(agents);
  console.log("agent is", agent);
  return (
    <table className={styles.styledTable}>
      <thead>
        <tr>
          <th>Robot No.</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {agent.map((item) => (
          <tr key={item.id}>
            <td>
              <p>
                <p className={styles.content}>Robot {item.agentNo}</p>
                {<img className={styles.image} src={item.img} alt="logo" />}
              </p>
            </td>
            <td>
              <button className={styles.statusBtn}>Available</button>
            </td>
            <td>
              <button className={styles.actionBtn}>Assign</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    // <table>
    //   <tr key={"header"}>
    //     {/* {Object.keys(agent[0]).map((key) => (
    //       <th>{key}</th>
    //     ))} */}
    //     <th>Robot No.</th>
    //     <th>Status</th>
    //     <th>Action</th>
    //   </tr>
    //   {agent.map((item) => (
    //     <tr key={item.id}>
    //       <td>{item.agentNo}</td>
    //       <td>
    //         <button className={styles.statusBtn}>Available</button>
    //       </td>
    //       <td>
    //         <button className={styles.actionBtn}>Assign</button>
    //       </td>
    //     </tr>
    //   ))}
    // </table>
  );
};

export default Agent_Table;
