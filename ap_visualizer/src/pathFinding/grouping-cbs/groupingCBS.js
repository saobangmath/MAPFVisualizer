let CBS = require("../cbs/highLevelSolver");
let MetaCTNode = require("./MetaCTNode");
let Constraint = require("../Constraint");
let Utils = require('../utils');
let Constants = require('../Constants');
let BinaryHeap = require('../BinaryHeap');

/**
 * a small variant of the cbs algorithm
 */

class GroupingCBS {
  constructor(map) {
      let no_groups = Math.floor(Math.sqrt(map.no_agents));
      this.map = map;
      this.groups = new Array(no_groups);
      this.group_paths = new Array(no_groups);
      for (let id = 0; id < no_groups; id++){
          this.groups[id] = {};
          this.group_paths = {};
      }
      let oneGroup = Math.floor(map.no_agents / no_groups);
      let rem = map.no_agents - oneGroup * no_groups, groupId = 0, cur = 0;
      let order = [];
      for (let agent in map.agents){
        order.push(agent);
      }
      order = Utils.shuffle(order);
      for (let i = 0; i < map.no_agents; i++){
          let agent = order[i];
          this.groups[groupId][agent] = map.agents[agent];
          cur++;
          if (cur >= oneGroup+1){
              rem--;
              cur = 0; groupId++;
              continue;
          }
          if (cur == oneGroup && rem == 0){
              cur = 0; groupId++;
              continue;
          }
      }
      //this.expanded_nodes = 0;
      this.execution_time = 0;
  }

    _getEdgeConflict(group_i, group_j, group_i_paths, group_j_paths) { // return any common edges (edge conflicts) between 2 given routes
        for (let agent1 in group_i_paths){
            for (let agent2 in group_j_paths){
                let conflict = new CBS([])._getEdgeConflict(agent1, agent2, group_i_paths[agent1], group_j_paths[agent2]);
                if (conflict != null){
                    conflict.group_i = group_i;
                    conflict.group_j = group_j;
                    return conflict;
                }
            }
        }
        return null;
    }

    getEdgeConflict(metaNode){ // return any edge edge conflicts within agents path that a MetaCTNode has;
        let solution = metaNode.getSolution()
        for (let group_i = 0; group_i < this.groups.length; group_i++){
            for (let group_j = group_i + 1; group_j < this.groups.length; group_j++){
                let conflict = this._getEdgeConflict(group_i, group_j, solution[group_i], solution[group_j]);
                if (conflict != null){
                    return conflict;
                }
            }
        }
        return null;
    }

    _getNormalConflict(group_i, group_j, group_i_paths, group_j_paths) { // return any conflicts between 2 given groups;
      for (let agent1 in group_i_paths){
          for (let agent2 in group_j_paths){
              let conflict = new CBS([])._getNormalConflict(agent1, agent2, group_i_paths[agent1], group_j_paths[agent2]);
              if (conflict != null){
                  conflict.group_i = group_i;
                  conflict.group_j = group_j;
                  return conflict;
              }
          }
      }
      return null;
    }

    getNormalConflict(metaNode){ // check if a MetaCTNode has any conflicts between agents path;
        let solution = metaNode.getSolution()
        for (let group_i = 0; group_i < this.groups.length; group_i++){
            for (let group_j = group_i + 1; group_j < this.groups.length; group_j++){
                let conflict = this._getNormalConflict(group_i, group_j, solution[group_i], solution[group_j]);
                if (conflict != null){
                    return conflict;
                }
            }
        }
        return null;
    }

    // push the new node to the tree && increment the number of nodes expanded;
    updateTree(tree, metaNode){
        tree.insert(metaNode);
        //this.expanded_nodes++;
    }

    // TODO: update the process nodes section to be more optimized;
    solve() { // return a list of cells
        let startTime = Utils.getTime();
        //this.expanded_nodes = 0;
        let root = new MetaCTNode(this.groups.length);
        root.updateSolution(this.map, this.groups, -1);
        root.updateCost()
        let tree = new BinaryHeap("cost");
        this.updateTree(tree, root)
        if (root.getSolution().length == 0){ // there is some agents can't even simply go from start to destination;
            this.execution_time = Utils.getTime() - startTime;
            return {"paths" : {},
                    //"expanded_nodes" : this.expanded_nodes,
                    "execution_time" : this.execution_time};
        }
        while (!tree.isEmpty()){
            let curTime = Utils.getTime();
            if (curTime - startTime >= Constants.TIME_CUTOFF){
                break;
            }
            let P = tree.getTop();
            let normalConflict = this.getNormalConflict(P)
            let edgeConflict = this.getEdgeConflict(P)
            tree.removeTop();
            if (normalConflict == null && edgeConflict == null){ // no conflict occur;
                this.execution_time = Utils.getTime() - startTime;
                return {"paths" : P.standardizeSolution(),
                        "execution_time" : this.execution_time}
            }
            if (normalConflict != null){
                {
                    let A1 = P.clone();
                    if (normalConflict.t1 == normalConflict.t2) {
                        for (let agentID in this.groups[normalConflict.group_i]) {
                            let newConstraint = new Constraint(normalConflict.cell1, agentID, normalConflict.t1)
                            A1.addConstraint(normalConflict.group_i, newConstraint);
                        }
                    }
                    else{
                        let newConstraint = new Constraint(normalConflict.cell2, normalConflict.agent1, normalConflict.t1)
                        A1.addConstraint(normalConflict.group_i, newConstraint);
                    }
                    A1.updateSolution(this.map, this.groups, normalConflict.group_i);
                    A1.updateCost()
                    if (A1.getSolution().length > 0){ // the solution is not empty;
                        this.updateTree(tree, A1);
                    }
                }
                {
                    let A2 = P.clone();
                    if (normalConflict.t1 == normalConflict.t2) {
                        for (let agentID in this.groups[normalConflict.group_j]) {
                            let newConstraint = new Constraint(normalConflict.cell2, agentID, normalConflict.t2)
                            A2.addConstraint(normalConflict.group_j, newConstraint);
                        }
                    }
                    else{
                        let newConstraint = new Constraint(normalConflict.cell2, normalConflict.agent2, normalConflict.t2)
                        A2.addConstraint(normalConflict.group_j, newConstraint);
                    }
                    A2.updateSolution(this.map, this.groups, normalConflict.group_j);
                    A2.updateCost()
                    if (A2.getSolution().length > 0){ // the solution is not empty
                        this.updateTree(tree, A2);
                    }
                }
            }
            if (edgeConflict != null){
                {
                    let A1 = P.clone();
                    // for (let agentID in this.groups[edgeConflict.group_i]) {
                    //     let newConstraint1 = new Constraint(edgeConflict.cell1, edgeConflict.agent1, edgeConflict.t1)
                    //     let newConstraint2 = new Constraint(edgeConflict.cell2, edgeConflict.agent1, edgeConflict.t1+1)
                    //     A1.addConstraint(edgeConflict.group_i, newConstraint1);
                    //     A1.addConstraint(edgeConflict.group_i, newConstraint2);
                    // }
                    let newConstraint1 = new Constraint(edgeConflict.cell2, edgeConflict.agent1, edgeConflict.t1+1)
                    let newConstraint2 = new Constraint(edgeConflict.cell1, edgeConflict.agent1, edgeConflict.t1)
                    A1.addConstraint(edgeConflict.group_i, newConstraint1);
                    A1.addConstraint(edgeConflict.group_i, newConstraint2);
                    A1.updateSolution(this.map, this.groups, edgeConflict.group_i);
                    A1.updateCost()
                    if (A1.getSolution().length > 0){
                        this.updateTree(tree, A1);
                    }
                }
                {
                    let A2 = P.clone();
                    // for (let agentID in this.groups[edgeConflict.group_j]) {
                    //     let newConstraint1 = new Constraint(edgeConflict.cell1, edgeConflict.agent2, edgeConflict.t2+1)
                    //     let newConstraint2 = new Constraint(edgeConflict.cell2, edgeConflict.agent2, edgeConflict.t2)
                    //     A2.addConstraint(edgeConflict.group_j, newConstraint1);
                    //     A2.addConstraint(edgeConflict.group_j, newConstraint2);
                    // }
                    let newConstraint1 = new Constraint(edgeConflict.cell1, edgeConflict.agent2, edgeConflict.t2+1)
                    let newConstraint2 = new Constraint(edgeConflict.cell2, edgeConflict.agent2, edgeConflict.t2)
                    A2.addConstraint(edgeConflict.group_j, newConstraint1);
                    A2.addConstraint(edgeConflict.group_j, newConstraint2);
                    A2.updateSolution(this.map, this.groups, edgeConflict.group_j);
                    A2.updateCost()
                    if (A2.getSolution().length > 0){
                        this.updateTree(tree, A2);
                    }
                }
            }
        }
        this.execution_time = Utils.getTime() - startTime;
        return {"paths" : {},
                "execution_time" : this.execution_time} // can't find any solution
    }

    // in case wanting to partition the nodes in the groups in random manner;
    getRandomInt(min, max){
      return Math.floor(Math.random() * (max - min) + min);
    }
};

module.exports = GroupingCBS;