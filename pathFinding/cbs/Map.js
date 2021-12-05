/**
 * map data structure
 */

const fs = require('fs')

class Map{
    constructor(height, width, agents) {
        this.height = height
        this.width = width
        this.agents = agents
        this.grid = []
    }

    // TODO: thinking about what should be stored inside the kiva.map configuration
    readMap(filename){ // read the map from some configuration
        let info = ""
        try{
            info = fs.readFileSync(filename,  {encoding:'utf8', flag:'r'})
        }catch (err){
            console.log(`Read map err: ${err}`)
        }
        return info
    }

    get getHeight(){  // get height of the grid
        return this.grid.length;
    }

    get getWidth(){ // get width of the grid
        return this.grid[0].length;
    }
}

module.exports = Map;