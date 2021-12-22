const highLevelSolver = require('./highLevelSolver')
const Map = require('../Map')

function test(filename) {
    try{
        let solver = new highLevelSolver()
        let map = new Map(0,0)
        map.readMap(filename)
        console.log(map.height)
        console.log(map.width)
        console.log(map.grid)
        console.log(map.agents)
        let solution = solver.solve(map)
        console.log(solution)
    } catch (err) {
        console.log(`Error: ${err}`)
    }
}
console.log("========= Test for easy kiva =========")
test('../maps/easy_kiva.map')

console.log("========= Test for hard kiva =========")
test('../maps/hard_kiva.map')

console.log("========= Test for paper map =========")
test('../maps/paper.map')

console.log("========= Test for no_path map =========")
test('../maps/no_path.map')

console.log("========= Test for paper1 map =========")
test('../maps/paper1.map')

// console.log("========= Test for 3 agents map =========")
// test('../maps/3-agents.map')

console.log("========= Test for 4 agents map =========")
test('../maps/4-agents.map')

console.log("========= Test for 1 agent map =========")
test('../maps/1-agent.map')
