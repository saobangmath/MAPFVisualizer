/**
    custom data structure to support insert | delete operation effective (a minimum heap);
 */

class BinaryHeap{
    constructor(attribute) {
        this.heap = []
        this.attribute = attribute;
    }

    insert(element){
       this.heap.push(element);
       this.bubbleUp(this.heap.length - 1);
    }

    bubbleUp(idx){
        const element = this.heap[idx];
        while (idx > 0){
            let parentIdx = Math.floor((idx - 1) / 2);
            let parent = this.heap[parentIdx];
            if (!this.cmp(element, parent)){
                break;
            }
            this.swap(idx, parentIdx);
            idx = parentIdx;
        }
    }

    removeTop(){
        this.removeIndex(0);
    }

    removeIndex(idx){
        let l = this.heap.length;
        let element = this.heap.pop();
        if (idx == l-1){
            return;
        }
        this.heap[idx] = element;
        let parentIdx = Math.floor((idx - 1) / 2);
        if (idx > 0 && !this.cmp(this.heap[parentIdx], element)){
            this.bubbleUp(idx);
        }
        this.sinkDown(idx);
    }

    sinkDown(idx){
        let length = this.heap.length;
        let element = this.heap[0];
        while (true){
            let leftIdx = 2 * idx + 1;
            let rightIdx = 2 * idx + 2;
            let swap_option = null;
            if (leftIdx < length){
                let leftChild = this.heap[leftIdx];
                if (this.cmp(leftChild, element)){
                    swap_option = leftIdx;
                }
            }
            if (rightIdx < length){
                let rightChild = this.heap[rightIdx];
                if (swap_option === null && this.cmp(rightChild, element)){
                    swap_option = rightIdx;
                }
                else if (swap_option !== null && this.cmp(rightChild, this.heap[leftIdx])){
                    swap_option = rightIdx;
                }
            }
            if (swap_option === null){
                break;
            }
            this.swap(idx, swap_option);
            idx = swap_option;
        }
    }

    swap(i, j){
        let v = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = v;
    }

    // get the top element of the heap;
    getTop(){
        return this.heap[0];
    }

    // check if the heap is empty
    isEmpty(){
        return this.getLength() == 0;
    }

    // print out the heap for debugging purpose
    print(){
        for (let i = 0; i < this.heap.length; i++){
            console.log(this.heap[i])
        }
        process.stdout.write("\n");
    }

    getLength(){
        return this.heap.length;
    }

    // return if element1 < element2 (elements here are all cell object: compare by f value first, tied break by comparing h value);
    cmp(element1, element2){
        if (element1[this.attribute] !== element2[this.attribute]){
            return element1[this.attribute] < element2[this.attribute];
        }
        if (this.attribute === "f"){
            return element1["h"] < element2["h"]; // if f is the attribute used for the comparison tied break by h;
        }
        return false;
    }
};


// function test(){
//     let heap = new BinaryHeap("f");
//     heap.insert({h : 3, f : 2});
//     heap.insert({h: 34, f : 4});
//     heap.insert({h : 4, f : 2});
//     heap.insert({h : 0, f : 1});
//     heap.print();
//     heap.removeIndex(0);
//     heap.print();
//     heap.removeIndex(1);
//     heap.print();
//     heap.removeIndex(0);
//     heap.print();
// };
// test();

module.exports = BinaryHeap;