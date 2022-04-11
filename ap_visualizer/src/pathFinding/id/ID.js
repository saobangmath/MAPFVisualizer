const CBS = require("../cbs/highLevelSolver");
const aStar = require("../aStar/AStar");
const Utils = require("../utils");

/**
 * independent detection (ID) - a framework used to apply on top of any complete MAPF solver (e.g. CBS, A* + OD)
 */

class ID{
    constructor(solver, map) {
        this.map = map;
        this.solver = solver;
        this.groups = new Array(map.agents.length);
        let j = 0;
        for (let agentID in map.agents){ // initially each agent is divided in a separate group;
            this.groups[j] = {};
            this.groups[j][agentID] = map.agents[agentID];
            j++;
        }
        this.group_paths = [];
        this.expanded_nodes = 0;
        this.execution_time = 0;
    }

    merge(i, j){ // merge group j to i;
        let x = this.groups.splice(j, 1)[0];
        // console.log("Before");
        // console.log(this.groups[i]);
        for (let agentID in x){
            this.groups[i][agentID] = x[agentID];
        }
        // console.log("After");
        // console.log(this.groups[i]);
        this.group_paths[i] = {};
        this.group_paths.splice(j, 1);
    }

    hasConflict(i, j){ // check if two groups i, j contains any conflicts;
        if (this.hasNormalConflict(i, j)){
            return true;
        }
        if (this.hasEdgeConflict(i, j)){
            return true;
        }
        return false;
    }

    /**
     * return if the 2 group i and j contains normal conflict;
     */
    hasNormalConflict(i, j){
        for (let agent1 in this.group_paths[i]){
            for (let agent2 in this.group_paths[j]){
                if (this._hasNormalConflict(this.group_paths[i][agent1], this.group_paths[j][agent2])){
                    return true;
                }
            }
        }
        return false;
    }

    _hasNormalConflict(route1, route2) {
        for (let time = 0; time < Math.max(route1.length, route2.length); time++) {
            let t1 = Math.min(time, route1.length - 1);
            let t2 = Math.min(time, route2.length - 1);
            if (route1[t1].is_equal(route2[t2])){
                return true;
            }
        }
        return false;
    }

    /**
     * return if the 2 group i and j contains edge conflict;
     */
    hasEdgeConflict(i, j){
        for (let agent1 in this.group_paths[i]){
            for (let agent2 in this.group_paths[j]){
                if (this._hasEdgeConflict(this.group_paths[i][agent1], this.group_paths[j][agent2])){
                    return true;
                }
            }
        }
        return false;
    }

    _hasEdgeConflict(route1, route2) { // return if any common edges (edge conflicts) between 2 given routes
        for (let time = 0; time < Math.min(route1.length, route2.length)-1; time++) {
            if (route1[time].is_equal(route2[time+1]) &&
                route1[time+1].is_equal(route2[time]))
                return true;
        }
        return false;
    }

    getSolver(){
        if (this.solver === "CBS"){
            return new CBS(this.map);
        }
        if (this.solver === "A*+OD"){
            return new aStar(this.map);
        }
        return null;
    }


    solve() {
        let startTime = Utils.getTime();
        let solution = {"paths" : {}};
        this.group_paths = new Array(this.groups.length);
        for (let id = 0; id < this.group_paths.length; id++){
            this.group_paths[id] = {};
        }
        while (true){
            let conflict = false;
            for (let id = 0; id < this.groups.length; id++){
                this.map.agents = this.groups[id];
                this.map.no_agents = Object.keys(this.groups[id]).length;
                if (Object.keys(this.group_paths[id]).length === 0) {
                    let plan = this.getSolver().solve();
                    this.group_paths[id] = plan["paths"];
                    if (Object.keys(this.group_paths[id]).length == 0){ // can't find path within group agent id;
                        this.execution_time = Utils.getTime() - startTime;
                        solution["expanded_nodes"] = this.expanded_nodes;
                        solution["execution_time"] = this.execution_time;
                        return solution;
                    }
                    this.expanded_nodes += plan["expanded_nodes"];
                }
                for (let pid = 0; pid < id; pid++){ // look for the planned group to see if there is any conflicts;
                    if (this.hasConflict(pid, id)){
                        conflict = true;
                        this.merge(pid, id);
                        break;
                    }
                }
                if (conflict){
                    break;
                }
            }
            if (!conflict){
                this.execution_time = Utils.getTime() - startTime; // the moment when the solution is found!
                for (let id = 0; id < this.group_paths.length; id++){
                    for(let agent in this.group_paths[id]){
                        solution["paths"][agent] = this.group_paths[id][agent];
                    }
                }
                solution["expanded_nodes"] = this.expanded_nodes;
                solution["execution_time"] = this.execution_time;
                return solution;
            }
        }
        solution["expanded_nodes"] = this.expanded_nodes;
        solution["execution_time"] = this.execution_time;
        return solution;
    }
};

module.exports = ID;

