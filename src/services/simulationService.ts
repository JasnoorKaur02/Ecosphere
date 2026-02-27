import { BuildingData, BuildingType } from '../types';

export const generateBuildingData = (type: BuildingType, hours: number = 24): BuildingData[] => {
  const data: BuildingData[] = [];
  const now = new Date();
  
  const baseValues = {
    Campus: { energy: 500, water: 1000, waste: 200, carbon: 350 },
    Office: { energy: 300, water: 400, waste: 50, carbon: 200 },
    Residential: { energy: 150, water: 600, waste: 30, carbon: 100 },
    Hospital: { energy: 800, water: 2000, waste: 400, carbon: 600 },
  };

  const base = baseValues[type];

  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = time.getHours();
    
    // Diurnal cycle simulation
    const cycle = Math.sin((hour - 6) * Math.PI / 12) * 0.5 + 0.5;
    const randomness = 0.8 + Math.random() * 0.4;
    
    const energy = base.energy * (0.3 + cycle * 0.7) * randomness;
    const water = base.water * (0.2 + cycle * 0.8) * randomness;
    const waste = base.waste * (0.1 + cycle * 0.9) * randomness;
    const carbon = energy * 0.7; // Simplified carbon factor

    data.push({
      timestamp: time.toISOString(),
      energy: Math.round(energy),
      water: Math.round(water),
      waste: Math.round(waste),
      carbon: Math.round(carbon),
      occupancy: Math.round((0.1 + cycle * 0.9) * 100),
      temperature: 20 + Math.sin((hour - 8) * Math.PI / 12) * 5 + Math.random() * 2,
    });
  }

  return data;
};

export const generateForecast = (currentData: BuildingData[], hours: number = 48): Record<string, any[]> => {
  const metrics = ['energy', 'carbon', 'water', 'waste'];
  const forecasts: Record<string, any[]> = {};
  const lastTime = new Date(currentData[currentData.length - 1].timestamp);
  const lastData = currentData[currentData.length - 1];
  
  metrics.forEach(metric => {
    const metricForecast = [];
    const baseVal = (lastData as any)[metric];

    for (let i = 1; i <= hours; i++) {
      const time = new Date(lastTime.getTime() + i * 60 * 60 * 1000);
      const hour = time.getHours();
      const cycle = Math.sin((hour - 6) * Math.PI / 12) * 0.5 + 0.5;
      
      const baseline = baseVal * (0.6 + cycle * 0.4) * (0.9 + Math.random() * 0.2);
      const predicted = baseline * (0.8 + Math.random() * 0.1);

      metricForecast.push({
        timestamp: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        predicted: Math.round(predicted),
        baseline: Math.round(baseline),
      });
    }
    forecasts[metric] = metricForecast;
  });

  return forecasts;
};
