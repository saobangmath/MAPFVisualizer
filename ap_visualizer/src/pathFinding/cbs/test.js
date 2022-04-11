const highLevelSolver = require('./highLevelSolver')
const Map = require('../Map')

function test(filename) {
    try {
        let map = new Map(0, 0)
        map.readMap(filename)
        let solver = new highLevelSolver(map)
        console.log(`========= Test for ${filename} =========`)
        console.log(map.height)
        console.log(map.width)
        console.log(map.grid)
        console.log(map.agents)
        let solution = solver.solve({});
        console.log("Time taken: " + solution.execution_time + "s");
        console.log(solution.paths);
    } catch (err) {
        console.log(`Error: ${err}`)
    }
}

test('../maps/handmade7.map')

test('../maps/craft.map')

test('../maps/easy_kiva.map')

test('../maps/hard_kiva.map')

test('../maps/input_4x4_2_bahar_0.txt')

test('../maps/input_4x4_3_bahar_0.txt')

test('../maps/paper.map')

//test('../maps/no_path.map')

test('../maps/paper1.map')

test('../maps/3-agents.map')

test('../maps/1-agent.map')

test('../maps/special-1.map')

test('../maps/special-2.map')

test('../maps/special-3.map')

test('../maps/handmade1.map')

test('../maps/handmade2.map')

test('../maps/handmade3.map')

test('../maps/handmade4.map')

test('../maps/handmade5.map')

test('../maps/handmade6.map')