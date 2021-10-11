// represent a node in the tree

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

    addConstraint(constraint){

    }

    updateSolution(map){

    }
    updateCost(){

    }
};