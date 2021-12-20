const Cell = require('../Cell')
const Utils = require('../utils')
const assert = require('assert')

/**
 * return the plan of individual agents such that it is consistent to its own constraint.
 * this might render conflicts to other agents plan but that's not important
 */
class LowLevelSolver{
    constructor() {
        this.optimalPath = []
        this.OPEN = []
        this.CLOSE = []
    }

    // find the position of the cell with minCost w.r.t the paths;
    findMinCostCellPosition(paths){
        let pos = -1;
        let curCost = 1e9
        for (let i = 0; i < paths.length; i++) {
            if (paths[i].f < curCost) {
                pos = i
                curCost = paths[i].f
            }
        }
        return pos;
    }

    // the index (w.r.t L) of element == successor with minimum f value;
    findBestIndex(L, successor){
        let minCost = 1e9, index = -1
        for (let i = 0; i < L.length; i++){
            assert(L[i]!=null)
            if (L[i].is_equal(successor) && L[i].f < minCost) {
                index = i
                minCost = L[i].f
            }
        }
        return index
    }

    isConstraint(time, agentID, cell, constraints){
        for (let i = 0; i < constraints.length; i++){
            let constraint = constraints[i];
            assert(constraint.cell != null)
            if (constraint.agentID == agentID && constraint.cell.is_equal(cell) && constraint.time == time){
                return true;
            }
        }
        return false;
    }

    findOptimalPathForIndividualAgent(constraints, map, agentID){
        // console.log("Constraints: " + constraints)
        this.optimalPath = []
        let parentMaps = {} // {[id,time]: [id,time]}
        let startCell = map.agents[agentID]["START"]
        let destCell = map.agents[agentID]["DEST"]
        this.OPEN.push(startCell)
        /// A* algorithm search use for the low-level search
        let pos = 0
        let current_cell = startCell
        let cur_x = destCell.x;
        let cur_y = destCell.y;
        let cur_time = -1
        // console.log("LowLevelSolver: START")
        while (this.OPEN.length > 0) {
            pos = this.findMinCostCellPosition(this.OPEN)
            current_cell = this.OPEN.splice(pos, 1)[0]
            this.CLOSE.push(current_cell)
            if (current_cell.is_equal(destCell)) { // find solution
                cur_time = current_cell.time
                break;
            }
            for (let i = 0; i  < Utils.directions.length; i++) { // expanded to the neighbors;
                let direction = Utils.directions[i];
                let next_x = direction[0] + current_cell.x;
                let next_y = direction[1] + current_cell.y;
                if (Utils.validateCell(next_x, next_y, map.height, map.width) && map.grid[next_x][next_y] != '@') {
                    let expanded_cell = new Cell(next_x, next_y);
                    expanded_cell.g = current_cell.g + 1;
                    expanded_cell.h = Utils.getManhattanDistance(expanded_cell, destCell);
                    expanded_cell.f = expanded_cell.g + expanded_cell.h;
                    expanded_cell.time = current_cell.time + 1;
                    if (this.isConstraint(expanded_cell.time, agentID, expanded_cell, constraints)) {
                        // allow the agent to stay back to the current_cell;
                        expanded_cell.x = current_cell.x
                        expanded_cell.y = current_cell.y
                        expanded_cell.g = current_cell.g
                        expanded_cell.h = current_cell.h
                        this.OPEN.push(expanded_cell)
                        parentMaps[[Utils.coordinatesToId(expanded_cell.x, expanded_cell.y, map.width), expanded_cell.time]] =
                                        [Utils.coordinatesToId(current_cell.x,current_cell.y,map.width), current_cell.time]
                        continue;
                    }
                    let openIndex = this.findBestIndex(this.OPEN, expanded_cell)
                    let closeIndex = this.findBestIndex(this.CLOSE, expanded_cell)
                    let ok = true;
                    if (openIndex != -1 && expanded_cell.f > this.OPEN[openIndex].f){ // same cell in open list with better f value;
                        //console.log("Continue as open has better node!")
                        ok = false;
                        //continue;
                    }
                    if (closeIndex != -1 && expanded_cell.f > this.CLOSE[closeIndex].f){ // same cell in close list with better f value;
                        //console.log("Continue as close has better node!")
                        ok = false;
                        //continue;
                    }
                    if (openIndex != -1){ // remove the worst state in OPEN list;
                        // console.log(this.OPEN)
                        this.OPEN.splice(openIndex, 1)
                        //console.log(this.OPEN)
                    }
                    if (closeIndex != -1){ // remove the worst state in CLOSE list;
                        //console.log(this.CLOSE)
                        this.CLOSE.splice(closeIndex, 1);
                        //console.log(this.CLOSE)
                    }
                    if (ok) {
                        parentMaps[[Utils.coordinatesToId(expanded_cell.x, expanded_cell.y, map.width), expanded_cell.time]] =
                            [Utils.coordinatesToId(current_cell.x, current_cell.y, map.width), current_cell.time]
                        this.OPEN.push(expanded_cell);
                    }
                }
            };
        }
        // console.log("LowLevelSolver: " + "Done with process OPEN List")
        // console.log("Startcell: " + startCell.x + ", " + startCell.y);
        // console.log("Destcell: " + destCell.x + ", " + destCell.y);
        while (!(cur_x == startCell.x && cur_y == startCell.y)){
            this.optimalPath.push(new Cell(cur_x, cur_y));
            let [XY, time] = parentMaps[[Utils.coordinatesToId(cur_x, cur_y, map.width), cur_time]];
            XY = Utils.idToCoordinates(XY, map.width)
            cur_x = XY[0]
            cur_y = XY[1]
            cur_time = time;
        }
        this.optimalPath.push(startCell)
        this.optimalPath.reverse()
        this.OPEN = []
        this.CLOSE = []
        // console.log("Done!")
        return this.optimalPath
    }

    findOptimalPaths(constraints, map){
        let optimalPaths = []
        // solve for each agent individually;
        for (let id = 1; id <= map.no_agents; id++){
            optimalPaths.push(this.findOptimalPathForIndividualAgent(constraints, map, id))
        }
        return optimalPaths
    }
}

module.exports = LowLevelSolver