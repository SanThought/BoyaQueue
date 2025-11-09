// models/MM1K.js - M/M/1/K Implementation
// Single server with finite capacity (blocking system)

console.log('MM1K.js loaded');

class MM1KModel extends QueueModel {
  constructor(params) {
    super('M/M/1/K', params);
    this.params.servers = 1;
    this.state.capacity = params.capacity;
  }

  validateParams() {
    const { lambda, mu, capacity } = this.params;

    if (!capacity || capacity < 1) {
      return { 
        valid: false, 
        error: 'La capacidad K debe ser >= 1' 
      };
    }

    // No stability condition needed (finite capacity always stable)
    return { valid: true };
  }

  handleArrival(event) {
    this.state.arrivals++;

    // Check if system is at capacity (including server)
    if (this.state.totalInSystem >= this.state.capacity) {
      // Customer is rejected (blocking)
      this.state.rejected++;
      return;
    }

    const customer = {
      id: this.state.arrivals,
      arrivalTime: event.time,
      startServiceTime: null,
      departureTime: null
    };

    if (this.state.serversOccupied === 0) {
      // Server available - immediate service
      this.startService(customer, event.time);
    } else {
      // Server busy - add to queue
      this.state.queue.push(customer);
    }

    this.state.totalInSystem++;
  }

  handleDeparture(event) {
    this.state.departures++;
    this.state.serversOccupied--;
    this.state.totalInSystem--;

    // If queue has customers, start next service
    if (this.state.queue.length > 0) {
      const nextCustomer = this.state.queue.shift();
      this.startService(nextCustomer, event.time);
    }
  }

  startService(customer, time) {
    customer.startServiceTime = time;
    customer.waitTime = time - customer.arrivalTime;
    this.state.serversOccupied = 1;

    const serviceTime = RandomGenerators.exponential(this.params.mu);
    customer.departureTime = time + serviceTime;
    
    // scheduleEvent is injected by SimulationEngine
    this.scheduleEvent('departure', time + serviceTime, { customer });
  }
}
