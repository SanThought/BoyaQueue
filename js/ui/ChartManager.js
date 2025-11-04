// ui/ChartManager.js
class ChartManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
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