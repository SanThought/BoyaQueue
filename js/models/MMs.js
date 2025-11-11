// models/MMs.js - M/M/s Implementation (REFINED)
// Multiple servers, infinite capacity queue model

class MMsModel extends QueueModel {
  constructor(params) {
    super('M/M/s', params);
  }

  validateParams() {
    const { lambda, mu, servers } = this.params;

    if (!servers || servers < 1) {
      return { valid: false, error: 'Debe haber al menos 1 servidor' };
    }

    if (lambda >= servers * mu) {
      return { 
        valid: false, 
        error: 'λ debe ser < s×μ para estabilidad del sistema' 
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

    // Check if any server is available
    if (this.state.busyServers.length < this.params.servers) {
      this.startService(customer, event.time);
    } else {
      // All servers busy - add to queue
      this.state.queue.push(customer);
    }

    this.state.totalInSystem++;
  }

  handleDeparture(event) {
    this.state.departures++;
    this.state.totalInSystem--;

    // Remove from busy servers
    this.state.busyServers = this.state.busyServers.filter(
      c => c.id !== event.customer.id
    );

    // If queue has customers, start next service
    if (this.state.queue.length > 0) {
      const nextCustomer = this.state.queue.shift();
      this.startService(nextCustomer, event.time);
    }
  }

  startService(customer, time) {
    customer.startServiceTime = time;
    customer.waitTime = time - customer.arrivalTime;
    this.state.busyServers.push(customer);

    const serviceTime = RandomGenerators.exponential(this.params.mu);
    customer.departureTime = time + serviceTime;

    // scheduleEvent is injected by SimulationEngine
    this.scheduleEvent('departure', time + serviceTime, { customer });
  }
}