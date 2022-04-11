let CTNode = require("../cbs/CTNode");
let CBS = require("../cbs/highLevelSolver");

class MetaCTNode{
    constructor(groups) {
        this.nodes = new Array(groups);
        for (let id = 0; id < groups; id++){
            this.nodes[id] = new CTNode({});
        }
        this.cost = 0;
    }

    // add constraints to the group with id = groupID;
    addConstraint(groupID, constraint){
        this.nodes[groupID].addConstraint(constraint);
    }

    // if groupID == -1 -> update all solution;
    // else update the solution of only the groupID;
    updateSolution(map, agents, groupID){
        for (let id = 0; id < this.nodes.length; id++){
            map.agents = agents[id];
            map.no_agents = Object.keys(map.agents).length;
            if (groupID != -1 && id != groupID){
                continue;
            }
            this.nodes[id].solution = new CBS(map).solve(this.nodes[id].getConstraints())["paths"];
        }
    }

    updateCost(){
        this.cost = 0;
        for (let id = 0; id < this.nodes.length; id++){
            this.nodes[id].updateCost();
            this.cost += this.nodes[id].getCost();
        }
    }

    clone(){
        let groups = this.nodes.length;
        let clone_node = new MetaCTNode(groups);
        for (let id = 0; id < groups; id++){
            clone_node.nodes[id] = this.nodes[id].clone();
        }
        clone_node.cost = this.cost;
        return clone_node;
    }

    /**
     *
     * Sample return : [{1 : [], 2: []}, {3: [], 4: []}, {5: []}]
     */
    getSolution(){
        let solution = new Array(this.nodes.length);
        for (let id = 0; id < this.nodes.length; id++){
            solution[id] = this.nodes[id].getSolution();
            if (Object.keys(solution[id]).length == 0) {
                return []; // there is no solution found!
            }
        }
        return solution;
    }

    standardizeSolution(){
        let _solution = this.getSolution();
        let solution = {};
        for (let groupID = 0; groupID < _solution.length; groupID++){
            for (let agentID in _solution[groupID]){
                solution[agentID] = _solution[groupID][agentID];
            }
        }
        return solution;
    }
};

module.exports = MetaCTNode;