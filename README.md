# 🔄 Simulador de Teoría de Colas

## 📖 Descripción

Boyaqueue es un simulador interactivo para el análisis comparativo de sistemas de colas basados en teoría de colas. Desarrollado como proyecto final para la materia de Investigación de Operaciones.

## ✨ Características

- ✅ **Múltiples modelos**: M/M/1, M/M/s, M/M/s/K, M/M/s/N, y otros.
- 🎬 **Animación en tiempo real** de llegadas, colas y servicios
- 📊 **Comparación simultánea** de hasta 4 modelos
- 📈 **Visualizaciones gráficas** con Chart.js
- 💡 **Análisis automático** con conclusiones y recomendaciones
- 📤 **Exportación** en CSV y JSON
- 🎯 **Métricas completas**: L, Lq, W, Wq, ρ, P₀, y más

## 🚀 Instalación

### Opción 1: Uso Directo (Sin servidor)

1. Descarga todos los archivos
2. Abre `index.html` en tu navegador moderno (Chrome, Firefox, Edge)

### Opción 2: Con servidor local (Recomendado)

```bash
# Usando Python 3
python -m http.server 8000

# Usando Node.js (http-server)
npx http-server -p 8000

# Usando PHP
php -S localhost:8000
```


Luego abre: `http://localhost:8000`

## 📚 Uso

### 1. Agregar Modelos

1. Selecciona el tipo de modelo (M/M/1, M/M/s, etc.)
2. Ingresa los parámetros:
   - **λ (lambda)**: Tasa de llegadas (clientes/tiempo)
   - **μ (mu)**: Tasa de servicio (clientes atendidos/tiempo)
   - **s**: Número de servidores (para modelos M/M/s)
   - **K**: Capacidad del sistema (para M/M/s/K)
   - **N**: Población finita (para M/M/s/N)
3. Haz clic en "➕ Agregar Modelo"

### 2. Ejecutar Simulación

1. Configura la duración de simulación (ej: 100 unidades de tiempo)
2. Selecciona la velocidad de animación
3. Haz clic en "▶️ Ejecutar Simulación"

### 3. Analizar Resultados

- **Tabla comparativa**: Métricas lado a lado con destacado del mejor valor
- **Gráficas**: Comparación visual de utilización, tiempos, colas
- **Conclusiones**: Análisis automático con recomendaciones

### 4. Exportar Datos

- **CSV**: Para análisis en Excel/Sheets
- **JSON**: Para procesamiento programático
- **Copiar**: Para pegar en documentos

## 📊 Métricas Calculadas

| Métrica | Descripción |
|---------|-------------|
| **λ** | Tasa de llegadas |
| **μ** | Tasa de servicio |
| **ρ** | Utilización del sistema |
| **L** | Clientes promedio en el sistema |
| **Lq** | Clientes promedio en cola |
| **W** | Tiempo promedio en el sistema |
| **Wq** | Tiempo promedio en cola |
| **P₀** | Probabilidad de sistema vacío |
| **Cola máx** | Máxima longitud de cola observada |
| **Atendidos** | Total de clientes servidos |
| **Rechazados** | Clientes rechazados (modelos con capacidad) |

## 🔬 Modelos Implementados

### M/M/1
- Un servidor
- Capacidad infinita
- Población infinita
- **Condición de estabilidad**: λ < μ

### M/M/s
- Múltiples servidores (s)
- Capacidad infinita
- Población infinita
- **Condición de estabilidad**: λ < s×μ

### M/M/s/K
- Múltiples servidores (s)
- Capacidad limitada (K)
- Los clientes son rechazados si el sistema está lleno
- **No requiere condición de estabilidad**

### M/M/s/N
- Múltiples servidores (s)
- Población finita (N)
- Tasa de llegada depende de clientes fuera del sistema
- **No requiere condición de estabilidad**

## 🛠️ Tecnologías

- **HTML5** - Estructura
- **Tailwind CSS** (CDN) - Estilos responsivos
- **Vanilla JavaScript** - Lógica de simulación
- **Chart.js** - Visualizaciones
- **Discrete Event Simulation (DES)** - Motor de simulación

## 📁 Estructura del Proyecto

```plaintext
boyaqueue/
├── index.html                    # Página principal
├── css/
│   └── styles.css               # Estilos personalizados
├── js/
│   ├── core/
│   │   ├── SimulationEngine.js  # Motor DES
│   │   ├── RandomGenerators.js  # Generadores aleatorios
│   │   └── MetricsCalculator.js # Cálculos teóricos
│   ├── models/
│   │   ├── QueueModel.js        # Clase base
│   │   ├── MM1.js              # M/M/1
│   │   ├── MMs.js              # M/M/s
│   │   ├── MMsK.js             # M/M/s/K
│   │   └── MMsN.js             # M/M/s/N
│   ├── ui/
│   │   ├── QueueAnimator.js     # Animaciones
│   │   ├── ComparisonTable.js   # Tabla de resultados
│   │   ├── ChartManager.js      # Gráficas
│   │   └── ConclusionsGenerator.js # Análisis
│   └── app.js                   # Orquestador principal
└── README.md                    # Este archivo
```

## 🔮 Roadmap (Futuras Mejoras)

- [ ] M/G/1 (servicio general)
- [ ] M/D/1 (servicio determinístico)
- [ ] Prioridades en cola
- [ ] Disciplinas de servicio (LIFO, SIRO)
- [ ] Warm-up period configurable
- [ ] Múltiples corridas (seeds)
- [ ] Intervalos de confianza
- [ ] Comparación con valores teóricos
- [ ] Guardado de configuraciones

## 👥 Autores

Proyecto Final - Investigación de Operaciones  
UPTC

## 📄 Licencia

Este proyecto es de código abierto para fines educativos.
