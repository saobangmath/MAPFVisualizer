/**
 * The  Conflict class
 * agent1, agent2: 2 agents that occured in the conflict;
 * cell1, cell2:
 * 1. cell1 == cell2 -> 2 agents face the normal conflict
 * 2. cell1 != cell2 -> 2 agent face edge conflict
 * t1: the time that the agent1 is at cell1
 * t2: the time that the agent2 is at cell2
 */
class Conflict{
    constructor(agent1, agent2, cell1, cell2, t1, t2) {
        this.agent1 = agent1
        this.agent2 = agent2
        this.cell1 = cell1
        this.cell2 = cell2
        this.t1 = t1
        this.t2 = t2
    }
 }

 module.exports = Conflict