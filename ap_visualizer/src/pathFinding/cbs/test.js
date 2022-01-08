const highLevelSolver = require('./highLevelSolver')
const Map = require('../Map')

function test(filename) {
    try{
        let map = new Map(0,0)
        map.readMap(filename)
        console.log(map.height)
        console.log(map.width)
        console.log(map.grid)
        console.log(map.agents)
        let solver = new highLevelSolver(map)
        let solution = solver.solve()
        console.log(solution)
    } catch (err) {
        console.log(`Error: ${err}`)
    }
}
console.log("========= Test for easy kiva =========")
test('../maps/easy_kiva.map')

console.log("========= Test for hard kiva =========")
test('../maps/hard_kiva.map')

console.log("========= Test for input_4x4_2_bahar_0 map =========")
test('../maps/input_4x4_2_bahar_0.txt')

console.log("========= Test for input_4x4_3_bahar_0 map =========")
test('../maps/input_4x4_3_bahar_0.txt')

console.log("========= Test for paper map =========")
test('../maps/paper.map')

console.log("========= Test for no_path map =========")
test('../maps/no_path.map')

console.log("========= Test for paper1 map =========")
test('../maps/paper1.map')

console.log("========= Test for 3 agents map =========")
test('../maps/3-agents.map')

console.log("========= Test for 1 agent map =========")
test('../maps/1-agent.map')

console.log("========= Test for special1 agent map =========")
test('../maps/special-1.map')

console.log("========= Test for special2 agent map =========")
test('../maps/special-2.map')

console.log("========= Test for special3 agent map =========")
test('../maps/special-3.map')

