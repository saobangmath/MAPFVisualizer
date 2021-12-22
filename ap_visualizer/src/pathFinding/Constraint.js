// declare constraint w.r.t. a node and an agent
// the agent with id agentID could not at the cell at time;

class Constraint{
    constructor(cell, agentID, time) {
        this.cell = cell // a Cell object
        this.agentID = agentID
        this.time = time // the time that the agent should not be at that cell
    }
    is_equal(constraint){
        return this.cell.is_equal(constraint.cell) && this.agentID == constraint.agentID && this.time == constraint.time;
    }
}

module.exports = Constraint