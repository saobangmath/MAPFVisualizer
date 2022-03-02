const CTNode = require('./CTNode')
const Constraint = require('../Constraint')
const Conflict = require('../Conflict')
const Utils = require('../utils')
const Constants = require('../Constants')

/**
 Search the constraints tree
 using the lowLeverSolver() to find individual paths of the agents
 */

class highLevelSolver {
    constructor(map) {
        this.map = map;
        this.expanded_nodes = 0;
        this.execution_time = 0;
    }

    _getEdgeConflict(agent1, agent2, route1, route2) { // return any common edges (edge conflicts) between 2 given routes
        for (let time = 0; time < Math.min(route1.length, route2.length)-1; time++) {
            if (route1[time].is_equal(route2[time+1]) &&
                route1[time+1].is_equal(route2[time]))
                return new Conflict(agent1, agent2, route1[time], route1[time+1], time, time);
        }
        return null;
    }

    getEdgeConflict(node){ // return any edge edge conflicts within agents path that a CTNode has ;
        let solution = node.getSolution()
        for (let agent1 in this.map.agents){
            for (let agent2 in this.map.agents){
                if (agent1 <= agent2) continue;
                let conflict = this._getEdgeConflict(agent1, agent2, solution[agent1], solution[agent2]);
                if (conflict != null){
                    return conflict
                }
            }
        }
        return null;
    }

    _getNormalConflict(agent1, agent2, route1, route2) { // return any conflicts between 2 given routes
        for (let time = 0; time < Math.max(route1.length, route2.length); time++) {
            let t1 = Math.min(time, route1.length - 1);
            let t2 = Math.min(time, route2.length - 1);
            if (route1[t1].is_equal(route2[t2])){
                let conflict = new Conflict(agent1, agent2, route1[t1], route2[t2], t1, t2);
                return conflict;
            }
        }
        return null;
    }

    getNormalConflict(node){ // check if a CTNode has any conflicts between agents path;
        let solution = node.getSolution()
        for (let agent1 in this.map.agents){
            for (let agent2 in this.map.agents){
                if (agent1 <= agent2){
                    continue;
                }
                let conflict = this._getNormalConflict(agent1, agent2, solution[agent1], solution[agent2])
                if (conflict != null){
                    return conflict
                }
            }
        }
        return null;
    }

    findBestNodePosition(tree){
        if (tree.length == 0){
            return null;
        }
        let pos = -1;
        let minCost = 1e9
        for (let i = 0; i < tree.length; i++){
            let node = tree[i];
            if (node.cost < minCost){
                pos = i;
                minCost = node.cost;
            }
        }
        return pos
    }

    // push the new node to the tree && increment the number of nodes expanded;
    updateTree(tree, node){
        tree.push(node);
        this.expanded_nodes++;
    }

    solve() { // return a list of cells
        let startTime = Utils.getTime();
        this.expanded_nodes = 0;
        let root = new CTNode({})
        root.updateSolution(this.map, -1);
        root.updateCost()
        let tree = []
        this.updateTree(tree, root)
        if (Object.keys(root.solution).length == 0){ // there is some agents can't even simply go from start to destination;
            this.execution_time = Utils.getTime() - startTime;
            return {"paths" : {},
                    "expanded_nodes" : this.expanded_nodes,
                    "execution_time" : this.execution_time};
        }
        while (tree.length > 0){
            let curTime = Utils.getTime();
            if (curTime - startTime >= Constants.TIME_CUTOFF){
                break;
            }
            let pos = this.findBestNodePosition(tree) // get the node with minimum cost;
            let P = tree[pos]
            let normalConflict = this.getNormalConflict(P)
            let edgeConflict = this.getEdgeConflict(P)
            tree.splice(pos, 1)
            if (normalConflict == null && edgeConflict == null){ // no conflict occur;
                this.execution_time = Utils.getTime() - startTime;
                return {"paths" : P.getSolution(),
                        "expanded_nodes" : this.expanded_nodes,
                        "execution_time" : this.execution_time}
            }
            if (normalConflict != null){
                {
                    let A1 = P.clone();
                    let newConstraint = new Constraint(normalConflict.cell1, normalConflict.agent1, normalConflict.t1)
                    A1.addConstraint(newConstraint)
                    A1.updateSolution(this.map, normalConflict.agent1);
                    A1.updateCost()
                    if (Object.keys(A1.getSolution()).length > 0){ // the solution is not empty;
                        this.updateTree(tree, A1);
                    }
                }
                {
                    let A2 = P.clone();
                    let newConstraint = new Constraint(normalConflict.cell2, normalConflict.agent2, normalConflict.t2)
                    A2.addConstraint(newConstraint)
                    A2.updateSolution(this.map, normalConflict.agent2);
                    A2.updateCost()
                    if (Object.keys(A2.getSolution()).length > 0){ // the solution is not empty
                        this.updateTree(tree, A2);
                    }
                }
            }
            else if (edgeConflict != null){
                {
                    let A1 = P.clone();
                    let newConstraint1 = new Constraint(edgeConflict.cell1, edgeConflict.agent1, edgeConflict.t1)
                    let newConstraint2 = new Constraint(edgeConflict.cell2, edgeConflict.agent1, edgeConflict.t1 + 1)
                    A1.addConstraint(newConstraint1)
                    A1.addConstraint(newConstraint2)
                    A1.updateSolution(this.map, edgeConflict.agent1);
                    A1.updateCost()
                    if (Object.keys(A1.getSolution()).length > 0){
                        this.updateTree(tree, A1);
                    }
                }
                {
                    let A2 = P.clone();
                    let newConstraint1 = new Constraint(edgeConflict.cell2, edgeConflict.agent2, edgeConflict.t2)
                    let newConstraint2 = new Constraint(edgeConflict.cell1, edgeConflict.agent2, edgeConflict.t2 + 1)
                    A2.addConstraint(newConstraint1)
                    A2.addConstraint(newConstraint2)
                    A2.updateSolution(this.map, edgeConflict.agent2);
                    A2.updateCost()
                    if (Object.keys(A2.getSolution()).length > 0){
                        this.updateTree(tree, A2);
                    }
                }
            }
        }
        this.execution_time = Utils.getTime() - startTime;
        return {"paths" : {},
                "expanded_nodes" : this.expanded_nodes,
                "execution_time" : this.execution_time} // can't find any solution
    }
}

module.exports = highLevelSolver;
