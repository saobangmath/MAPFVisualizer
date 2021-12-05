/**
 * Cell object representing a cell in the grid map
 * x,y: row id and column id of the Cell
 * isObstacle: if the cell is blocked
 */

class Cell{
    constructor(x, y){
        this.x = x
        this.y = y
        this.isObstacle = false
    }
    is_equal(other){
        return this.x == other.x && this.y == other.y
    }
}