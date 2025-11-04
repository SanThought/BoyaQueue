# 🧪 Guía de Prueba Rápida - BoyaQueue v1.1

## Cómo Verificar que las Mejoras Funcionan

### 🚀 Test 1: Verificar que el Proyecto Carga Sin Errores

1. **Abrir el proyecto:**
   ```bash
   # Opción 1: Abrir index.html directamente en el navegador
   # Opción 2: Usar un servidor local
   cd /home/san/Projects/BoyaQueue
   python3 -m http.server 8000
   # Luego abrir: http://localhost:8000
   ```

2. **Verificar consola del navegador:**
   - Abrir DevTools (F12)
   - Pestaña "Console"
   - **Esperado:** Sin errores rojos
   - **OK si ves:** "BoyaqueueApp initialized" o similar

---

### ✅ Test 2: Probar la Detección de Sistemas Inestables

**Objetivo:** Verificar que el sistema detecta y alerta sobre modelos inestables.

1. **Configurar modelo inestable M/M/1:**
   - Tipo de Modelo: `M/M/1`
   - λ (Tasa de Llegadas): `5`
   - μ (Tasa de Servicio): `3`
   - Clic en "Agregar Modelo"

2. **Configurar modelo estable M/M/1:**
   - Tipo de Modelo: `M/M/1`
   - λ: `2`
   - μ: `3`
   - Clic en "Agregar Modelo"

3. **Ejecutar simulación:**
   - Duración: `100`
   - Velocidad: `5x` (para ver más rápido)
   - Clic en "Ejecutar Simulación"

4. **Resultado esperado:**
   - En la sección "Análisis y Conclusiones"
   - **DEBE aparecer** un cuadro ROJO con:
     ```
     🚨 Sistema Inestable Detectado: M/M/1
     ¡ALERTA CRÍTICA! La tasa de llegadas (λ = 5) es mayor o 
     igual a la capacidad total de servicio...
     Intensidad de tráfico: ρ = 1.67 (debe ser < 1)
     ```

5. **Verificación adicional:**
   - El análisis comparativo (Mejor Modelo General) debe considerar SOLO el modelo estable
   - La tabla de comparación muestra ambos modelos, pero las conclusiones ignoran el inestable

**✅ PASS si:** Aparece la alerta roja para el modelo inestable.

---

### ✅ Test 3: Probar la Métrica λ_eff (Lambda Efectiva)

**Objetivo:** Verificar que la tasa de llegada efectiva se calcula correctamente en modelos con rechazos.

1. **Configurar modelo M/M/s/K con capacidad limitada:**
   - Tipo de Modelo: `M/M/s/K`
   - λ: `4`
   - μ: `2`
   - s (Servidores): `2`
   - K (Capacidad): `5`
   - Clic en "Agregar Modelo"

2. **Ejecutar simulación:**
   - Duración: `100`
   - Velocidad: `100` (sin animación, más rápido)
   - Clic en "Ejecutar Simulación"

3. **Resultado esperado:**
   - En la tabla de comparación
   - **Fila nueva:** `λₑ (tasa llegada efectiva)`
   - Para M/M/s/K: `λₑ < λ` (debe ser menor que 4)
   - **También debe mostrar:** "Clientes rechazados" > 0

4. **Verificación:**
   - λ teórica = 4.0000
   - λₑ efectiva ≈ 3.8 o menor (depende de la simulación)
   - Clientes rechazados > 0

**✅ PASS si:** λₑ aparece en la tabla y es menor que λ para modelos con rechazos.

---

### ✅ Test 4: Probar el Botón "Limpiar Todo"

**Objetivo:** Verificar que el botón resetea correctamente la aplicación.

1. **Tener modelos agregados** (usar los del Test 2 o 3)

2. **Clic en botón "🗑️ Limpiar Todo"** (botón rojo, al lado de "Agregar Modelo")

3. **Resultado esperado:**
   - Aparece confirmación: "¿Está seguro de que desea limpiar todos los modelos y resultados?"
   - Clic en "Aceptar"

4. **Verificación:**
   - Desaparecen todas las secciones:
     - "Modelos Configurados"
     - "Control de Simulación"
     - "Visualización en Tiempo Real"
     - "Comparación de Resultados"
   - La página hace scroll automático al inicio
   - Formulario de configuración se resetea

**✅ PASS si:** Todo se limpia y la página vuelve al estado inicial.

---

### ✅ Test 5: Verificar Rendimiento (PriorityQueue)

**Objetivo:** Comprobar que simulaciones largas se ejecutan rápidamente.

1. **Configurar modelo simple M/M/1:**
   - λ: `2`
   - μ: `3`

2. **Ejecutar simulación LARGA:**
   - Duración: `1000` (muy largo)
   - Velocidad: `100` (sin animación para máxima velocidad)
   - Clic en "Ejecutar Simulación"

3. **Resultado esperado:**
   - La simulación debe completarse en **menos de 5-10 segundos**
   - (En versión anterior sin PriorityQueue tomaría >30 segundos)

4. **Verificación:**
   - Tabla de comparación muestra:
     - "Clientes atendidos" > 1000
     - "L", "Lq", "W", "Wq" con valores coherentes
   - Gráficas se generan correctamente

**✅ PASS si:** Simulación de 1000 unidades completa en <10 segundos.

---

### ✅ Test 6: Comparación de Múltiples Modelos

**Objetivo:** Probar el análisis comparativo completo.

1. **Agregar 4 modelos diferentes:**

   **Modelo 1 - M/M/1:**
   - λ: `2`, μ: `3`

   **Modelo 2 - M/M/s (2 servidores):**
   - λ: `4`, μ: `3`, s: `2`

   **Modelo 3 - M/M/s/K (con capacidad):**
   - λ: `5`, μ: `3`, s: `2`, K: `8`

   **Modelo 4 - M/M/s/N (población finita):**
   - λ: `0.5`, μ: `3`, s: `2`, N: `10`

2. **Ejecutar simulación:**
   - Duración: `200`
   - Velocidad: `5x`

3. **Resultado esperado:**
   - **Animaciones:** 4 animadores mostrándose simultáneamente
   - **Tabla de comparación:** 4 columnas (una por modelo)
   - **Gráficas:** Barras comparativas de L, Lq, W, Wq
   - **Conclusiones:** 
     - "Mejor Modelo General" identificado con 🏆
     - Análisis de utilización
     - Análisis de longitud de cola
     - Tiempos de espera
     - Capacidad y rendimiento
     - Recomendaciones

4. **Verificación específica:**
   - M/M/s/K debe mostrar "Clientes rechazados" > 0
   - M/M/s/N debe tener λₑ diferente (población finita afecta λ efectiva)
   - El "Mejor Modelo" debe ser el que tenga menor Wq

**✅ PASS si:** 
- 4 modelos simulan correctamente
- Tabla completa
- Conclusiones detalladas
- Sin errores en consola

---

### ✅ Test 7: Exportar Resultados

**Objetivo:** Verificar que las funcionalidades de exportación funcionan.

1. **Después de cualquier simulación exitosa:**

2. **Probar exportar CSV:**
   - Clic en botón "📄 Exportar CSV"
   - **Esperado:** Descarga archivo `simulacion_colas.csv`
   - Abrir en Excel/LibreOffice
   - Verificar que contiene métricas organizadas

3. **Probar exportar JSON:**
   - Clic en botón "📋 Exportar JSON"
   - **Esperado:** Descarga archivo `simulacion_colas.json`
   - Abrir con editor de texto
   - Verificar estructura JSON válida con timestamp

4. **Probar copiar tabla:**
   - Clic en botón "📑 Copiar Tabla"
   - **Esperado:** Alerta "✅ ¡Resultados copiados al portapapeles!"
   - Pegar (Ctrl+V) en un editor de texto
   - Verificar formato ASCII art con métricas

**✅ PASS si:** Los 3 métodos de exportación funcionan correctamente.

---

## 🐛 Troubleshooting

### Error: "PriorityQueue is not defined"
**Causa:** Script no cargado correctamente  
**Solución:** 
- Verificar que `index.html` incluya:
  ```html
  <script src="js/core/PriorityQueue.js"></script>
  ```
- Debe estar ANTES de `<script src="js/core/SimulationEngine.js"></script>`

### Error: "this.model.updateCumulativeStats is not a function"
**Causa:** Modelo no hereda correctamente de QueueModel  
**Solución:**
- Verificar que todos los modelos tengan: `class XXXModel extends QueueModel`
- Verificar que no sobre-escriban métodos de la clase base sin llamar a `super()`

### Error: No aparece el botón "Limpiar Todo"
**Causa:** HTML no actualizado o caché del navegador  
**Solución:**
- Limpiar caché del navegador (Ctrl+Shift+R)
- Verificar que `index.html` tenga el botón con `id="reset-all-btn"`

### Simulación muy lenta incluso a 100x
**Causa:** Posible problema con PriorityQueue o bucle infinito  
**Solución:**
- Abrir consola del navegador
- Verificar si hay errores
- Verificar que `eventQueue` sea instancia de `PriorityQueue`, no array

---

## 📊 Métricas de Éxito

| Test | Criterio de Éxito | Prioridad |
|------|-------------------|-----------|
| Test 1 | Sin errores en consola | 🔴 Crítico |
| Test 2 | Alerta de sistema inestable aparece | 🔴 Crítico |
| Test 3 | λₑ aparece y es correcto | 🟡 Importante |
| Test 4 | Reset limpia todo | 🟡 Importante |
| Test 5 | Simulación 1000 unidades < 10s | 🟢 Deseable |
| Test 6 | 4 modelos simulan correctamente | 🔴 Crítico |
| Test 7 | Exportaciones funcionan | 🟢 Deseable |

---

## ✅ Checklist Final

Antes de considerar las mejoras como completas, verificar:

- [ ] Test 1: Proyecto carga sin errores
- [ ] Test 2: Detección de inestabilidad funciona
- [ ] Test 3: λₑ aparece correctamente
- [ ] Test 4: Botón "Limpiar Todo" funciona
- [ ] Test 5: Rendimiento mejorado (simulaciones rápidas)
- [ ] Test 6: Comparación múltiple funciona
- [ ] Test 7: Exportaciones funcionan
- [ ] Navegador: DevTools muestra 0 errores rojos
- [ ] Visual: Todos los botones y elementos visibles
- [ ] UX: Flujo intuitivo y sin bloqueos

---

**Si todos los tests pasan:** ✅ Las mejoras están correctamente implementadas.

**Si algún test falla:** Consultar sección Troubleshooting o verificar CHANGELOG.md para detalles de implementación.

---

**Creado:** Noviembre 4, 2025  
**Versión del Proyecto:** BoyaQueue v1.1

