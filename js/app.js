// app.js - ENHANCED VERSION
class BoyaqueueApp {
    constructor() {
      this.models = [];
      this.animators = [];
      this.isRunning = false;
      this.simulationSpeed = 1;
      this.maxModels = 4;
      this.init();
    }
  
    init() {
      this.setupUI();
      this.registerModels();
      this.attachEventListeners();
    }
  
    setupUI() {
      // Initialize UI state
      this.updateModelsSection();
    }
  
    registerModels() {
      this.availableModels = {
        'MM1': MM1Model,
        'MM1K': MM1KModel,
        'MMs': MMsModel,
        'MMsK': MMsKModel,
        'MMsN': MMsNModel
      };
    }
  
    attachEventListeners() {
      // Model type selector
      document.getElementById('model-type').addEventListener('change', (e) => {
        this.handleModelTypeChange(e.target.value);
      });
  
      // Add model button
      document.getElementById('add-model-btn').addEventListener('click', () => {
        this.addModelFromForm();
      });
  
      // Run simulation button
      document.getElementById('run-simulation-btn').addEventListener('click', () => {
        this.startSimulation();
      });
  
      // Speed selector
      document.getElementById('simulation-speed').addEventListener('change', (e) => {
        this.simulationSpeed = parseFloat(e.target.value);
      });

      // NUEVO: Reset all button
      document.getElementById('reset-all-btn').addEventListener('click', () => {
        this.resetAll();
      });
    }
  
    handleModelTypeChange(modelType) {
      // Show/hide relevant parameter inputs
      const serversContainer = document.getElementById('param-servers-container');
      const capacityContainer = document.getElementById('param-capacity-container');
      const populationContainer = document.getElementById('param-population-container');
  
      // Hide all optional params first
      serversContainer.classList.add('hidden');
      capacityContainer.classList.add('hidden');
      populationContainer.classList.add('hidden');
  
      // Show relevant params based on model type
      if (modelType === 'MMs' || modelType === 'MMsK' || modelType === 'MMsN') {
        serversContainer.classList.remove('hidden');
      }
  
      if (modelType === 'MM1K' || modelType === 'MMsK') {
        capacityContainer.classList.remove('hidden');
      }
  
      if (modelType === 'MMsN') {
        populationContainer.classList.remove('hidden');
      }
    }
  
    addModelFromForm() {
      if (this.models.length >= this.maxModels) {
        alert(`Máximo ${this.maxModels} modelos permitidos para comparación.`);
        return;
      }
  
      // Get form values
      const modelType = document.getElementById('model-type').value;
      const lambda = parseFloat(document.getElementById('param-lambda').value);
      const mu = parseFloat(document.getElementById('param-mu').value);
  
      if (!modelType) {
        alert('Por favor seleccione un tipo de modelo.');
        return;
      }
  
      if (!lambda || !mu || lambda <= 0 || mu <= 0) {
        alert('Por favor ingrese valores válidos para λ y μ (mayores a 0).');
        return;
      }
  
      // Build params object
      const params = { lambda, mu };
  
      if (modelType !== 'MM1' && modelType !== 'MM1K') {
        params.servers = parseInt(document.getElementById('param-servers').value) || 2;
      }
  
      if (modelType === 'MM1K' || modelType === 'MMsK') {
        params.capacity = parseInt(document.getElementById('param-capacity').value) || 10;
      }
  
      if (modelType === 'MMsN') {
        params.population = parseInt(document.getElementById('param-population').value) || 20;
      }
  
      // Create and validate model
      this.addModel(modelType, params);
    }
  
    addModel(modelType, params) {
      const ModelClass = this.availableModels[modelType];
      if (!ModelClass) {
        alert('Tipo de modelo no reconocido.');
        return;
      }
  
      const model = new ModelClass(params);
  
      const validation = model.validateParams();
      if (!validation.valid) {
        alert('❌ Error de validación:\n' + validation.error);
        return;
      }
  
      this.models.push(model);
      this.updateModelsSection();
  
      // Show simulation controls if this is first model
      if (this.models.length === 1) {
        document.getElementById('simulation-controls').classList.remove('hidden');
      }
  
      // Clear form
      this.resetForm();
    }
  
    resetForm() {
      document.getElementById('model-type').value = '';
      document.getElementById('param-lambda').value = '';
      document.getElementById('param-mu').value = '';
      document.getElementById('param-servers').value = '2';
      document.getElementById('param-capacity').value = '10';
      document.getElementById('param-population').value = '20';
  
      this.handleModelTypeChange('');
    }
  
    updateModelsSection() {
      const section = document.getElementById('models-section');
      const container = document.getElementById('models-list');
  
      if (this.models.length === 0) {
        section.classList.add('hidden');
        return;
      }
  
      section.classList.remove('hidden');
  
      container.innerHTML = this.models.map((model, index) => {
        const paramsDisplay = this.getParamsDisplay(model);
  
        return `
          <div class="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
            <div class="flex-1">
              <h4 class="font-bold text-lg text-gray-800">
                ${index + 1}. ${model.name}
              </h4>
              <p class="text-sm text-gray-600 mt-1">
                ${paramsDisplay}
              </p>
            </div>
            <button onclick="app.removeModel(${index})"
                    class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 
                           rounded text-sm transition">
              🗑️ Eliminar
            </button>
          </div>
        `;
      }).join('');
    }
  
    getParamsDisplay(model) {
      const p = model.params;
      let display = `λ=${p.lambda}, μ=${p.mu}`;
  
      if (p.servers) display += `, s=${p.servers}`;
      if (p.capacity) display += `, K=${p.capacity}`;
      if (p.population) display += `, N=${p.population}`;
  
      return display;
    }
  
    removeModel(index) {
      this.models.splice(index, 1);
      this.updateModelsSection();
  
      if (this.models.length === 0) {
        document.getElementById('simulation-controls').classList.add('hidden');
        document.getElementById('animation-section').classList.add('hidden');
        document.getElementById('results-section').classList.add('hidden');
      }
    }

    // NUEVO: Reset everything to initial state
    resetAll() {
      // Confirm with user
      if (this.models.length > 0 || 
          !document.getElementById('results-section').classList.contains('hidden')) {
        if (!confirm('¿Está seguro de que desea limpiar todos los modelos y resultados?')) {
          return;
        }
      }

      // Clear all models and animators
      this.models = [];
      this.animators = [];
      
      // Hide all sections
      document.getElementById('models-section').classList.add('hidden');
      document.getElementById('simulation-controls').classList.add('hidden');
      document.getElementById('animation-section').classList.add('hidden');
      document.getElementById('results-section').classList.add('hidden');
      
      // Clear containers
      document.getElementById('models-list').innerHTML = '';
      document.getElementById('animators-container').innerHTML = '';
      document.getElementById('comparison-table-container').innerHTML = '';
      document.getElementById('charts-container').innerHTML = '';
      document.getElementById('conclusions-container').innerHTML = '';
      
      // Reset form
      this.resetForm();

      // Scroll to top for better UX
      window.scrollTo({ behavior: 'smooth', top: 0 });
    }
  
    async startSimulation() {
      if (this.isRunning) return;
      if (this.models.length === 0) {
        alert('Por favor agregue al menos un modelo antes de simular.');
        return;
      }
  
      const duration = parseFloat(document.getElementById('simulation-duration').value);
      if (!duration || duration <= 0) {
        alert('Por favor ingrese una duración válida.');
        return;
      }
  
      // Show animation section
      this.setupAnimationContainers();
      document.getElementById('animation-section').classList.remove('hidden');
  
      // Show progress
      document.getElementById('simulation-progress').classList.remove('hidden');
      document.getElementById('run-simulation-btn').disabled = true;
      document.getElementById('run-simulation-btn').textContent = '⏳ Simulando...';
  
      // Run simulation
      await this.runSimulation(duration);
  
      // Hide progress, show results
      document.getElementById('simulation-progress').classList.add('hidden');
      document.getElementById('run-simulation-btn').disabled = false;
      document.getElementById('run-simulation-btn').textContent = '▶️ Ejecutar Simulación';
  
      document.getElementById('results-section').classList.remove('hidden');
  
      // Scroll to results
      document.getElementById('results-section').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  
    setupAnimationContainers() {
      const container = document.getElementById('animators-container');
      container.innerHTML = '';
  
      this.animators = [];
  
      this.models.forEach((model, index) => {
        const animatorDiv = document.createElement('div');
        animatorDiv.id = `animator-container-${index}`;
        animatorDiv.className = 'border rounded-lg p-4 bg-white shadow';
        animatorDiv.innerHTML = `
          <h3 class="font-bold text-lg mb-3">${model.name}</h3>
          <div id="animator-content-${index}"></div>
        `;
        container.appendChild(animatorDiv);
  
        // Pass model type to animator
        const modelType = this.getModelType(model.name);
        const animator = new QueueAnimator(
          `animator-content-${index}`, 
          `${model.name}-${index}`,
          modelType
        );
        this.animators.push(animator);
      });
    }

    getModelType(modelName) {
      // Determine model type from name (order matters - check specific before general)
      if (modelName.includes('M/M/1/K')) return 'MM1K';
      if (modelName.includes('M/M/s/K')) return 'MMsK';
      if (modelName.includes('M/M/s/N')) return 'MMsN';
      if (modelName.includes('M/M/s')) return 'MMs';
      if (modelName.includes('M/M/1')) return 'MM1';
      return 'MM1'; // Default fallback
    }
  
    async runSimulation(duration) {
      this.isRunning = true;
  
      // Reset all models
      this.models.forEach(model => {
        model.state = {
          time: 0,
          queue: [],
          serversOccupied: 0,
          totalInSystem: 0,
          arrivals: 0,
          departures: 0,
          rejected: 0,
          busyServers: [],
          customersOutside: model.params.population || 0
        };
        model.events = [];
        model.statistics = null;
      });
  
      // Run all models simultaneously
      const simulationPromises = this.models.map((model, i) => 
        this.runModelSimulation(model, this.animators[i], duration)
      );
  
      await Promise.all(simulationPromises);
  
      this.displayResults();
      this.isRunning = false;
    }
  
    async runModelSimulation(model, animator, duration) {
      const engine = new SimulationEngine(model, animator, this.simulationSpeed);
      await engine.run(duration);
    }
  
    displayResults() {
      const modelsData = this.models.map(model => ({
        name: model.name,
        params: model.params,
        metrics: model.calculateMetrics()
      }));
  
      // Render comparison table
      const comparisonTable = new ComparisonTable('comparison-table-container');
      comparisonTable.render(modelsData);
  
      // Render charts
      const chartManager = new ChartManager('charts-container');
      chartManager.renderComparison(modelsData);
  
      // Generate conclusions
      const conclusionsGen = new ConclusionsGenerator('conclusions-container');
      conclusionsGen.generate(modelsData);
  
      // Enable export buttons
      this.enableExport(modelsData);
    }
  
    enableExport(modelsData) {
      document.getElementById('export-csv').onclick = () => 
        this.exportCSV(modelsData);
      document.getElementById('export-json').onclick = () => 
        this.exportJSON(modelsData);
      document.getElementById('copy-table').onclick = () => 
        this.copyTableToClipboard(modelsData);
    }
  
    exportCSV(modelsData) {
      const metrics = [
        'lambda', 'mu', 'rho', 'L', 'Lq', 'W', 'Wq', 
        'P0', 'maxQueue', 'served', 'rejected'
      ];
  
      let csv = 'Métrica,' + modelsData.map(m => m.name).join(',') + '\n';
  
      metrics.forEach(metric => {
        const row = [metric];
        modelsData.forEach(m => {
          row.push(m.metrics[metric] || 0);
        });
        csv += row.join(',') + '\n';
      });
  
      this.downloadFile(csv, 'simulacion_colas.csv', 'text/csv');
    }
  
    exportJSON(modelsData) {
      const exportData = {
        timestamp: new Date().toISOString(),
        models: modelsData
      };
      const json = JSON.stringify(exportData, null, 2);
      this.downloadFile(json, 'simulacion_colas.json', 'application/json');
    }
  
    downloadFile(content, filename, mimeType) {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  
    copyTableToClipboard(modelsData) {
      let text = '═══════════════════════════════════════\n';
      text += '  RESULTADOS DE SIMULACIÓN DE COLAS\n';
      text += '═══════════════════════════════════════\n\n';
  
      modelsData.forEach((model, idx) => {
        text += `${idx + 1}. ${model.name}\n`;
        text += '─'.repeat(40) + '\n';
        text += `   Parámetros:\n`;
        text += `   • λ (llegadas): ${model.params.lambda}\n`;
        text += `   • μ (servicio): ${model.params.mu}\n`;
        if (model.params.servers) text += `   • Servidores: ${model.params.servers}\n`;
        if (model.params.capacity) text += `   • Capacidad: ${model.params.capacity}\n`;
        if (model.params.population) text += `   • Población: ${model.params.population}\n`;
  
        text += `\n   Métricas:\n`;
        text += `   • ρ (utilización): ${(model.metrics.rho * 100).toFixed(2)}%\n`;
        text += `   • L (en sistema): ${model.metrics.L.toFixed(4)}\n`;
        text += `   • Lq (en cola): ${model.metrics.Lq.toFixed(4)}\n`;
        text += `   • W (tiempo sistema): ${model.metrics.W.toFixed(4)}\n`;
        text += `   • Wq (tiempo cola): ${model.metrics.Wq.toFixed(4)}\n`;
        text += `   • P₀ (prob. vacío): ${(model.metrics.P0 * 100).toFixed(2)}%\n`;
        text += `   • Cola máxima: ${model.metrics.maxQueue}\n`;
        text += `   • Atendidos: ${model.metrics.served}\n`;
        text += `   • Rechazados: ${model.metrics.rejected}\n`;
        text += '\n';
      });
  
      navigator.clipboard.writeText(text).then(() => {
        alert('✅ ¡Resultados copiados al portapapeles!');
      }).catch(() => {
        alert('❌ Error al copiar. Intente nuevamente.');
      });
    }
  }
  
  // Initialize app when DOM is ready
  let app;
  document.addEventListener('DOMContentLoaded', () => {
    app = new BoyaqueueApp();
  });