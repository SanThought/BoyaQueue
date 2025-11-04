// ui/QueueAnimator.js
class QueueAnimator {
  constructor(containerId, modelName) {
    this.container = document.getElementById(containerId);
    this.modelName = modelName;
    this.setup();
  }

  setup() {
    this.container.innerHTML = `
      <div class="queue-visualizer border rounded-lg p-4 bg-gray-50">
        <!-- Arrival Zone -->
        <div class="arrival-zone flex items-center gap-2 mb-4">
          <span class="text-sm font-medium">Llegadas (λ)</span>
          <div id="arrival-animation-${this.modelName}" 
               class="w-8 h-8 rounded-full bg-blue-500 
                      transition-all duration-500 opacity-0">
          </div>
        </div>

        <!-- Queue Area -->
        <div class="queue-area border-2 border-dashed p-3 mb-4">
          <span class="text-xs text-gray-600">Cola de Espera</span>
          <div id="queue-${this.modelName}" 
               class="flex gap-2 mt-2 flex-wrap min-h-[40px]">
            <!-- Dynamic customer tokens -->
          </div>
          <div class="text-xs mt-2 text-gray-500">
            En cola: <span id="queue-count-${this.modelName}">0</span>
          </div>
        </div>

        <!-- Servers -->
        <div class="servers-area grid gap-3 mb-4" 
             id="servers-${this.modelName}">
          <!-- Dynamic server slots -->
        </div>

        <!-- Exit Zone -->
        <div class="exit-zone flex items-center gap-2">
          <span class="text-sm font-medium">Salida</span>
          <div id="exit-animation-${this.modelName}" 
               class="flex gap-1">
            <!-- Departure animations -->
          </div>
          <span class="text-xs text-gray-600 ml-auto">
            Atendidos: <span id="served-${this.modelName}">0</span>
          </span>
        </div>

        <!-- Rejected (for capacity-limited models) -->
        <div id="rejected-zone-${this.modelName}" 
             class="rejected-zone mt-2 text-xs text-red-600 hidden">
          Rechazados: <span id="rejected-${this.modelName}">0</span>
        </div>
      </div>
    `;
  }

  update(state) {
    // Update queue visualization
    const queueContainer = document.getElementById(`queue-${this.modelName}`);
    queueContainer.innerHTML = state.queue.map((customer, i) => 
      `<div class="customer-token w-8 h-8 rounded-full bg-yellow-400 
                   flex items-center justify-center text-xs font-bold
                   animate-pulse" 
            title="Cliente ${customer.id}">
         ${customer.id}
       </div>`
    ).join('');

    // Update counters
    document.getElementById(`queue-count-${this.modelName}`).textContent = 
      state.queue.length;
    document.getElementById(`served-${this.modelName}`).textContent = 
      state.departures;

    // Update servers
    this.updateServers(state.serversOccupied, state.totalServers);

    // Show rejected zone if applicable
    if (state.rejected > 0) {
      document.getElementById(`rejected-zone-${this.modelName}`)
        .classList.remove('hidden');
      document.getElementById(`rejected-${this.modelName}`).textContent = 
        state.rejected;
    }
  }

  updateServers(occupied, total) {
    const serversContainer = document.getElementById(`servers-${this.modelName}`);
    serversContainer.innerHTML = '';

    for (let i = 0; i < total; i++) {
      const isOccupied = i < occupied;
      serversContainer.innerHTML += `
        <div class="server-slot border-2 rounded p-3 text-center
                    ${isOccupied ? 'bg-green-100 border-green-500' : 'bg-gray-100'}">
          <div class="text-xs mb-1">Servidor ${i + 1}</div>
          <div class="server-icon text-2xl">
            ${isOccupied ? '👤' : '⭕'}
          </div>
          <div class="text-xs mt-1 ${isOccupied ? 'text-green-700' : 'text-gray-500'}">
            ${isOccupied ? 'Ocupado' : 'Libre'}
          </div>
        </div>
      `;
    }
  }

  animateArrival() {
    const element = document.getElementById(`arrival-animation-${this.modelName}`);
    element.classList.remove('opacity-0');
    element.classList.add('animate-ping');
    setTimeout(() => {
      element.classList.add('opacity-0');
      element.classList.remove('animate-ping');
    }, 500);
  }

  animateDeparture() {
    const exitZone = document.getElementById(`exit-animation-${this.modelName}`);
    const token = document.createElement('div');
    token.className = 'w-6 h-6 rounded-full bg-green-500 animate-bounce';
    exitZone.appendChild(token);
    setTimeout(() => token.remove(), 1000);
  }
}