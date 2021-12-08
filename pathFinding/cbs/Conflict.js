/**
 * The  Conflict class
 * agent1, agent2: 2 agents that occured in the conflict;
 * cell1, cell2:
 * 1. cell1 == cell2 -> 2 agents face the normal conflict
 * 2. cell1 != cell2 -> 2 agent face edge conflict
 * time: the time that
 */
class Conflict{
    constructor(agent1, agent2, cell1, cell2, time) {
        this.agent1 = agent1
        this.agent2 = agent2
        this.cell1 = this.cell1
        this.cell2 = this.cell2
        this.time = time
    }
 }

 module.exports = Conflict