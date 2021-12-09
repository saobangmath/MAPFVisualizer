/**
 * map data structure
 */

const Cell = require('./Cell')
const fs = require('fs')

class Map{
    constructor() {
        this.height = 0 // height of the grid map
        this.width = 0 // width of the grid map
        this.agents = {} // {agent_id : {START, DEST}}
        this.no_agents = 0; // total number of agents
        this.grid = [] // the grid map
    }

    readMap(filename){ // read the map from some configuration file
        try{
            let raw_info = fs.readFileSync(filename, {encoding: 'utf8', flag: 'r'})
            let infos = raw_info.split("\r\n")
            this.height = parseInt(infos[0])
            this.width = parseInt(infos[1])
            for (let row = 0; row < this.height; row++){
                this.grid.push(infos[2 + row])
            }
            this.no_agents = parseInt(infos[2 + this.height])
            for (let id = 1; id <= this.no_agents; id++){
                let [x_start, y_start, x_dest, y_dest] = infos[2 + this.height + id].split(",")
                this.agents[id] = {"START" : new Cell(parseInt(x_start), parseInt(y_start)),
                                   "DEST" : new Cell(parseInt(x_dest), parseInt(y_dest))}
            }
        }catch (err){
            console.log(`Read map err: ${err}`)
        }
    }
}

module.exports = Map;