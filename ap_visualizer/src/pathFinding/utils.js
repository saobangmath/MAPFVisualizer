// 5 directions corresponding to 5 possible agent removement at one step (up, down, right, left, wait)
let directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [0, 0]]

function validateCell(x, y, height, width){
    return x >= 0 && y >= 0 && x < height && y < width
}

function coordinatesToId(x, y, width){
    return x * width + y
}

function idToCoordinates(id, width){
    return [Math.floor(id / width), id % width]
}

// the heuristic distance used for all algorithms
function getManhattanDistance(cell1, cell2){
    let dx = Math.abs(cell1.x - cell2.x);
    let dy = Math.abs(cell1.y - cell2.y);
    return dx + dy;
}

function getEuclideanDistance(cell1, cell2){
    let dx = Math.abs(cell1.x - cell2.x);
    let dy = Math.abs(cell1.y - cell2.y);
    return Math.sqrt(dx * dx + dy * dy);
}

function getHeuristicDistance(cell1, cell2, f){
    return f(cell1, cell2);
}

function getTime(){ // in second;
    return new Date().getTime() / 1000;
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

module.exports = {directions, validateCell, coordinatesToId, idToCoordinates, getManhattanDistance, getEuclideanDistance ,getHeuristicDistance, getTime, shuffle}