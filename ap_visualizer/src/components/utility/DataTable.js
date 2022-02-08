import { useState, useEffect } from "react";
import React from "react";
const calculateRange = (data, rowsPerPage) => {
  const range = [];
  const num = Math.ceil(Object.keys(data).length / rowsPerPage);
  let i = 1;
  for (let i = 1; i <= num; i++) {
    range.push(i);
  }
  console.log("the range is ", range);
  return range;
};

const sliceData = (data, page, rowsPerPage) => {
  return Object.keys(data)
    .map(function (key) {
      return data[key];
    })
    .slice((page - 1) * rowsPerPage, page * rowsPerPage);
};
export const DataTable = (data, page, rowsPerPage) => {
  // let [tableRange, setTableRange] = useState([]);
  // let [slice, setSlice] = useState([]);
  let tableRange = calculateRange(data, rowsPerPage);
  let slice = sliceData(data, page, rowsPerPage);
  return { slice, range: tableRange };
};

export default DataTable;
