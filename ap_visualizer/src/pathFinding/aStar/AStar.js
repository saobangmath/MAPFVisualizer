let Cell = require("../Cell")
let State = require("./State");
let Utils = require("../utils");
let Constants = require("../Constants");

class AStar{
    constructor(map) {
        this.map = map;
        this.parentMaps = {};
        for (let agentID in map.agents){
            this.parentMaps[agentID] = {}; // the map to map the parent of one cell -> other;
        }
        this.expanded_nodes = 0;
        this.execution_time = 0;
    }
    solve(){
        let startTime = Utils.getTime();
        let OPEN_LIST = []; // the queue to process the expanded node;
        let CLOSE_LIST = []; // those nodes that has been expanded;
        let curState = {} // initial location of the agents;
        let h = 0;
        for (let agentID in this.map.agents){
            curState[agentID] = this.map.agents[agentID]["START"];
            h += Utils.getManhattanDistance(curState[agentID], this.map.agents[agentID]["DEST"]);
        }
        this.expanded_nodes = 0;
        let INITIAL_STATE = new State(0, curState, 0); // {cur : 0, curState : curState, timeStep : 0};
        INITIAL_STATE.g = 0;
        INITIAL_STATE.h = h;
        INITIAL_STATE.f = h;
        let last_moment = -1;
        this.updateList(OPEN_LIST, INITIAL_STATE);
        while (OPEN_LIST.length > 0){
            let curTime = Utils.getTime();
            if (curTime - startTime >= Constants.TIME_CUTOFF){
                break;
            }
            let pos = this.getMinimumState(OPEN_LIST);
            let state = OPEN_LIST[pos];
            OPEN_LIST.splice(pos, 1);
            if (state.cur == this.map.no_agents){ // when all agent next step has been processed;
                for (let i = 0; i < state.agentsOrder.length; i++){
                    let agentID = state.agentsOrder[i];
                    let curCoorID = Utils.coordinatesToId(state.curState[agentID].x, state.curState[agentID].y, this.map.width);
                    let nextCoorID = Utils.coordinatesToId(state.posState[agentID].x, state.posState[agentID].y, this.map.width);
                    this.parentMaps[agentID][[nextCoorID, state.timeStep + 1]] = [curCoorID, state.timeStep];
                }
                if (this.isDestination(state)){ // encounter the last state;
                    last_moment = state.timeStep + 1;
                    break;
                }
                CLOSE_LIST.push(state);
                let new_state = new State(0, state.posState, state.timeStep + 1);
                new_state.f = state.f;
                new_state.g = state.g;
                new_state.h = state.h;
                this.updateList(OPEN_LIST, new_state);
            }
            else{ // do the plan for the nextAgent;
                let agentID = state.agentsOrder[state.cur];
                let goalCell = this.map.agents[agentID]["DEST"];
                let cur_x = state.curState[agentID].x;
                let cur_y = state.curState[agentID].y;
                for (let i = 0; i < Utils.directions.length; i++){
                    let direction = Utils.directions[i];
                    let next_x = cur_x + direction[0];
                    let next_y = cur_y + direction[1];
                    if (next_x < 0 || next_y < 0 || next_x >= this.map.height || next_y >= this.map.width || this.map.grid[next_x][next_y] === "@"){
                        continue;
                    }
                    if (this.hasConflict(state, cur_x, cur_y, next_x, next_y)){
                        continue;
                    }
                    let new_state = state.clone();
                    let cur_cell = new Cell(cur_x, cur_y);
                    new_state.cur++;
                    if (!cur_cell.is_equal(goalCell)){
                       new_state.g++;
                    }
                    new_state.h -= Utils.getManhattanDistance(new Cell(cur_x, cur_y), goalCell);
                    new_state.h += Utils.getManhattanDistance(new Cell(next_x, next_y), goalCell);
                    new_state.f = new_state.g + new_state.h;
                    new_state.posState[agentID] = new Cell(next_x, next_y);

                    if (new_state.cur == this.map.no_agents) {
                        let openIndex = this.findBestIndex(OPEN_LIST, new_state , this.map.no_agents);
                        let closeIndex = this.findBestIndex(CLOSE_LIST, new_state, this.map.no_agents);

                        if (openIndex != -1 && OPEN_LIST[openIndex].f <= new_state.f) {
                            continue;
                        }
                        if (closeIndex != -1 && CLOSE_LIST[closeIndex].f <= new_state.f) {
                            continue;
                        }
                    }
                    this.updateList(OPEN_LIST, new_state);
                }
            }
        }
        let solutions = {};
        if (last_moment == -1){
            this.execution_time = Utils.getTime() - startTime;
            return {"paths" : solutions,
                    "expanded_nodes" : this.expanded_nodes,
                    "execution_time" : this.execution_time};
        }
        // there is solution found!;
        for (let agentID in this.map.agents){
            let path = [];
            let start_x = this.map.agents[agentID]["START"].x;
            let start_y = this.map.agents[agentID]["START"].y;
            let cur_time = last_moment;
            let cur_x = this.map.agents[agentID]["DEST"].x;
            let cur_y = this.map.agents[agentID]["DEST"].y;
            while (cur_time != 0 || cur_x != start_x || cur_y != start_y){
                path.push(new Cell(cur_x, cur_y));
                let [XY, time] = this.parentMaps[agentID][[Utils.coordinatesToId(cur_x, cur_y, this.map.width), cur_time]];
                [cur_x, cur_y] = Utils.idToCoordinates(XY, this.map.width);
                cur_time = time;
            }
            path.push(new Cell(start_x, start_y));
            path.reverse();
            solutions[agentID] = path;
        }
        // for each agent, remove those cell from end that's equal to the destination cell;
        for (let agentID in this.map.agents){
            let last = solutions[agentID].length - 1;
            while (last > 0 && solutions[agentID][last].is_equal(solutions[agentID][last-1])){
                solutions[agentID].pop();
                last--;
            }
        }
        this.execution_time = Utils.getTime() - startTime;
        return {"paths" : solutions,
                "expanded_nodes" : this.expanded_nodes,
                "execution_time" : this.execution_time};
    }

    hasConflict(state, curX, curY, nextX, nextY){
        for (let i = 0; i < state.cur; i++){
            let agentID = state.agentsOrder[i];
            let curXi = state.curState[agentID].x;
            let curYi = state.curState[agentID].y;
            let nextXi = state.posState[agentID].x;
            let nextYi = state.posState[agentID].y;
            if (nextX == nextXi && nextY == nextYi){ // normal conflict
                return true;
            }
            if (nextX == curXi && nextY == curYi && curX == nextXi && curY == nextYi){ // edge conflict
                return true;
            }
        }
        return false;
    }

    // get the state with minimum cost;
    getMinimumState(LIST){
        let index = -1, cost = 1e9;
        for (let i = 0; i < LIST.length; i++){
            if (cost >= LIST[i].f){
                cost = LIST[i].f;
                index = i; // take the latest node with minimum cost; this somehow work well in visualization;
            }
        }
        return index;
    }

    // check if all agents are arriving the destination;
    isDestination(state){
        for (let agentID in state.posState){
            let goal = this.map.agents[agentID]["DEST"];
            if (!goal.is_equal(state.posState[agentID])){
                return false;
            }
        }
        return true;
    }

    // all nodes in LIST are standard nodes -> return the node with curState == state.posState and minimum cost;
    findBestIndex(LIST, state, no_agents){
        let minCost = 1e9, h = 1e9, index = -1;
        for (let i = 0; i < LIST.length; i++){
            let st = LIST[i];
            let equal = true;
            if (st.cur != no_agents){
                continue;
            }
            for (let agentID in this.map.agents){
                if (!st.curState[agentID].is_equal(state.posState[agentID])){
                    equal = false; break;
                }
            }
            if (equal && minCost > st.f){
                minCost = st.f;
                index = i;
                h = st.h;
            }
            if (equal && minCost == st.f && h > st.h){
                index = i;
                h = st.h;
            }
        }
        return index;
    }

    // push the new state to the open_list and increment the expanded nodes by 1;
    updateList(OPEN_LIST, state){
        OPEN_LIST.push(state);
        this.expanded_nodes++;
    }
};

module.exports = AStar;