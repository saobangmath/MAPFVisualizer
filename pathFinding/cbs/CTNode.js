const LowLevelSolver = require('./lowLevelSolver')
// represent a node in the Constraint Tree

class CTNode{
    constructor(constraints) {
        this.cost = 0
        this.constraints = constraints // list of constraint so far in this node
        this.solution = [] // list of list of Cell that satisfied the condition
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
        this.constraints.push(constraint)
    }

    updateSolution(map){ // update the solution w.r.t the new constraints
        let solver = new LowLevelSolver();
        this.solution = solver.findOptimalPaths(this.constraints, map)
    }

    updateCost(){ // update cost of the solution
        let new_cost = 0
        this.solution.forEach((route, i) => new_cost += route.length)
        this.cost = new_cost
    }
};

module.exports = CTNode;