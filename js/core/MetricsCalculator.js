// core/MetricsCalculator.js
class MetricsCalculator {
  static calculateTheoretical(modelType, params) {
    // Theoretical formulas for each model type
    switch(modelType) {
      case 'MM1':
        return this.calculateMM1(params);
      case 'MMs':
        return this.calculateMMs(params);
      case 'MMsK':
        return this.calculateMMsK(params);
      case 'MMsN':
        return this.calculateMMsN(params);
      default:
        return null;
    }
  }

  static calculateMM1(params) {
    const { lambda, mu } = params;
    const rho = lambda / mu;

    if (rho >= 1) return null; // Unstable system

    return {
      rho: rho,
      L: rho / (1 - rho),
      Lq: (rho * rho) / (1 - rho),
      W: 1 / (mu - lambda),
      Wq: rho / (mu - lambda),
      P0: 1 - rho
    };
  }

  static calculateMMs(params) {
    const { lambda, mu, servers } = params;
    const rho = lambda / (servers * mu);

    if (rho >= 1) return null; // Unstable

    // Calculate P0 using Erlang C formula
    let sum = 0;
    for (let n = 0; n < servers; n++) {
      sum += Math.pow(lambda / mu, n) / this.factorial(n);
    }

    const term = Math.pow(lambda / mu, servers) / 
                 (this.factorial(servers) * (1 - rho));
    const P0 = 1 / (sum + term);

    // Probability of waiting (Erlang C)
    const C = (Math.pow(lambda / mu, servers) / this.factorial(servers)) * 
              (servers * mu / (servers * mu - lambda)) * P0;

    return {
      rho: rho,
      P0: P0,
      Lq: C * rho / (1 - rho),
      L: (lambda / mu) + (C * rho / (1 - rho)),
      Wq: C / (servers * mu - lambda),
      W: (C / (servers * mu - lambda)) + (1 / mu),
      C: C // Probability of waiting
    };
  }

  static calculateMMsK(params) {
    const { lambda, mu, servers, capacity } = params;
    const rho = lambda / (servers * mu);
    const a = lambda / mu;

    // Calculate P0
    let sum = 0;
    for (let n = 0; n < servers; n++) {
      sum += Math.pow(a, n) / this.factorial(n);
    }

    let sumK = 0;
    for (let n = servers; n <= capacity; n++) {
      sumK += Math.pow(a, n) / 
              (this.factorial(servers) * Math.pow(servers, n - servers));
    }

    const P0 = 1 / (sum + sumK);

    // Effective arrival rate (some customers rejected)
    const Pk = (Math.pow(a, capacity) / 
               (this.factorial(servers) * Math.pow(servers, capacity - servers))) * P0;
    const lambdaEff = lambda * (1 - Pk);

    // Average queue length
    let Lq = 0;
    for (let n = servers + 1; n <= capacity; n++) {
      Lq += (n - servers) * 
            (Math.pow(a, n) / 
            (this.factorial(servers) * Math.pow(servers, n - servers))) * P0;
    }

    return {
      rho: rho,
      P0: P0,
      Pk: Pk, // Probability of blocking
      lambdaEff: lambdaEff,
      Lq: Lq,
      L: Lq + (lambdaEff / mu),
      Wq: Lq / lambdaEff,
      W: (Lq / lambdaEff) + (1 / mu)
    };
  }

  static calculateMMsN(params) {
    const { lambda, mu, servers, population } = params;

    // For finite population, arrival rate depends on system state
    // This is more complex - simplified approximation
    const a = lambda / mu;
    const rho = (population * lambda) / (servers * mu);

    // Calculate state probabilities
    const probabilities = [];
    let sum = 0;

    for (let n = 0; n <= population; n++) {
      let prob;
      if (n <= servers) {
        prob = (this.factorial(population) / this.factorial(population - n)) *
               Math.pow(a, n) / this.factorial(n);
      } else {
        prob = (this.factorial(population) / this.factorial(population - n)) *
               Math.pow(a, n) / 
               (this.factorial(servers) * Math.pow(servers, n - servers));
      }
      probabilities[n] = prob;
      sum += prob;
    }

    // Normalize
    const P0 = 1 / sum;
    for (let n = 0; n <= population; n++) {
      probabilities[n] *= P0;
    }

    // Calculate metrics
    let L = 0;
    let Lq = 0;
    for (let n = 0; n <= population; n++) {
      L += n * probabilities[n];
      if (n > servers) {
        Lq += (n - servers) * probabilities[n];
      }
    }

    const effectiveLambda = lambda * (population - L);

    return {
      rho: rho,
      P0: P0,
      L: L,
      Lq: Lq,
      W: L / effectiveLambda,
      Wq: Lq / effectiveLambda,
      effectiveLambda: effectiveLambda
    };
  }

  static factorial(n) {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }
}