const Cell = require('./Cell')

let directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]


function validateCell(x, y, height, width){
    return x >= 0 && y >= 0 && x < height && y < width
}

function getManhattanDistance(cell1, cell2){
    return Math.abs(cell1.x - cell2.x) + Math.abs(cell1.y - cell2.y)
}

module.exports = {directions, validateCell, getManhattanDistance}