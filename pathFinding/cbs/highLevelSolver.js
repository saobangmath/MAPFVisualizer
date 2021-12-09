const CTNode = require('./CTNode')
const Constraint = require('./Constraint')
const Conflict = require('./Conflict')

/**
 Search the constraints tree
 using the lowLeverSolver() to find individual paths of the agents
 */

class highLevelSolver {
    constructor() {

    }

    _getEdgeConflict(agent1, agent2, route1, route2) { // return any common edges (edge conflicts) between 2 given routes
        for (let time = 0; time < Math.min(route1.length, route2.length)-1; time++) {
            if (route1[time] == route2[time+1] &&
                route1[time+1] == route2[time])
                return new Conflict(agent1, agent2, route1[time], route1[time+1], time);
        }
        return null;
    }

    getEdgeConflict(node){ // return any edge edge conflicts within agents path that a CTNode has ;
        let solution = node.getSolution()
        for (let agent1 = 0; agent1 < solution.length - 1; agent1++){
            for (let agent2 = agent1 + 1; agent2 < solution.length; agent2++){
                let conflict = this._getEdgeConflict(agent1, agent2, solution[agent1], solution[agent2]);
                if (conflict != null){
                    return conflict
                }
            }
        }
        return null;
    }

    _getNormalConflict(agent1, agent2, route1, route2) { // return any conflicts between 2 given routes
        for (let time = 0; time < Math.min(route1.length, route2.length); time++) {
            if (route1[time] == route2[time]){
                return new Conflict(agent1, agent2, route1[time], route2[time], time);
            }
        }
        return null;
    }

    getNormalConflict(node){ // check if a CTNode has any conflicts between agents path;
        let solution = node.getSolution()
        for (let agent1 = 0; agent1 < solution.length-1; agent1++){
            for (let agent2 = agent1+1; agent2 < solution.length; agent2++){
                let conflict = this._getNormalConflict(agent1, agent2, solution[agent1], solution[agent2])
                if (conflict != null){
                    return conflict
                }
            }
        }
        return null;
    }

    findBestNode(tree){
        if (tree.length == 0){
            return null;
        }
        let target_node = null;
        let minCost = 1e18
        for (let i = 0; i < tree.length; i++){
            let node = tree[i];
            if (node.cost < minCost){
                target_node = node;
                minCost = node.cost;
            }
        }
        return target_node
    }

    solve(map) { // return a list of cells
        let root = new CTNode([])
        root.updateSolution(map)
        root.updateCost()
        let tree = []
        tree.push(root)
        while (tree.length > 0){
            let P = this.findBestNode(tree) // get the node with minimum cost;
            let normalConflict = this.getNormalConflict(P)
            let edgeConflict = this.getEdgeConflict(P)
            if (normalConflict == null && edgeConflict == null){ // no conflict occur;
                return P.getSolution()
            }
            if (normalConflict != null){
                 tree.pop()
                {
                    let A1 = new CTNode(P.getConstraints())
                    let newConstraint = new Constraint(normalConflict.cell1, normalConflict.agent1, normalConflict.time)
                    A1.addConstraint(newConstraint)
                    A1.updateSolution(map)
                    A1.updateCost()
                    if (A1.getSolution().length > 0){ // the solution is not empty;
                        tree.push(A1)
                    }
                }
                {
                    let A2 = new CTNode(P.getConstraints())
                    let newConstraint = new Constraint(normalConflict.cell2, normalConflict.agent2, normalConflict.time)
                    A2.addConstraint(newConstraint)
                    A2.updateSolution(map)
                    A2.updateCost()
                    if (A2.getSolution().length > 0){ // the solution is not empty
                        tree.push(A2)
                    }
                }
            }
            if (edgeConflict != null){
                {
                    let A1 = new CTNode(P.getConstraints())
                    let newConstraint1 = new Constraint(edgeConflict.cell1, edgeConflict.agent1, edgeConflict.time - 1)
                    let newConstraint2 = new Constraint(edgeConflict.cell2, edgeConflict.agent1, edgeConflict.time)
                    A1.addConstraint(newConstraint1)
                    A1.addConstraint(newConstraint2)
                    A1.updateSolution(map)
                    A1.updateCost()
                    if (A1.getSolution().length > 0){
                        tree.push(A1)
                    }
                }
                {
                    let A2 = new CTNode(P.getConstraints())
                    let newConstraint1 = new Constraint(edgeConflict.cell2, edgeConflict.agent2, edgeConflict.time - 1)
                    let newConstraint2 = new Constraint(edgeConflict.cell1, edgeConflict.agent2, edgeConflict.time)
                    A2.addConstraint(newConstraint1)
                    A2.addConstraint(newConstraint2)
                    A2.updateSolution(map)
                    A2.updateCost()
                    if (A2.getSolution().length > 0){
                        tree.push(A2)
                    }
                }
            }
        }
        return [] // can't find any solution
    }
}

module.exports = highLevelSolver;
