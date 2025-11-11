// ui/ChartManager.js
class ChartManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.charts = []; // Store chart instances for cleanup
    this.colors = [
      { bg: 'rgba(194, 121, 77, 0.7)', border: 'rgba(194, 121, 77, 1)' },   // Clay terracotta
      { bg: 'rgba(90, 127, 95, 0.7)', border: 'rgba(90, 127, 95, 1)' },     // Boyacá green
      { bg: 'rgba(139, 90, 60, 0.7)', border: 'rgba(139, 90, 60, 1)' },     // Clay deep
      { bg: 'rgba(180, 141, 111, 0.7)', border: 'rgba(180, 141, 111, 1)' },  // Earth brown
      { bg: 'rgba(116, 139, 117, 0.7)', border: 'rgba(116, 139, 117, 1)' },  // Sage gray-green
      { bg: 'rgba(212, 197, 169, 0.7)', border: 'rgba(212, 197, 169, 1)' }   // Sand beige
    ];
  }

  destroy() {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];
  }

  renderAll(modelsData) {
    this.destroy();
    this.container.innerHTML = `
      <!-- Combined Time Series -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 class="text-lg font-bold mb-4 text-gray-800">📈 Evolución Temporal - Clientes en Sistema (L)</h3>
        <canvas id="chart-combined-timeseries"></canvas>
      </div>

      <!-- Comparison Bar Charts -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 class="text-lg font-bold mb-4 text-gray-800">📊 Comparación de Métricas Finales</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><canvas id="chart-comparison-L"></canvas></div>
          <div><canvas id="chart-comparison-Lq"></canvas></div>
          <div><canvas id="chart-comparison-W"></canvas></div>
          <div><canvas id="chart-comparison-rho"></canvas></div>
        </div>
      </div>

      <!-- Individual Time Series -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-bold mb-4 text-gray-800">🔍 Series de Tiempo Individuales</h3>
        <div id="individual-timeseries-container" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Dynamic canvases -->
        </div>
      </div>
    `;

    this.renderCombinedTimeSeries(modelsData);
    this.renderComparisonCharts(modelsData);
    this.renderIndividualTimeSeries(modelsData);
  }

  renderCombinedTimeSeries(modelsData) {
    const ctx = document.getElementById('chart-combined-timeseries');
    if (!ctx) return;

    const datasets = modelsData.map((modelData, index) => ({
      label: modelData.name,
      data: modelData.timeSeries.time.map((t, i) => ({
        x: t,
        y: modelData.timeSeries.L[i]
      })),
      borderColor: this.colors[index % this.colors.length].border,
      backgroundColor: this.colors[index % this.colors.length].bg,
      borderWidth: 2,
      tension: 0.3,
      pointRadius: 0,
      pointHoverRadius: 4
    }));

    const chart = new Chart(ctx, {
      type: 'line',
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2.5,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(2)} clientes`
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            title: {
              display: true,
              text: 'Tiempo (unidades)'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Clientes en Sistema (L)'
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  renderComparisonCharts(modelsData) {
    // L - Clientes en Sistema
    this.createComparisonBar('chart-comparison-L', 
      'Clientes en Sistema (L)',
      modelsData.map(m => m.name),
      modelsData.map(m => m.metrics.L)
    );

    // Lq - Clientes en Cola
    this.createComparisonBar('chart-comparison-Lq',
      'Clientes en Cola (Lq)',
      modelsData.map(m => m.name),
      modelsData.map(m => m.metrics.Lq)
    );

    // W - Tiempo en Sistema
    this.createComparisonBar('chart-comparison-W',
      'Tiempo en Sistema (W)',
      modelsData.map(m => m.name),
      modelsData.map(m => m.metrics.W)
    );

    // rho - Utilización
    this.createComparisonBar('chart-comparison-rho',
      'Utilización (ρ)',
      modelsData.map(m => m.name),
      modelsData.map(m => m.metrics.rho * 100)
    );
  }

  createComparisonBar(canvasId, title, labels, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: title,
          data: data,
          backgroundColor: labels.map((_, i) => this.colors[i % this.colors.length].bg),
          borderColor: labels.map((_, i) => this.colors[i % this.colors.length].border),
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: title,
            font: { size: 14, weight: 'bold' }
          }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
    this.charts.push(chart);
  }

  renderIndividualTimeSeries(modelsData) {
    const container = document.getElementById('individual-timeseries-container');
    if (!container) return;

    modelsData.forEach((modelData, index) => {
      const canvasId = `chart-individual-${index}`;
      const div = document.createElement('div');
      div.className = 'border border-gray-200 rounded-lg p-4';
      div.innerHTML = `
        <h4 class="text-sm font-semibold mb-3 text-gray-700">${modelData.name}</h4>
        <canvas id="${canvasId}"></canvas>
      `;
      container.appendChild(div);

      setTimeout(() => {
        const ctx = document.getElementById(canvasId);
        const chart = new Chart(ctx, {
          type: 'line',
          data: {
            datasets: [
              {
                label: 'L (Sistema)',
                data: modelData.timeSeries.time.map((t, i) => ({
                  x: t, y: modelData.timeSeries.L[i]
                })),
                borderColor: this.colors[index % this.colors.length].border,
                backgroundColor: this.colors[index % this.colors.length].bg,
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 0
              },
              {
                label: 'Lq (Cola)',
                data: modelData.timeSeries.time.map((t, i) => ({
                  x: t, y: modelData.timeSeries.Lq[i]
                })),
                borderColor: 'rgba(139, 90, 60, 1)',
                backgroundColor: 'rgba(139, 90, 60, 0.5)',
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 0,
                borderDash: [5, 5]
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.5,
            plugins: {
              legend: { display: true, position: 'top' }
            },
            scales: {
              x: { type: 'linear', display: false },
              y: { beginAtZero: true }
            }
          }
        });
        this.charts.push(chart);
      }, 100);
    });
  }

  renderComparison(modelsData) {
    this.container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <canvas id="chart-utilization"></canvas>
        </div>
        <div>
          <canvas id="chart-queue-length"></canvas>
        </div>
        <div>
          <canvas id="chart-wait-times"></canvas>
        </div>
        <div>
          <canvas id="chart-throughput"></canvas>
        </div>
      </div>
    `;

    // Utilization comparison
    this.createBarChart('chart-utilization', 
      'Utilización del Sistema (ρ)',
      modelsData.map(m => m.name),
      modelsData.map(m => m.metrics.rho * 100),
      '%'
    );

    // Queue length comparison
    this.createBarChart('chart-queue-length',
      'Longitud Promedio de Cola (Lq)',
      modelsData.map(m => m.name),
      modelsData.map(m => m.metrics.Lq),
      'clientes'
    );

    // Wait times comparison
    this.createBarChart('chart-wait-times',
      'Tiempo de Espera (Wq)',
      modelsData.map(m => m.name),
      modelsData.map(m => m.metrics.Wq),
      'unidades de tiempo'
    );

    // Throughput comparison
    this.createBarChart('chart-throughput',
      'Clientes Atendidos',
      modelsData.map(m => m.name),
      modelsData.map(m => m.metrics.served),
      'clientes'
    );
  }

  createBarChart(canvasId, title, labels, data, unit) {
    const ctx = document.getElementById(canvasId);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: title,
          data: data,
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',   // blue
            'rgba(16, 185, 129, 0.7)',   // green
            'rgba(245, 158, 11, 0.7)',   // amber
            'rgba(239, 68, 68, 0.7)',    // red
            'rgba(139, 92, 246, 0.7)',   // purple
            'rgba(236, 72, 153, 0.7)'    // pink
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(139, 92, 246, 1)',
            'rgba(236, 72, 153, 1)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title: {
            display: true,
            text: title,
            font: { size: 16, weight: 'bold' }
          },
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.parsed.y.toFixed(4)} ${unit}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: unit
            }
          }
        }
      }
    });
  }
}