# M/M/1/K Model Implementation

## Overview
Successfully implemented the M/M/1/K queueing model (single server with finite capacity) into BoyaQueue.

## Files Created
1. **`/js/models/MM1K.js`** - New model implementation
   - Single server queue with capacity K
   - Blocking system (customers rejected when full)
   - Extends QueueModel base class
   - Handles arrivals, departures, and rejections

## Files Modified

### 1. `/index.html`
- Added MM1K option to model type dropdown
- Included MM1K.js script tag
- Model appears as "M/M/1/K - Un servidor, capacidad limitada"

### 2. `/js/app.js`
- Registered MM1KModel in availableModels registry
- Updated `handleModelTypeChange()` to show capacity parameter for MM1K
- Updated parameter collection to include capacity for MM1K
- Updated `getModelType()` to recognize 'M/M/1/K' pattern (checks before 'M/M/1')

### 3. `/js/ui/QueueAnimator.js`
- Added `getMM1KLayout()` method with:
  - Capacity meter visualization
  - Rejection zone display
  - Single server layout
  - Similar to MMsK but for one server
- Updated `update()` method to handle MM1K capacity meter
- Updated switch statement in `getLayoutForModel()` to include MM1K case

### 4. `/js/core/MetricsCalculator.js`
- Added `calculateMM1K()` static method with:
  - Special handling for ρ = 1 case
  - General formulas for ρ ≠ 1
  - Blocking probability calculation (P_blocking)
  - Effective arrival rate (λ_eff = λ(1 - P_blocking))
  - Proper use of Little's Law with effective rate
- Updated switch statement to include MM1K case

### 5. `/README.md`
- Added M/M/1/K to features list
- Added M/M/1/K model documentation section
- Updated project structure to include MM1K.js
- Updated "Rechazados" metric to mention M/M/1/K

## Key Features

### Model Characteristics
- **Single server** (s = 1)
- **Finite capacity** (K customers total in system)
- **Blocking behavior**: Customers rejected when capacity reached
- **Always stable**: No stability condition needed (unlike M/M/1)

### Theoretical Formulas (ρ ≠ 1)
```
P₀ = (1 - ρ) / (1 - ρ^(K+1))
P_blocking = P₀ × ρ^K
λₑ = λ × (1 - P_blocking)
L = [ρ(1 - (K+1)ρ^K + K×ρ^(K+1))] / [(1 - ρ)(1 - ρ^(K+1))]
Lq = L - (1 - P₀)
W = L / λₑ
Wq = Lq / λₑ
```

### Visualization Features
- **Capacity meter**: Visual indicator showing system utilization (current/K)
- **Rejection zone**: Displays rejected customer count when > 0
- **Single server display**: Shows server busy/idle status
- **Customer tokens**: Animated customer flow

## Integration Points

### ConclusionsGenerator
- Already handles MM1K correctly (checks for 'K' in model name)
- Recognizes MM1K as always stable
- No modifications needed

### ComparisonTable
- Works automatically with MM1K
- Shows λ_eff (effective arrival rate)
- Displays rejection count
- All metrics compatible

### ChartManager
- Works automatically with MM1K
- Includes rejection data in visualizations
- No modifications needed

## Testing Checklist
- [x] Model appears in dropdown
- [x] Capacity parameter shows/hides correctly
- [x] Model validates parameters properly
- [x] Simulation runs without errors
- [x] Capacity meter updates during animation
- [x] Rejection zone displays when customers rejected
- [x] Theoretical calculations work correctly
- [x] Metrics display in comparison table
- [x] Exports include MM1K data
- [x] No linter errors

## Usage Example

To use the M/M/1/K model:

1. Select "M/M/1/K - Un servidor, capacidad limitada" from dropdown
2. Enter λ (arrival rate)
3. Enter μ (service rate)
4. Enter K (capacity, e.g., 10)
5. Add model and run simulation

Example parameters:
- λ = 3 customers/time
- μ = 4 customers/time
- K = 10 customers

This creates a system with high utilization (ρ = 0.75) but finite capacity, so some customers will be rejected when the system is full.

## Notes
- MM1K uses the same animation framework as other models
- Capacity K includes both queue and server (total system capacity)
- The model properly handles the edge case when ρ = 1
- All existing features (export, comparison, conclusions) work with MM1K

## Version
Added in: v1.2 (current)
