// core/SimulationEngine.js - REFINED VERSION
// Now uses PriorityQueue (min-heap) for O(log n) event scheduling
// instead of O(n) sorted array insertion - massive performance improvement

class SimulationEngine {
  constructor(model, animator, speed = 1) {
    this.model = model;
    this.animator = animator;
    this.speed = speed; // Simulation speed multiplier
    this.eventQueue = new PriorityQueue(); // <-- Optimized!
    this.animationDelay = 50; // ms base delay
  }

  async run(duration) {
    // Initialize simulation
    this.model.reset();
    this.eventQueue.clear();
    
    // Inject scheduleEvent method into model for event scheduling
    this.model.scheduleEvent = (type, time, data) => this.scheduleEvent(type, time, data);

    // Schedule first arrival
    const firstArrival = RandomGenerators.exponential(this.model.params.lambda);
    this.scheduleEvent('arrival', firstArrival);

    // Process events until duration reached
    while (!this.eventQueue.isEmpty()) {
      const eventNode = this.eventQueue.dequeue();
      const event = eventNode.element;

      if (event.time > duration) break; // Stop when duration exceeded

      // Update cumulative stats BEFORE processing event
      const timeDiff = event.time - this.model.state.time;
      this.model.updateCumulativeStats(timeDiff);
      
      this.model.state.time = event.time;

      // Process event based on type
      if (event.type === 'arrival') {
        this.model.handleArrival(event);
        this.animator.animateArrival();

        // Schedule next arrival if within duration
        if (event.time < duration) {
          const nextArrival = event.time + 
            RandomGenerators.exponential(this.model.params.lambda);
          this.scheduleEvent('arrival', nextArrival);
        }
      } else if (event.type === 'departure') {
        this.model.handleDeparture(event);
        this.animator.animateDeparture();
      }

      // Update animation (conditional for maximum speed)
      if (this.speed < 100) {
        this.animator.update(this.model.state);
        await this.sleep(this.animationDelay / this.speed);
      }
    }

    // Final metrics calculation
    this.model.finalizeMetrics(duration);
  }

  scheduleEvent(type, time, data = {}) {
    const event = { type, time, ...data };
    this.eventQueue.enqueue(event, time); // <-- O(log n) instead of O(n)!
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}