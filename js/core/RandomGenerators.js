// core/RandomGenerators.js
class RandomGenerators {
  // Exponential distribution (for arrival/service times)
  static exponential(rate) {
    return -Math.log(1 - Math.random()) / rate;
  }

  // Uniform distribution
  static uniform(min, max) {
    return min + Math.random() * (max - min);
  }

  // Normal distribution (Box-Muller transform)
  static normal(mean, stdDev) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z0 * stdDev;
  }

  // Poisson distribution (for discrete arrivals)
  static poisson(lambda) {
    let L = Math.exp(-lambda);
    let k = 0;
    let p = 1;

    do {
      k++;
      p *= Math.random();
    } while (p > L);

    return k - 1;
  }
}