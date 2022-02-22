const CBS = require("../cbs/highLevelSolver");
const aStar = require("../aStar/AStar");

/**
 * independent detection (ID) - a framework used to apply on top of any complete MAPF solver (e.g. CBS, A* + OD)
 */

class ID{
    constructor(solver, map) {
        this.solver = null;
        if (solver === "CBS"){
            this.solver = new CBS(map);
        }
        else if (solver === "A*+OD"){
            this.solver = new aStar(map);
        }
        this.groups = new Array(map.agents.length);
        let j = 0;
        for (let agentID in map.agents){ // initially each agent is divided in a separate group;
            this.groups[j] = {};
            this.groups[j][agentID] = map.agents[agentID];
            j++;
        }
        this.group_paths = [];
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
        // console.log("======================");
        // console.log(this.group_paths[i]);
        // console.log(this.group_paths[j]);
        // console.log("======================");
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


    solve() {
        let solution = {};
        this.group_paths = new Array(this.groups.length);
        for (let id = 0; id < this.group_paths.length; id++){
            this.group_paths[id] = {};
        }
        while (true){
            let conflict = false;
            for (let id = 0; id < this.groups.length; id++){
                this.solver.map.agents = this.groups[id];
                if (Object.keys(this.group_paths[id]).length === 0) {
                    this.group_paths[id] = this.solver.solve()["paths"];
                }
                // console.log("==========");
                // console.log(this.group_paths[id]);
                // console.log("==========");
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
                for (let id = 0; id < this.group_paths.length; id++){
                    for(let agent in this.group_paths[id]){
                        solution[agent] = this.group_paths[id][agent];
                    }
                }
                return solution;
            }
        }
        return {};
    }
};

module.exports = ID;

