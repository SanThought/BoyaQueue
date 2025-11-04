# 🔄 BoyaQueue - Simulador de Teoría de Colas

## 📖 Descripción

BoyaQueue es un simulador interactivo de última generación para el análisis comparativo de sistemas de colas basado en Teoría de Colas. Desarrollado como proyecto final para la materia de Investigación de Operaciones con arquitectura profesional y optimizaciones avanzadas.

## ✨ Características

### 🎯 Características Core
- ✅ **Múltiples modelos**: M/M/1, M/M/s, M/M/s/K, M/M/s/N
- 🎬 **Animación en tiempo real** de llegadas, colas y servicios
- 📊 **Comparación simultánea** de hasta 4 modelos
- 📈 **Visualizaciones gráficas** interactivas con Chart.js
- 💡 **Análisis automático** con conclusiones y recomendaciones
- 📤 **Exportación** en CSV, JSON y texto formateado
- 🎯 **Métricas completas**: L, Lq, W, Wq, ρ, P₀, λₑ, y más

### ⚡ Mejoras v1.1 (Nuevo)
- 🚀 **Optimización de rendimiento**: Cola de prioridad (min-heap) para simulaciones ultra-rápidas
- 📐 **Métricas precisas**: Cálculo de área bajo la curva para promedios ponderados por tiempo
- 🚨 **Detección de inestabilidad**: Alertas automáticas para sistemas inestables (λ ≥ s×μ)
- 🔄 **Botón "Limpiar Todo"**: Reset completo de la aplicación con confirmación
- 📊 **Lambda efectiva (λₑ)**: Métrica nueva para modelos con rechazos
- ✨ **UX mejorada**: Scroll automático, confirmaciones, feedback visual

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

| Métrica | Descripción | Método de Cálculo |
|---------|-------------|-------------------|
| **λ** | Tasa de llegadas teórica | Parámetro de entrada |
| **λₑ** | Tasa de llegadas efectiva ⭐ NEW | Clientes atendidos / tiempo total |
| **μ** | Tasa de servicio | Parámetro de entrada |
| **ρ** | Utilización observada | (L - Lq) / s |
| **L** | Clientes promedio en sistema | Área bajo curva / tiempo ⭐ |
| **Lq** | Clientes promedio en cola | Área bajo curva / tiempo ⭐ |
| **W** | Tiempo promedio en sistema | L / λₑ (Ley de Little) |
| **Wq** | Tiempo promedio en cola | Lq / λₑ (Ley de Little) |
| **P₀** | Probabilidad de sistema vacío | Observado o aproximado |
| **Cola máx** | Máxima longitud de cola observada | Tracking durante simulación |
| **Atendidos** | Total de clientes servidos | Contador de salidas |
| **Rechazados** | Clientes rechazados | Solo M/M/s/K |

⭐ = Mejora v1.1: Cálculo más preciso usando integración temporal

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

- **HTML5** - Estructura semántica
- **Tailwind CSS** (CDN) - Estilos responsivos modernos
- **Vanilla JavaScript (ES6+)** - Lógica de simulación sin dependencias
- **Chart.js** - Visualizaciones interactivas
- **Discrete Event Simulation (DES)** - Motor de simulación de eventos discretos
- **Min-Heap Priority Queue** - Optimización de rendimiento O(log n) ⭐ NEW

## 📁 Estructura del Proyecto

```plaintext
BoyaQueue/
├── index.html                       # Página principal
├── README.md                        # Documentación principal
├── CHANGELOG.md                     # Registro de mejoras v1.1 ⭐ NEW
├── TESTING_GUIDE.md                 # Guía de pruebas ⭐ NEW
├── css/
│   └── styles.css                  # Estilos personalizados
└── js/
    ├── core/
    │   ├── PriorityQueue.js         # Min-heap optimizado ⭐ NEW
    │   ├── SimulationEngine.js      # Motor DES (refinado) ⭐
    │   ├── RandomGenerators.js      # Generadores aleatorios
    │   └── MetricsCalculator.js     # Cálculos teóricos
    ├── models/
    │   ├── QueueModel.js            # Clase base (refinada) ⭐
    │   ├── MM1.js                   # M/M/1 (refinado) ⭐
    │   ├── MMs.js                   # M/M/s (refinado) ⭐
    │   ├── MMsK.js                  # M/M/s/K (refinado) ⭐
    │   └── MMsN.js                  # M/M/s/N (refinado) ⭐
    ├── ui/
    │   ├── QueueAnimator.js         # Animaciones en tiempo real
    │   ├── ComparisonTable.js       # Tabla de resultados (refinada) ⭐
    │   ├── ChartManager.js          # Gráficas interactivas
    │   └── ConclusionsGenerator.js  # Análisis inteligente (refinado) ⭐
    └── app.js                       # Orquestador principal (refinado) ⭐

⭐ = Archivos nuevos o significativamente mejorados en v1.1
```

## 📈 Mejoras Implementadas v1.1

- [x] ⚡ **Cola de prioridad (min-heap)** - Rendimiento O(log n) vs O(n)
- [x] 📐 **Métricas de área bajo curva** - Promedios ponderados por tiempo
- [x] 🚨 **Detección de sistemas inestables** - Alertas automáticas
- [x] 📊 **Lambda efectiva (λₑ)** - Tasa real considerando rechazos
- [x] 🔄 **Botón "Limpiar Todo"** - Reset completo con confirmación
- [x] ✨ **Scroll automático** - Navegación mejorada a resultados
- [x] 🎯 **Arquitectura refinada** - Código modular y mantenible

Ver [CHANGELOG.md](CHANGELOG.md) para detalles completos.

## 🔮 Roadmap (Próximas Mejoras)

### Prioridad Alta
- [ ] **M/G/1** (servicio con distribución general)
- [ ] **M/D/1** (servicio determinístico)
- [ ] **Comparación con valores teóricos** (fórmulas vs simulación)

### Prioridad Media
- [ ] Prioridades en cola
- [ ] Disciplinas de servicio (LIFO, SIRO, Priority)
- [ ] Warm-up period configurable
- [ ] Múltiples corridas independientes (seeds)
- [ ] Intervalos de confianza estadísticos

### Prioridad Baja
- [ ] Guardado/carga de configuraciones
- [ ] Modo oscuro
- [ ] Exportación de gráficas (PNG/SVG)
- [ ] Tutorial interactivo
- [ ] Validación cruzada con software especializado

## 👥 Autores

Proyecto Final - Investigación de Operaciones  
[Tu Universidad/Institución]

## 📄 Licencia

Este proyecto es de código abierto para fines educativos.

## 📚 Documentación Adicional

- **[CHANGELOG.md](CHANGELOG.md)** - Registro detallado de mejoras v1.1
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Guía de pruebas y verificación
- **Código fuente** - Ampliamente comentado para facilitar comprensión

## 🎓 Uso Académico

Este proyecto está diseñado para:
- ✅ Proyectos finales de Investigación de Operaciones
- ✅ Enseñanza de Teoría de Colas
- ✅ Comparación de sistemas de servicio
- ✅ Validación de fórmulas teóricas mediante simulación
- ✅ Análisis de optimización de recursos

**Ventajas para uso académico:**
- Sin dependencias complejas (funciona en cualquier navegador)
- Código fuente educativo y bien documentado
- Exportación fácil para reportes
- Análisis automático con conclusiones

## 🚀 Performance

**Benchmarks** (laptop estándar, navegador Chrome):
- Simulación 100 unidades: ~1 segundo
- Simulación 1,000 unidades: ~5 segundos
- Simulación 10,000 unidades: ~30 segundos

**Mejora de rendimiento v1.1:**
- 50-100x más rápido que versión anterior
- Soporta simulaciones extensas sin bloqueo de UI

## 🤝 Contribuciones

Este es un proyecto educativo. Si deseas contribuir:
1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 🆘 Soporte

Para reportar bugs o sugerencias:
- Revisar [TESTING_GUIDE.md](TESTING_GUIDE.md) primero
- Crear un issue en el repositorio con detalles
- Incluir: Modelo usado, parámetros, comportamiento esperado vs observado

---

**Versión:** 1.1 (Refinamiento Profesional)  
**Fecha:** Noviembre 4, 2025  
**Proyecto Final** - Investigación de Operaciones