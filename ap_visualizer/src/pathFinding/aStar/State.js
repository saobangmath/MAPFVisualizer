/**
 * the expanded state used for the A* algorithm
 */
class State{
    constructor(cur, curState, timeStep) {
        this.g = 0; // total distance of the agents;
        this.h = 0; // heuristic value
        this.f = 0; // g + h;
        this.cur = cur; // the next assigned agent next location;
        this.timeStep = timeStep; // the timeStep considered;
        this.agentsOrder = []; // the id of the agents in flat list;
        this.curState = curState; // the agents current location;
        this.posState = {}; // the next location of the agents;
        for (let agentID in curState){
            this.agentsOrder.push(agentID);
        }
    }

    setPosState(posState){
        this.posState = posState;
    }

    setTimeStep(timeStep){
        this.timeStep = timeStep;
    }

    clone(){
        let curState = {... this.curState};
        let posState = {... this.posState};
        let clone_state = new State(this.cur, curState, this.timeStep);
        clone_state.g = this.g;
        clone_state.f = this.f;
        clone_state.h = this.h;
        clone_state.posState = posState;
        return clone_state;
    }
}

module.exports = State;