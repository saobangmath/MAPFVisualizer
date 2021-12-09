/**
 * Cell object representing a cell in the grid map
 * x,y: row id and column id of the Cell
 * isObstacle: if the cell is blocked
 */

class Cell{
    constructor(x, y){
        this.x = x; // x-value
        this.y = y; // y-value
        this.h = 0; // HEURISTIC distance to the destination
        this.g = 0; // the REAL distance from the start
        this.f = 0; // f = g + h
        this.time = 0; // time that the cell is visited;
    }

    is_equal(other){
        return this.x == other.x && this.y == other.y
    }
}

module.exports = Cell;