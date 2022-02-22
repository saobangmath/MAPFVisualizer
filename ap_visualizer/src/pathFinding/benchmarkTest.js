let CBS = require('./cbs/highLevelSolver');
let aStar = require('./aStar/AStar');
let ID = require('./id/ID');
let Map = require('./Map');
let Cell = require('./Cell');
let Constants = require('./Constants');

function isPlaceWithObstacles(){ // for a square, generate the obstacles there with probability = 0.2
    return Math.random() <= 0.2;
}

// fisher-yate algorithm;
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function genMap() {
    let map = new Map();
    map.height = 10;
    map.width = 15;
    map.grid = [];
    map.no_agents = 10;
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
        nonObstaclesPos = shuffle(nonObstaclesPos);
        let j = 0;
        for (let agent = 1; agent <= map.no_agents; agent++){
            map.agents[agent] = {"START" : new Cell(nonObstaclesPos[j][0], nonObstaclesPos[j][1]),
                                 "DEST" : new Cell(nonObstaclesPos[j+1][0], nonObstaclesPos[j+1][1])};
            j += 2;
        }
    }
    return map;
}

function benchMark(){
    let tot = 20, cbsWin = 0, aStarWin = 0;
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
        let cbsResult = new CBS(map).solve();
        console.log("cbs execution time: " + cbsResult["execution_time"]);
        let aStarResult = new aStar(map).solve();
        console.log("aStar execution time: " + aStarResult["execution_time"]);
        if (!(cbsResult["execution_time"] >= Constants.TIME_CUTOFF && aStarResult["execution_time"] >= Constants.TIME_CUTOFF)){
            if (cbsResult["execution_time"] >= aStarResult["execution_time"]) aStarWin++;
            else cbsWin++;
        }
        //let cbswIDResult = new ID("CBS", map).solve();
        //console.log("cbs execution time: " + cbswIDResult["execution_time"]);
        console.log("=======================");
    }
    let failed = tot - cbsWin - aStarWin;

    console.log(`Total ${tot} tests is simulating ...`);

    console.log(`Out of ${cbsWin} tests, cbs win!`);

    console.log(`Out of ${aStarWin} tests, A* + OD win!`);

    console.log(`${failed} tests to failed to find path within time limit`)
}

benchMark();
