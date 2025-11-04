// models/QueueModel.js - BASE CLASS (REFINED)
// Improved metrics calculation using area-under-curve integration method
// for accurate time-weighted averages

class QueueModel {
  constructor(name, params) {
    this.name = name;
    this.params = params; // {lambda, mu, servers, capacity, population}
    this.reset();
  }

  // Reset simulation state
  reset() {
    this.state = {
      time: 0,
      queue: [],
      serversOccupied: 0,
      totalInSystem: 0,
      arrivals: 0,
      departures: 0,
      rejected: 0,
      maxQueueLength: 0,
      busyServers: [],
      customersOutside: this.params.population || 0
    };

    // Cumulative statistics for time-weighted averages
    this.cumulativeStats = {
      areaUnderL: 0,      // Integral of customers in system over time
      areaUnderLq: 0,     // Integral of customers in queue over time
      totalWaitTime: 0,   // Sum of all wait times in queue
      totalSystemTime: 0, // Sum of all times in system
      lastUpdateTime: 0
    };
  }

  // Update cumulative statistics before state change
  updateCumulativeStats(timeDiff) {
    if (timeDiff <= 0) return;
    
    // Time-weighted integration (area under curve)
    this.cumulativeStats.areaUnderL += this.state.totalInSystem * timeDiff;
    this.cumulativeStats.areaUnderLq += this.state.queue.length * timeDiff;

    // Track max queue length
    if (this.state.queue.length > this.state.maxQueueLength) {
      this.state.maxQueueLength = this.state.queue.length;
    }
  }

  // Calculate final metrics after simulation
  calculateMetrics() {
    const totalTime = this.state.time;
    const served = this.state.departures;
    
    // Effective arrival rate (important for models with rejections)
    const lambda_eff = served / totalTime;

    // Time-weighted averages using area under curve
    const L = totalTime > 0 ? this.cumulativeStats.areaUnderL / totalTime : 0;
    const Lq = totalTime > 0 ? this.cumulativeStats.areaUnderLq / totalTime : 0;

    // Use Little's Law for consistency: L = λ * W
    const W = lambda_eff > 0 ? L / lambda_eff : 0;
    const Wq = lambda_eff > 0 ? Lq / lambda_eff : 0;

    // Server utilization (actual observed, not theoretical)
    const servers = this.params.servers || 1;
    const rho = (L - Lq) / servers;

    // Idle probability (approximation from observed utilization)
    const P0 = this.calculateIdleProbability ? 
               this.calculateIdleProbability() : 
               Math.max(0, 1 - rho);

    return {
      lambda: this.params.lambda,        // Theoretical arrival rate
      lambda_eff: lambda_eff,            // Effective arrival rate
      mu: this.params.mu,
      rho: rho,                          // Actual utilization
      L: L,                              // Average in system
      Lq: Lq,                            // Average in queue
      W: W,                              // Average time in system
      Wq: Wq,                            // Average time in queue
      P0: P0,                            // Probability of idle
      maxQueue: this.state.maxQueueLength,
      served: served,
      rejected: this.state.rejected,
      utilizationPercent: (rho * 100).toFixed(2)
    };
  }

  // Finalize metrics (called at end of simulation)
  finalizeMetrics(duration) {
    // Ensure final time interval is accounted for
    const finalTimeDiff = duration - this.state.time;
    if (finalTimeDiff > 0) {
      this.updateCumulativeStats(finalTimeDiff);
      this.state.time = duration;
    }
    
    this.metrics = this.calculateMetrics();
  }

  // Abstract methods (to be implemented by each model)
  validateParams() { throw new Error('Must implement validateParams()'); }
  handleArrival(event) { throw new Error('Must implement handleArrival()'); }
  handleDeparture(event) { throw new Error('Must implement handleDeparture()'); }

  // Optional: Model-specific idle probability calculation
  calculateIdleProbability() {
    // Default implementation - can be overridden by subclasses
    return null;
  }
}