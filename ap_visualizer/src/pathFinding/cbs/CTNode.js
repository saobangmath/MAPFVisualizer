const LowLevelSolver = require('./lowLevelSolver')
// represent a node in the Constraint Tree

class CTNode{
    constructor(constraints) {
        this.cost = 0
        this.constraints = constraints // list of constraint so far in this node
        this.solution = [] // list of list of Cell that satisfied the condition
        this.expanded_nodes = 0; // no of expanded_nodes that the low-level algorithm need to expanded;
    }

    getCost(){
        return this.cost
    }

    getConstraints(){
        return this.constraints
    }

    getSolution(){
        return this.solution
    }

    addConstraint(constraint){
        for (let i=0;i<this.constraints.length;i++){
           if (constraint.is_equal(this.constraints[i])) { // make sure no new added constraint has been added before;
                return;
           }
        }
        this.constraints.push(constraint)
    }

    updateSolution(map){ // update the solution w.r.t the new constraints
        let solver = new LowLevelSolver();
        let result = solver.findOptimalPaths(this.constraints, map);
        this.solution = result["paths"];
        this.expanded_nodes += result["expanded_nodes"];
    }

    updateCost(){ // update cost of the solution
        let new_cost = 0
        for (let id in this.solution){
            new_cost += this.solution[id].length;
        }
        this.cost = new_cost
    }

    clone(){
        let clone_node = new CTNode([]);
        clone_node.solution = this.solution;
        clone_node.cost = this.cost;
        for (let i = 0; i < this.constraints.length; i++){
            clone_node.addConstraint(this.constraints[i]);
        }
        return clone_node;
    }
};

module.exports = CTNode;