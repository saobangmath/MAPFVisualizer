import React from "react";
import { useState } from "react";
import styles from "./Agent_Table.module.css";

const Agent_Table = (props) => {
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
        {Object.keys(props.agents).map((key, index) => (
          <tr key={key}>
            <td>
              <p>
                <p className={styles.content}>Robot {key}</p>
                {<img className={styles.image} src={props.agents[key].img} alt="logo" />}
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
  );
};

export default Agent_Table;
