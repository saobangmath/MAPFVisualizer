// Cell object representing a cell in the gridmap

class Cell{
    constructor(x, y){
        this.x = x
        this.y = y
        this.f = 0
        this.h = 0
        this.g = 0
        this.isObstacle = false
    }
    is_equal(other){
        return this.x == other.x && this.y == other.y
    }
}