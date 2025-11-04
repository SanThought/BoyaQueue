// ui/ConclusionsGenerator.js
class ConclusionsGenerator {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  generate(modelsData) {
    const conclusions = [];

    // 0. CRITICAL: Detect unstable systems first
    const unstableModels = this.detectUnstableSystems(modelsData);
    if (unstableModels.length > 0) {
      unstableModels.forEach(conclusion => conclusions.push(conclusion));
    }

    // Filter out unstable models from further analysis
    const stableModels = modelsData.filter(model => {
      const servers = model.params.servers || 1;
      const stabilityLambda = servers * model.params.mu;
      const isStable = model.name.includes('K') || 
                       model.name.includes('N') || 
                       model.params.lambda < stabilityLambda;
      return isStable;
    });

    // If no stable models, skip further analysis
    if (stableModels.length === 0) {
      conclusions.push({
        title: '⚠️ Sin Modelos Estables',
        text: 'Todos los modelos configurados son inestables. No se puede realizar análisis comparativo válido.',
        type: 'error'
      });
      this.render(conclusions);
      return;
    }

    // 1. Best overall performance (only among stable models)
    const bestModel = this.findBestOverall(stableModels);
    conclusions.push({
      title: '🏆 Mejor Modelo General',
      text: `El modelo <strong>${bestModel.name}</strong> presenta el mejor 
             desempeño general con menor tiempo de espera promedio 
             (Wq = ${bestModel.metrics.Wq.toFixed(4)}) y utilización óptima 
             (ρ = ${(bestModel.metrics.rho * 100).toFixed(2)}%).`,
      type: 'success'
    });

    // 2. Utilization analysis
    const utilizationAnalysis = this.analyzeUtilization(stableModels);
    conclusions.push(utilizationAnalysis);

    // 3. Queue length comparison
    const queueAnalysis = this.analyzeQueueLength(stableModels);
    conclusions.push(queueAnalysis);

    // 4. Wait time insights
    const waitTimeAnalysis = this.analyzeWaitTimes(stableModels);
    conclusions.push(waitTimeAnalysis);

    // 5. Throughput analysis (use all models including unstable)
    const throughputAnalysis = this.analyzeThroughput(modelsData);
    conclusions.push(throughputAnalysis);

    // 6. Recommendations
    const recommendations = this.generateRecommendations(modelsData);
    conclusions.push(recommendations);

    // Render
    this.render(conclusions);
  }

  detectUnstableSystems(modelsData) {
    const unstableConclusions = [];

    modelsData.forEach(model => {
      const servers = model.params.servers || 1;
      const stabilityLambda = servers * model.params.mu;
      
      // M/M/1 and M/M/s are unstable if λ >= s*μ
      // M/M/s/K and M/M/s/N are always stable due to finite constraints
      const isInfiniteCapacity = !model.name.includes('K') && !model.name.includes('N');
      const isUnstable = isInfiniteCapacity && model.params.lambda >= stabilityLambda;

      if (isUnstable) {
        const trafficIntensity = (model.params.lambda / stabilityLambda).toFixed(2);
        
        unstableConclusions.push({
          title: `🚨 Sistema Inestable Detectado: ${model.name}`,
          text: `<strong>¡ALERTA CRÍTICA!</strong> La tasa de llegadas 
                 (λ = ${model.params.lambda}) es mayor o igual a la capacidad 
                 total de servicio (s×μ = ${servers} × ${model.params.mu} = ${stabilityLambda}). 
                 <br><br>
                 <strong>Intensidad de tráfico: ρ = ${trafficIntensity}</strong> (debe ser < 1)
                 <br><br>
                 En teoría, la cola crecerá indefinidamente. Los resultados de 
                 la simulación para este modelo <strong>NO son representativos</strong> 
                 de un estado estable y deben interpretarse con extrema precaución.
                 <br><br>
                 <strong>Recomendación:</strong> Aumentar μ (velocidad de servicio) 
                 o s (número de servidores) para que s×μ > λ.`,
          type: 'error'
        });
      }
    });

    return unstableConclusions;
  }

  findBestOverall(modelsData) {
    // Weighted scoring: 40% wait time, 30% utilization, 30% queue length
    let bestScore = Infinity;
    let bestModel = null;

    modelsData.forEach(model => {
      const score = 
        (model.metrics.Wq * 0.4) +
        (model.metrics.rho * 0.3) +
        (model.metrics.Lq * 0.3);

      if (score < bestScore) {
        bestScore = score;
        bestModel = model;
      }
    });

    return bestModel;
  }

  analyzeUtilization(modelsData) {
    const overUtilized = modelsData.filter(m => m.metrics.rho > 0.85);
    const underUtilized = modelsData.filter(m => m.metrics.rho < 0.60);

    let text = '';
    let type = 'info';

    if (overUtilized.length > 0) {
      text = `⚠️ Los modelos <strong>${overUtilized.map(m => m.name).join(', ')}</strong> 
              presentan alta utilización (ρ > 85%), lo que puede resultar en 
              tiempos de espera prolongados. Se recomienda aumentar capacidad de servicio.`;
      type = 'warning';
    } else if (underUtilized.length > 0) {
      text = `Los modelos <strong>${underUtilized.map(m => m.name).join(', ')}</strong> 
              tienen baja utilización (ρ < 60%), indicando capacidad ociosa. 
              Podría optimizarse reduciendo recursos.`;
      type = 'info';
    } else {
      text = `Todos los modelos presentan utilización balanceada (60-85%), 
              indicando un uso eficiente de recursos.`;
      type = 'success';
    }

    return {
      title: '📊 Análisis de Utilización',
      text: text,
      type: type
    };
  }

  analyzeQueueLength(modelsData) {
    const avgLq = modelsData.reduce((sum, m) => sum + m.metrics.Lq, 0) / 
                  modelsData.length;
    const maxLq = Math.max(...modelsData.map(m => m.metrics.Lq));
    const modelWithMaxLq = modelsData.find(m => m.metrics.Lq === maxLq);

    return {
      title: '📏 Longitud de Cola',
      text: `El promedio de clientes en cola es <strong>${avgLq.toFixed(2)}</strong>. 
             El modelo <strong>${modelWithMaxLq.name}</strong> presenta la mayor 
             longitud de cola promedio (Lq = ${maxLq.toFixed(2)}), 
             con un máximo observado de ${modelWithMaxLq.metrics.maxQueue} clientes.`,
      type: 'info'
    };
  }

  analyzeWaitTimes(modelsData) {
    const minWq = Math.min(...modelsData.map(m => m.metrics.Wq));
    const maxWq = Math.max(...modelsData.map(m => m.metrics.Wq));
    const diff = ((maxWq - minWq) / minWq * 100).toFixed(1);

    const fastestModel = modelsData.find(m => m.metrics.Wq === minWq);
    const slowestModel = modelsData.find(m => m.metrics.Wq === maxWq);

    return {
      title: '⏱️ Tiempos de Espera',
      text: `El modelo <strong>${fastestModel.name}</strong> ofrece el menor 
             tiempo de espera (Wq = ${minWq.toFixed(4)}), mientras que 
             <strong>${slowestModel.name}</strong> presenta el mayor 
             (Wq = ${maxWq.toFixed(4)}). Diferencia: <strong>${diff}%</strong>.`,
      type: 'info'
    };
  }

  analyzeThroughput(modelsData) {
    const totalServed = modelsData.reduce((sum, m) => sum + m.metrics.served, 0);
    const totalRejected = modelsData.reduce((sum, m) => sum + m.metrics.rejected, 0);

    let text = `En total se atendieron <strong>${totalServed}</strong> clientes.`;
    let type = 'success';

    if (totalRejected > 0) {
      const rejectionRate = (totalRejected / (totalServed + totalRejected) * 100).toFixed(2);
      text += ` Se rechazaron <strong>${totalRejected}</strong> clientes 
                (${rejectionRate}% de tasa de rechazo). Considere aumentar 
                la capacidad del sistema.`;
      type = 'warning';
    }

    return {
      title: '🚀 Capacidad y Rendimiento',
      text: text,
      type: type
    };
  }

  generateRecommendations(modelsData) {
    const recommendations = [];

    modelsData.forEach(model => {
      const m = model.metrics;

      if (m.rho > 0.9) {
        recommendations.push(
          `<strong>${model.name}:</strong> Sistema sobrecargado. 
           Aumentar tasa de servicio (μ) o número de servidores.`
        );
      }

      if (m.Lq > 10) {
        recommendations.push(
          `<strong>${model.name}:</strong> Cola excesiva. 
           Considerar agregar más servidores o reducir variabilidad.`
        );
      }

      if (m.rejected > 0) {
        recommendations.push(
          `<strong>${model.name}:</strong> Pérdida de clientes detectada. 
           Incrementar capacidad del sistema (K).`
        );
      }
    });

    return {
      title: '💡 Recomendaciones',
      text: recommendations.length > 0 
        ? '<ul class="list-disc list-inside space-y-1">' + 
          recommendations.map(r => `<li>${r}</li>`).join('') + 
          '</ul>'
        : 'No se detectaron problemas significativos en los modelos analizados.',
      type: recommendations.length > 0 ? 'warning' : 'success'
    };
  }

  render(conclusions) {
    const colors = {
      success: 'bg-green-50 border-green-200 text-green-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      error: 'bg-red-50 border-red-200 text-red-800'
    };

    this.container.innerHTML = conclusions.map(conclusion => `
      <div class="border-l-4 p-4 rounded ${colors[conclusion.type]}">
        <h4 class="font-bold text-lg mb-2">${conclusion.title}</h4>
        <p class="text-sm leading-relaxed">${conclusion.text}</p>
      </div>
    `).join('');
  }
}