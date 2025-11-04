// models/MMsN.js - M/M/s/N Implementation (REFINED)
// Multiple servers with finite population (closed system)

class MMsNModel extends QueueModel {
  constructor(params) {
    super('M/M/s/N', params);
    this.state.totalServers = params.servers;
    this.state.population = params.population;
    // All customers initially outside the system
    this.state.customersOutside = params.population;
  }

  validateParams() {
    const { lambda, mu, servers, population } = this.params;

    if (!servers || servers < 1) {
      return { valid: false, error: 'Debe haber al menos 1 servidor' };
    }

    if (!population || population < 1) {
      return { 
        valid: false, 
        error: 'La población N debe ser >= 1' 
      };
    }

    // Note: No stability condition needed (finite population)
    return { valid: true };
  }

  handleArrival(event) {
    this.state.arrivals++;
    this.state.customersOutside--;

    const customer = {
      id: this.state.arrivals,
      arrivalTime: event.time,
      startServiceTime: null,
      departureTime: null
    };

    // Check if any server is available
    if (this.state.busyServers.length < this.state.totalServers) {
      this.startService(customer, event.time);
    } else {
      // All servers busy - add to queue
      this.state.queue.push(customer);
    }

    this.state.totalInSystem++;

    // Schedule next arrival based on remaining population
    // Arrival rate is proportional to number of customers outside
    if (this.state.customersOutside > 0) {
      const effectiveLambda = this.state.customersOutside * this.params.lambda;
      const nextArrivalTime = event.time + 
        RandomGenerators.exponential(effectiveLambda);
      this.scheduleEvent('arrival', nextArrivalTime);
    }
  }

  handleDeparture(event) {
    this.state.departures++;
    this.state.totalInSystem--;
    this.state.customersOutside++;

    // Remove from busy servers
    this.state.busyServers = this.state.busyServers.filter(
      c => c.id !== event.customer.id
    );

    // If queue has customers, start next service
    if (this.state.queue.length > 0) {
      const nextCustomer = this.state.queue.shift();
      this.startService(nextCustomer, event.time);
    }

    // When customer returns to population, schedule arrival if needed
    // If this is the first customer to return, restart arrival process
    if (this.state.customersOutside === 1) {
      const nextArrivalTime = event.time + 
        RandomGenerators.exponential(this.params.lambda);
      this.scheduleEvent('arrival', nextArrivalTime);
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