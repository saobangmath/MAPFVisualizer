const highLevelSolver = require('./highLevelSolver')
const Map = require('./Map')

function test(filename) {
    try{
        let solver = new highLevelSolver()
        let map = new Map(0,0)
        map.readMap(filename)
        console.log(map.height)
        console.log(map.width)
        console.log(map.grid)
        console.log(map.agents)
        console.log(solver.solve(map))
    } catch (err) {
        console.log(`Error: ${err}`)
    }
}

test('./maps/easy_kiva.map')
test('./maps/hard_kiva.map')
test('./maps/paper.map')