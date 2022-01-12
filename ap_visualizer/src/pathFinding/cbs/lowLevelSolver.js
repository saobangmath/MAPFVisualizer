const Cell = require('../Cell')
const Utils = require('../utils')
const assert = require('assert')
const constants = require('./Constants')

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

    // the index (w.r.t L) of element == successor with minimum f value as well as time >= successor;
    findBestIndex(L, successor){
        let minCost = 1e9, index = -1
        for (let i = 0; i < L.length; i++){
            assert(L[i]!=null)
            if (L[i].is_equal(successor) && L[i].f < minCost && L[i].time >= successor.time) {
                index = i
                minCost = L[i].f
            }
        }
        return index
    }

    // remove bad expanded candidates in list L;
    go(L, successor){
        let candidates = [];
        let remove = 0;
        for (let i = 0; i < L.length; i++){
            if (L[i].is_equal(successor) && L[i].f >= successor.f && L[i].time <= successor.time) {
                candidates.push(i);
            }
        }
        for (let i = 0; i < candidates.length; i++){
            L.splice(candidates[i] - remove, 1);
            remove++;
        }
    }

    isConstraint(agentID, cell, constraints){
        for (let i = 0; i < constraints.length; i++){
            let constraint = constraints[i];
            assert(constraint.cell != null)
            if (constraint.agentID == agentID && constraint.cell.is_equal(cell) && constraint.time == cell.time){
                return true;
            }
        }
        return false;
    }

    findOptimalPathForIndividualAgent(constraints, map, agentID){
        this.optimalPath = []
        let parentMaps = {} // {[id,time]: [id,time]}
        let startCell = map.agents[agentID]["START"]
        let destCell = map.agents[agentID]["DEST"]
        this.OPEN.push(startCell)
        /// A* algorithm search use for the low-level search
        let pos = 0
        let current_cell = startCell;
        let cur_x = destCell.x;
        let cur_y = destCell.y;
        let cur_time = -1
        let found = false;
        while (this.OPEN.length > 0) {
            pos = this.findMinCostCellPosition(this.OPEN)
            current_cell = this.OPEN.splice(pos, 1)[0]
            this.CLOSE.push(current_cell)
            if (current_cell.is_equal(destCell) && !this.isConstraint(agentID, current_cell, constraints)) { // find solution when the current_cell is similar with the dest_cell & the expanded_cell is not the constraint;
                cur_time = current_cell.time
                found = true;
                break;
            }

            for (let i = 0; i  < Utils.directions.length; i++) { // expanded to the neighbors;
                let direction = Utils.directions[i];
                let next_x = direction[0] + current_cell.x;
                let next_y = direction[1] + current_cell.y;
                if (Utils.validateCell(next_x, next_y, map.height, map.width) && map.grid[next_x][next_y] != '@') {
                    let expanded_cell = new Cell(next_x, next_y);
                    expanded_cell.g = current_cell.g + 1;
                    expanded_cell.h = Utils.getHeuristicDistance(expanded_cell, destCell, Utils.getManhattanDistance);
                    expanded_cell.f = expanded_cell.g + expanded_cell.h;
                    expanded_cell.time = current_cell.time + 1;
                    if (expanded_cell.time >= constants.STEPS_CUTOFF){
                        continue;
                    }
                    if (this.isConstraint(agentID, expanded_cell, constraints)) {
                        continue;
                    }
                    this.go(this.OPEN, expanded_cell)
                    this.go(this.CLOSE, expanded_cell)
                    let openIndex = this.findBestIndex(this.OPEN, expanded_cell)
                    let closeIndex = this.findBestIndex(this.CLOSE, expanded_cell)
                    if (openIndex != -1 && expanded_cell.f > this.OPEN[openIndex].f){ // same cell in open list with better f value;
                        continue;
                    }
                    if (closeIndex != -1 && expanded_cell.f > this.CLOSE[closeIndex].f){ // same cell in close list with better f value;
                        continue;
                    }
                    parentMaps[[Utils.coordinatesToId(expanded_cell.x, expanded_cell.y, map.width), expanded_cell.time]] =
                        [Utils.coordinatesToId(current_cell.x, current_cell.y, map.width), current_cell.time]
                    this.OPEN.push(expanded_cell);
                }
            }
        }
        if (!found){
            console.log("No solution for agent " + agentID);
            return [];
        }
        while (!(cur_x == startCell.x && cur_y == startCell.y && cur_time == 0)){
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
        return this.optimalPath
    }

    findOptimalPaths(constraints, map){
        let optimalPaths = {}
        // solve for each agent individually;
        for (let id in map.agents){
            let individualPath = this.findOptimalPathForIndividualAgent(constraints, map, id);
            if (individualPath.length > 0) {
                optimalPaths[id] = individualPath;
            }
            else{
                return {};
            }
        }
        return optimalPaths;
    }
}

module.exports = LowLevelSolver