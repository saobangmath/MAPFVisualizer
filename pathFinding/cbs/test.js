const highLevelSolver = require('./highLevelSolver')

try{
    const Map = require('../cbs/Map')
    let solver = new highLevelSolver()
    let map = new Map(1,1)
    map.readMap('./maps/kiva.map')
    console.log(map.height)
    console.log(map.width)
    console.log(map.grid)
    console.log(map.agents)
    console.log(solver.solve(map))
}
catch (err){
    console.log(`Error: ${err}`)
}

