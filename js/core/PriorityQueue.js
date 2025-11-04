// core/PriorityQueue.js - MIN-HEAP IMPLEMENTATION
// This priority queue uses a min-heap structure for O(log n) insertion
// instead of O(n) for sorted array insertion, drastically improving performance
// for long simulations.

class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  // Add element with priority (time) - O(log n)
  enqueue(element, priority) {
    const node = { element, priority };
    this.heap.push(node);
    this.bubbleUp(this.heap.length - 1);
  }

  // Remove and return element with minimum priority - O(log n)
  dequeue() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    const end = this.heap.pop();
    
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.sinkDown(0);
    }
    
    return min;
  }

  // Get element with minimum priority without removing it - O(1)
  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  // Check if queue is empty - O(1)
  isEmpty() {
    return this.heap.length === 0;
  }

  // Get queue size - O(1)
  size() {
    return this.heap.length;
  }

  // Clear the queue - O(1)
  clear() {
    this.heap = [];
  }

  // INTERNAL: Bubble up element at index to maintain heap property
  bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      
      // If parent has lower priority (time), heap property satisfied
      if (this.heap[parentIndex].priority <= this.heap[index].priority) {
        break;
      }
      
      // Swap with parent
      [this.heap[parentIndex], this.heap[index]] = 
        [this.heap[index], this.heap[parentIndex]];
      
      index = parentIndex;
    }
  }

  // INTERNAL: Sink down element at index to maintain heap property
  sinkDown(index) {
    const length = this.heap.length;
    const element = this.heap[index];

    while (true) {
      let smallest = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      // Check left child
      if (leftChild < length && 
          this.heap[leftChild].priority < this.heap[smallest].priority) {
        smallest = leftChild;
      }

      // Check right child
      if (rightChild < length && 
          this.heap[rightChild].priority < this.heap[smallest].priority) {
        smallest = rightChild;
      }

      // If element is in correct position
      if (smallest === index) break;

      // Swap with smallest child
      [this.heap[index], this.heap[smallest]] = 
        [this.heap[smallest], this.heap[index]];
      
      index = smallest;
    }
  }

  // Debug: Verify heap property (for testing)
  isValidHeap() {
    for (let i = 0; i < this.heap.length; i++) {
      const leftChild = 2 * i + 1;
      const rightChild = 2 * i + 2;

      if (leftChild < this.heap.length && 
          this.heap[i].priority > this.heap[leftChild].priority) {
        return false;
      }

      if (rightChild < this.heap.length && 
          this.heap[i].priority > this.heap[rightChild].priority) {
        return false;
      }
    }
    return true;
  }
}

