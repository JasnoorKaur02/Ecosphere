export interface BuildingData {
  timestamp: string;
  energy: number; // kWh
  water: number; // Liters
  waste: number; // kg
  carbon: number; // kg CO2
  occupancy: number; // %
  temperature: number; // Celsius
}

export interface OptimizationResult {
  type: 'energy' | 'water' | 'waste' | 'carbon';
  title: string;
  description: string;
  impact: number; // percentage improvement
  action: string;
}

export interface ForecastData {
  timestamp: string;
  predicted: number;
  baseline: number;
}

export type BuildingType = 'Campus' | 'Office' | 'Residential' | 'Hospital';
