let CBS = require('./cbs/highLevelSolver');
let aStar = require('./aStar/AStar');
let groupingCBS = require('./grouping-cbs/groupingCBS');
let ID = require('./id/ID');
let Map = require('./Map');
let Cell = require('./Cell');
let Utils = require('./utils');
let Conflict = require('./Conflict');
let Constraint = require('./Constraint');
let Constants = require('./Constants');

function isPlaceWithObstacles(){ // for a square, generate the obstacles there with probability = 0.1
    return Math.random() <= 0.1;
}

function genAgents(){ // generate the number of agents randomly from 1->10
    return Math.floor(Math.random() * 10) + 1;
}

function genMap() {
    let map = new Map();
    map.height = 10;
    map.width = 15;
    map.grid = [];
    map.no_agents = genAgents();
    let nonObstaclesPos = [];
    for (let r = 0; r < map.height; r++){
        let rows = [];
        for (let c = 0; c < map.width; c++){
            let v = isPlaceWithObstacles() ? '@' : '.';
            rows.push(v);
            if (v === '.'){
                nonObstaclesPos.push([r, c]);
            }
        }
        map.grid.push(rows);
    }
    if (nonObstaclesPos.length < map.no_agents * 2){
        map = null;
    }
    else{
        nonObstaclesPos = Utils.shuffle(nonObstaclesPos);
        let j = 0;
        for (let agent = 1; agent <= map.no_agents; agent++){
            map.agents[agent] = {"START" : new Cell(nonObstaclesPos[j][0], nonObstaclesPos[j][1]),
                                 "DEST" : new Cell(nonObstaclesPos[j+1][0], nonObstaclesPos[j+1][1])};
            j += 2;
        }
    }
    return map;
}

// depend on the solver, return relevant algorithm
function getSolver(solver, map){
    if (solver === "CBS"){
        return new CBS(map);
    }
    if (solver === "A*+OD"){
        return new aStar(map);
    }
    if (solver === "groupingCBS"){
        return new groupingCBS(map);
    }
    if (solver === "CBSwID"){
        return new ID("CBS", map);
    }
    if (solver === "AStarwID"){
        return new ID("A*+OD", map);
    }
    return null;
}

function benchMark(solver1, solver2, tot){
    let solver1Win = 0, solver2Win = 0, eq = 0;
    for (let iter = 1; iter <= tot; iter++){
        let map = genMap();
        while (map === null){
            map = genMap();
        }
        console.log("===== Test " + iter + ": =====");
        console.log("Agents: ");
        console.log(map.agents);
        console.log("Maps: ")
        console.log(map.grid);

        let solver1Result = getSolver(solver1, map).solve()["execution_time"];
        console.log(`${solver1} execution time: ` + solver1Result);

        let solver2Result = getSolver(solver2, map).solve()["execution_time"];
        console.log(`${solver2} execution time: ` + solver2Result);

        if (!(solver1Result >= Constants.TIME_CUTOFF && solver2Result >= Constants.TIME_CUTOFF)){
            if (solver1Result > solver2Result) solver2Win++;
            else if (solver1Result) solver1Win++;
            else if (solver1Result == solver2Result) eq++;
            else solver2Win++;
        }
        console.log("=======================");
    }

    let failed = tot - solver1Win - solver2Win - eq;

    console.log(`Total ${tot} tests is simulating ...`);

    console.log(`Out of ${solver1Win} tests, ${solver1} win!`);

    console.log(`Out of ${solver2Win} tests, ${solver2} win!`);

    console.log(`Out of ${eq} tests, both are taken the same time!`);

    console.log(`${failed} tests to failed to find path within time limit`)
}


benchMark("CBS", "A*+OD", 100);
//benchMark("CBS", "groupingCBS", 100);
//benchMark("A*+OD", "AStarwID");
//benchMark("CBS", "CBSwID",10);