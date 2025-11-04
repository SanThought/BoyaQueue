// models/MM1.js - M/M/1 Implementation (REFINED)
// Single server, infinite capacity queue model

class MM1Model extends QueueModel {
  constructor(params) {
    super('M/M/1', params);
    this.params.servers = 1;
  }

  validateParams() {
    if (this.params.lambda >= this.params.mu) {
      return { 
        valid: false, 
        error: 'λ debe ser < μ para estabilidad del sistema' 
      };
    }
    return { valid: true };
  }

  handleArrival(event) {
    this.state.arrivals++;

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
      // Add to queue
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