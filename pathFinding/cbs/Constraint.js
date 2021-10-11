// declare constraint w.r.t. a node and an agent

class Constraint{
    constructor(cell, agentID, time) {
        this.cell = cell // a Cell object
        this.agentID = agentID
        this.time = time // the time that the agent should not be at that cell
    }
}