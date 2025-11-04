// ui/ComparisonTable.js
class ComparisonTable {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render(modelsData) {
    const metrics = [
      { key: 'lambda', label: 'λ (tasa llegada teórica)', format: 'decimal' },
      { key: 'lambda_eff', label: 'λₑ (tasa llegada efectiva)', format: 'decimal', highlight: 'max' },
      { key: 'mu', label: 'μ (tasa servicio)', format: 'decimal' },
      { key: 'rho', label: 'ρ (utilización)', format: 'percent', highlight: 'min' },
      { key: 'L', label: 'L (clientes en sistema)', format: 'decimal', highlight: 'min' },
      { key: 'Lq', label: 'Lq (clientes en cola)', format: 'decimal', highlight: 'min' },
      { key: 'W', label: 'W (tiempo en sistema)', format: 'time', highlight: 'min' },
      { key: 'Wq', label: 'Wq (tiempo en cola)', format: 'time', highlight: 'min' },
      { key: 'P0', label: 'P₀ (prob. sistema vacío)', format: 'percent' },
      { key: 'maxQueue', label: 'Cola máxima observada', format: 'integer' },
      { key: 'served', label: 'Clientes atendidos', format: 'integer', highlight: 'max' },
      { key: 'rejected', label: 'Clientes rechazados', format: 'integer', highlight: 'min' }
    ];

    let html = `
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="border p-2 text-left">Métrica</th>
              ${modelsData.map(m => 
                `<th class="border p-2 text-center">${m.name}</th>`
              ).join('')}
            </tr>
          </thead>
          <tbody>
    `;

    metrics.forEach(metric => {
      html += `<tr class="hover:bg-gray-50">
        <td class="border p-2 font-medium">${metric.label}</td>`;

      const values = modelsData.map(m => m.metrics[metric.key]);
      const bestIndex = this.findBest(values, metric.highlight);

      modelsData.forEach((model, i) => {
        const value = model.metrics[metric.key];
        const formatted = this.formatValue(value, metric.format);
        const isBest = bestIndex === i && metric.highlight;

        html += `
          <td class="border p-2 text-center ${isBest ? 'bg-green-100 font-bold' : ''}">
            ${formatted}
            ${isBest ? ' 🏆' : ''}
          </td>`;
      });

      html += '</tr>';
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    this.container.innerHTML = html;
  }

  formatValue(value, format) {
    switch(format) {
      case 'percent': return `${(value * 100).toFixed(2)}%`;
      case 'decimal': return value.toFixed(4);
      case 'time': return `${value.toFixed(4)} unidades`;
      case 'integer': return Math.round(value);
      default: return value;
    }
  }

  findBest(values, mode) {
    if (!mode) return -1;
    if (mode === 'min') return values.indexOf(Math.min(...values));
    if (mode === 'max') return values.indexOf(Math.max(...values));
    return -1;
  }
}