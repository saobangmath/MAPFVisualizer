/**
 * do a deep copy of a 2D grid;
 * [... grid] will not simply worked
 */
function clone2DArray(grid){
    let clone_grid = [];
    let h = grid.length;
    let w = grid[0].length;
    for (let r = 0; r < h; r++){
        let row = [];
        for (let c = 0; c < w; c++){
            row.push(grid[r][c]);
        }
        clone_grid.push(row);
    }
    return clone_grid;
}

/**
 * get the display speed in ms;
 */
function getSpeed(e){
    if (e === "Fast") {
        return 200;
    } else if (e === "Average") {
        return 500;
    } else {
        return 1000;
    }
}

/**
 * get the next ID to assigned to new agent;
 */
function getNextAgentID(agents){
    let agentID = 1;
    while (true){
        if (agentID in agents){
            agentID+=1;
        }
        else{
            break;
        }
    }
    return agentID;
}

module.exports = {clone2DArray, getSpeed, getNextAgentID};