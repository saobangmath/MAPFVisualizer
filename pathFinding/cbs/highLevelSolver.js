/**
 Search the constraints tree
 using the lowLeverSolver() to find individual paths of the agents
 */

class highLevelSolver {
    constructor() {

    }

    hasEdgeConflict(route1, route2) { // return if any common edges (edge conflicts) between 2 given routes
        for (let i = 0; i < Math.min(route1.length, route2.length)-1; i++) {
            if (route1[i] == route2[i+1] &&
                route1[i+1] == route2[i])
                return true;
        }
        return false;
    }

    hasConflict(route1, route2) { // return if any conflicts between 2 given routes
        for (let i = 0; i < Math.min(route1.length, route2.length); i++) {
            if (route1[i] == route2[i]) return true;
        }
        return false;
    }

    solve(map) { // return a list of cells

    }
}
