// represent a node in the Constraint Tree

class CTNode{
    constructor(constraints) {
        this.cost = 0
        this.constraints = constraints // list of constraint so far in this node
        this.solutions = [] // list of list of Cell that satisfied the condition
    }

    getCost(){
        return this.cost
    }

    getConstraints(){
        return this.constraints
    }

    addConstraint(constraint){
        this.constraints.push(constraint)
    }

    updateSolution(map){

    }
    updateCost(){

    }
};