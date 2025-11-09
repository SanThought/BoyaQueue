// ui/QueueAnimator.js - ENHANCED VERSION
// Model-specific visualizations with animated customer flow

class QueueAnimator {
  constructor(containerId, modelName, modelType = 'MM1') {
    this.container = document.getElementById(containerId);
    this.modelName = modelName;
    this.modelType = modelType;
    this.customerPositions = new Map();
    this.setup();
  }

  setup() {
    this.container.innerHTML = this.getLayoutForModel();
  }

  getLayoutForModel() {
    switch(this.modelType) {
      case 'MM1K':
        return this.getMM1KLayout();
      case 'MMsK':
        return this.getMMsKLayout();
      case 'MMsN':
        return this.getMMsNLayout();
      case 'MMs':
        return this.getMMsLayout();
      case 'MM1':
      default:
        return this.getMM1Layout();
    }
  }

  getMM1Layout() {
    return `
      <div class="queue-visualizer border rounded-lg p-4 bg-gray-50">
        <div class="model-badge">M/M/1 - Un Servidor</div>
        
        <!-- Arrival Zone -->
        <div class="arrival-zone flex items-center gap-3 mb-4">
          <span class="text-sm font-semibold text-gray-700">Llegadas (λ)</span>
          <div id="arrival-animation-${this.modelName}" 
               class="w-8 h-8 rounded-full bg-[#C2794D] 
                      transition-all duration-500 opacity-0 flex items-center justify-center">
            <span class="text-white text-xs">→</span>
          </div>
        </div>

        <!-- Queue Area -->
        <div class="queue-area border-2 border-dashed border-[#8B5A3C] rounded-lg p-3 mb-4 bg-white">
          <div class="flex justify-between items-center mb-2">
            <span class="text-xs font-semibold text-gray-600">Cola de Espera</span>
            <span class="text-xs text-gray-500">
              En cola: <span id="queue-count-${this.modelName}" class="font-bold text-[#C2794D]">0</span>
            </span>
          </div>
          <div id="queue-${this.modelName}" 
               class="flex gap-2 flex-wrap min-h-[40px]">
          </div>
        </div>

        <!-- Server -->
        <div class="servers-area grid gap-3 mb-4" 
             id="servers-${this.modelName}">
        </div>

        <!-- Statistics Bar -->
        <div class="stats-bar flex justify-between items-center text-xs p-2 bg-[#F5F0E8] rounded">
          <span class="text-gray-600">
            Atendidos: <span id="served-${this.modelName}" class="font-bold text-[#5A7F5F]">0</span>
          </span>
        </div>
      </div>
    `;
  }

  getMM1KLayout() {
    return `
      <div class="queue-visualizer border rounded-lg p-4 bg-gray-50">
        <div class="model-badge">M/M/1/K - Un Servidor, Capacidad Limitada</div>
        
        <!-- Capacity Meter -->
        <div class="capacity-meter">
          <div id="meter-fill-${this.modelName}" class="meter-fill" style="width: 0%"></div>
          <span class="capacity-label" id="capacity-label-${this.modelName}">0/K</span>
        </div>

        <!-- Rejection Zone -->
        <div id="rejection-zone-${this.modelName}" class="rejection-zone hidden">
          ⚠️ Rechazados: <span id="rejected-${this.modelName}">0</span>
        </div>
        
        <!-- Arrival Zone -->
        <div class="arrival-zone flex items-center gap-3 mb-4">
          <span class="text-sm font-semibold text-gray-700">Llegadas (λ)</span>
          <div id="arrival-animation-${this.modelName}" 
               class="w-8 h-8 rounded-full bg-[#C2794D] 
                      transition-all duration-500 opacity-0 flex items-center justify-center">
            <span class="text-white text-xs">→</span>
          </div>
        </div>

        <!-- Queue Area -->
        <div class="queue-area border-2 border-dashed border-[#8B5A3C] rounded-lg p-3 mb-4 bg-white">
          <div class="flex justify-between items-center mb-2">
            <span class="text-xs font-semibold text-gray-600">Cola de Espera</span>
            <span class="text-xs text-gray-500">
              En cola: <span id="queue-count-${this.modelName}" class="font-bold text-[#C2794D]">0</span>
            </span>
          </div>
          <div id="queue-${this.modelName}" 
               class="flex gap-2 flex-wrap min-h-[40px]">
          </div>
        </div>

        <!-- Single Server -->
        <div class="text-xs font-semibold text-gray-600 mb-2">Servidor</div>
        <div class="servers-area grid gap-3 mb-4" 
             id="servers-${this.modelName}">
        </div>

        <!-- Statistics Bar -->
        <div class="stats-bar flex justify-between items-center text-xs p-2 bg-[#F5F0E8] rounded">
          <span class="text-gray-600">
            Atendidos: <span id="served-${this.modelName}" class="font-bold text-[#5A7F5F]">0</span>
          </span>
        </div>
      </div>
    `;
  }

  getMMsLayout() {
    return `
      <div class="queue-visualizer border rounded-lg p-4 bg-gray-50">
        <div class="model-badge">M/M/s - Múltiples Servidores</div>
        
        <div class="arrival-zone flex items-center gap-3 mb-4">
          <span class="text-sm font-semibold text-gray-700">Llegadas (λ)</span>
          <div id="arrival-animation-${this.modelName}" 
               class="w-8 h-8 rounded-full bg-[#C2794D] 
                      transition-all duration-500 opacity-0 flex items-center justify-center">
            <span class="text-white text-xs">→</span>
          </div>
        </div>

        <div class="queue-area border-2 border-dashed border-[#8B5A3C] rounded-lg p-3 mb-4 bg-white">
          <div class="flex justify-between items-center mb-2">
            <span class="text-xs font-semibold text-gray-600">Cola de Espera</span>
            <span class="text-xs text-gray-500">
              En cola: <span id="queue-count-${this.modelName}" class="font-bold text-[#C2794D]">0</span>
            </span>
          </div>
          <div id="queue-${this.modelName}" 
               class="flex gap-2 flex-wrap min-h-[40px]">
          </div>
        </div>

        <div class="text-xs font-semibold text-gray-600 mb-2">Servidores (s)</div>
        <div class="servers-area grid grid-cols-2 gap-3 mb-4" 
             id="servers-${this.modelName}">
        </div>

        <div class="stats-bar flex justify-between items-center text-xs p-2 bg-[#F5F0E8] rounded">
          <span class="text-gray-600">
            Atendidos: <span id="served-${this.modelName}" class="font-bold text-[#5A7F5F]">0</span>
          </span>
        </div>
      </div>
    `;
  }

  getMMsKLayout() {
    return `
      <div class="queue-visualizer border rounded-lg p-4 bg-gray-50">
        <div class="model-badge">M/M/s/K - Capacidad Limitada</div>
        
        <!-- Capacity Meter -->
        <div class="capacity-meter">
          <div id="meter-fill-${this.modelName}" class="meter-fill" style="width: 0%"></div>
          <span class="capacity-label" id="capacity-label-${this.modelName}">0/K</span>
        </div>

        <!-- Rejection Zone -->
        <div id="rejection-zone-${this.modelName}" class="rejection-zone hidden">
          ⚠️ Rechazados: <span id="rejected-${this.modelName}">0</span>
        </div>
        
        <div class="arrival-zone flex items-center gap-3 mb-4">
          <span class="text-sm font-semibold text-gray-700">Llegadas (λ)</span>
          <div id="arrival-animation-${this.modelName}" 
               class="w-8 h-8 rounded-full bg-[#C2794D] 
                      transition-all duration-500 opacity-0 flex items-center justify-center">
            <span class="text-white text-xs">→</span>
          </div>
        </div>

        <div class="queue-area border-2 border-dashed border-[#8B5A3C] rounded-lg p-3 mb-4 bg-white">
          <div class="flex justify-between items-center mb-2">
            <span class="text-xs font-semibold text-gray-600">Cola de Espera</span>
            <span class="text-xs text-gray-500">
              En cola: <span id="queue-count-${this.modelName}" class="font-bold text-[#C2794D]">0</span>
            </span>
          </div>
          <div id="queue-${this.modelName}" 
               class="flex gap-2 flex-wrap min-h-[40px]">
          </div>
        </div>

        <div class="text-xs font-semibold text-gray-600 mb-2">Servidores (s)</div>
        <div class="servers-area grid grid-cols-2 gap-3 mb-4" 
             id="servers-${this.modelName}">
        </div>

        <div class="stats-bar flex justify-between items-center text-xs p-2 bg-[#F5F0E8] rounded">
          <span class="text-gray-600">
            Atendidos: <span id="served-${this.modelName}" class="font-bold text-[#5A7F5F]">0</span>
          </span>
        </div>
      </div>
    `;
  }

  getMMsNLayout() {
    return `
      <div class="queue-visualizer border rounded-lg p-4 bg-gray-50">
        <div class="model-badge">M/M/s/N - Población Finita</div>
        
        <!-- Population Pool -->
        <div class="population-pool">
          <div class="population-pool-label">
            Población Externa: <span id="pool-label-${this.modelName}">N/N</span>
          </div>
          <div id="pool-tokens-${this.modelName}" class="pool-tokens">
          </div>
        </div>
        
        <div class="arrival-zone flex items-center gap-3 mb-4">
          <span class="text-sm font-semibold text-gray-700">Llegadas (λ)</span>
          <div id="arrival-animation-${this.modelName}" 
               class="w-8 h-8 rounded-full bg-[#C2794D] 
                      transition-all duration-500 opacity-0 flex items-center justify-center">
            <span class="text-white text-xs">→</span>
          </div>
        </div>

        <div class="queue-area border-2 border-dashed border-[#8B5A3C] rounded-lg p-3 mb-4 bg-white">
          <div class="flex justify-between items-center mb-2">
            <span class="text-xs font-semibold text-gray-600">Cola de Espera</span>
            <span class="text-xs text-gray-500">
              En cola: <span id="queue-count-${this.modelName}" class="font-bold text-[#C2794D]">0</span>
            </span>
          </div>
          <div id="queue-${this.modelName}" 
               class="flex gap-2 flex-wrap min-h-[40px]">
          </div>
        </div>

        <div class="text-xs font-semibold text-gray-600 mb-2">Servidores (s)</div>
        <div class="servers-area grid grid-cols-2 gap-3 mb-4" 
             id="servers-${this.modelName}">
        </div>

        <div class="stats-bar flex justify-between items-center text-xs p-2 bg-[#F5F0E8] rounded">
          <span class="text-gray-600">
            Atendidos: <span id="served-${this.modelName}" class="font-bold text-[#5A7F5F]">0</span>
          </span>
          <span class="text-gray-600">
            En sistema: <span id="in-system-${this.modelName}" class="font-bold text-[#C2794D]">0</span>
          </span>
        </div>
      </div>
    `;
  }

  update(state) {
    // Update queue visualization
    const queueContainer = document.getElementById(`queue-${this.modelName}`);
    if (queueContainer) {
      queueContainer.innerHTML = state.queue.map((customer, i) => 
        `<div class="customer-token w-8 h-8 rounded-full bg-[#D4C5A9] border-2 border-[#8B5A3C]
                     flex items-center justify-center text-xs font-bold text-[#3A2415]" 
              title="Cliente ${customer.id}">
           ${customer.id}
         </div>`
      ).join('');
    }

    // Update counters
    const queueCount = document.getElementById(`queue-count-${this.modelName}`);
    if (queueCount) queueCount.textContent = state.queue.length;

    const servedCount = document.getElementById(`served-${this.modelName}`);
    if (servedCount) servedCount.textContent = state.departures;

    // Update servers
    this.updateServers(state);

    // Model-specific updates
    if (this.modelType === 'MM1K' || this.modelType === 'MMsK') {
      this.updateCapacityMeter(state.totalInSystem, state.capacity);
      if (state.rejected > 0) {
        const rejectionZone = document.getElementById(`rejection-zone-${this.modelName}`);
        if (rejectionZone) {
          rejectionZone.classList.remove('hidden');
          const rejectedCount = document.getElementById(`rejected-${this.modelName}`);
          if (rejectedCount) rejectedCount.textContent = state.rejected;
        }
      }
    }

    if (this.modelType === 'MMsN') {
      this.updatePopulationPool(state.customersOutside || 0, state.population || 0);
      const inSystem = document.getElementById(`in-system-${this.modelName}`);
      if (inSystem) inSystem.textContent = state.totalInSystem;
    }
  }

  updateServers(state) {
    const serversContainer = document.getElementById(`servers-${this.modelName}`);
    if (!serversContainer) return;

    serversContainer.innerHTML = '';
    const totalServers = state.totalServers || state.servers || 1;
    const busyCount = state.busyServers ? state.busyServers.length : 
                      (state.serversOccupied || 0);

    for (let i = 0; i < totalServers; i++) {
      const isOccupied = i < busyCount;
      const serverDiv = document.createElement('div');
      serverDiv.className = `server-slot border-2 rounded-lg p-3 text-center transition-all ${
        isOccupied ? 'bg-[#E8F5E9] border-[#5A7F5F]' : 'bg-white border-gray-300'
      }`;
      serverDiv.innerHTML = `
        <div class="text-xs mb-1 font-semibold text-gray-600">Servidor ${i + 1}</div>
        <div class="server-icon text-2xl">
          ${isOccupied ? '👤' : '⭕'}
        </div>
        <div class="text-xs mt-1 font-medium ${isOccupied ? 'text-[#5A7F5F]' : 'text-gray-400'}">
          ${isOccupied ? 'Ocupado' : 'Libre'}
        </div>
      `;
      serversContainer.appendChild(serverDiv);
    }
  }

  updateCapacityMeter(current, capacity) {
    const fill = document.getElementById(`meter-fill-${this.modelName}`);
    const label = document.getElementById(`capacity-label-${this.modelName}`);
    
    if (!fill || !label) return;

    const percentage = capacity > 0 ? (current / capacity) * 100 : 0;
    fill.style.width = `${Math.min(percentage, 100)}%`;
    label.textContent = `${current}/${capacity}`;

    // Color coding based on capacity
    fill.classList.remove('warning', 'critical');
    if (percentage > 90) {
      fill.classList.add('critical');
    } else if (percentage > 75) {
      fill.classList.add('warning');
    }
  }

  updatePopulationPool(customersOutside, totalPopulation) {
    const poolContainer = document.getElementById(`pool-tokens-${this.modelName}`);
    const poolLabel = document.getElementById(`pool-label-${this.modelName}`);
    
    if (!poolContainer || !poolLabel) return;

    poolLabel.textContent = `${customersOutside}/${totalPopulation}`;
    poolContainer.innerHTML = '';

    // Show tokens for customers outside (limit display to 20 for performance)
    const displayCount = Math.min(customersOutside, 20);
    for (let i = 0; i < displayCount; i++) {
      const token = document.createElement('div');
      token.className = 'pool-token';
      token.textContent = '•';
      token.title = `Cliente en población externa`;
      poolContainer.appendChild(token);
    }

    // Add "+" indicator if more than 20
    if (customersOutside > 20) {
      const moreToken = document.createElement('div');
      moreToken.className = 'pool-token';
      moreToken.style.background = 'var(--clay-terracotta)';
      moreToken.textContent = '+';
      moreToken.title = `+${customersOutside - 20} más`;
      poolContainer.appendChild(moreToken);
    }
  }

  animateArrival() {
    const element = document.getElementById(`arrival-animation-${this.modelName}`);
    if (!element) return;

    element.classList.remove('opacity-0');
    element.classList.add('animate-ping');
    setTimeout(() => {
      element.classList.add('opacity-0');
      element.classList.remove('animate-ping');
    }, 500);
  }

  animateDeparture() {
    // Simple departure animation - could be enhanced
    const servedElement = document.getElementById(`served-${this.modelName}`);
    if (servedElement) {
      servedElement.classList.add('text-[#5A7F5F]', 'font-bold');
      setTimeout(() => {
        servedElement.classList.remove('text-[#5A7F5F]', 'font-bold');
      }, 300);
    }
  }

  animateRejection() {
    const rejectionZone = document.getElementById(`rejection-zone-${this.modelName}`);
    if (rejectionZone) {
      rejectionZone.style.animation = 'pulse-select 0.5s ease';
      setTimeout(() => {
        rejectionZone.style.animation = '';
      }, 500);
    }
  }
}
