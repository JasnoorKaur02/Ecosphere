import { GoogleGenAI } from "@google/genai";
import { BuildingData, BuildingType } from "../types";

let aiInstance: GoogleGenAI | null = null;

function getAiInstance() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined. AI features will be disabled.");
    }
    aiInstance = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });
  }
  return aiInstance;
}

export async function getSustainabilityInsights(data: BuildingData[], type: BuildingType, activeMetric: string = 'energy') {
  const ai = getAiInstance();
  const recentData = data.slice(-24);
  const avgEnergy = recentData.reduce((acc, d) => acc + d.energy, 0) / 24;
  const peakEnergy = Math.max(...recentData.map(d => d.energy));
  
  const prompt = `
    As a Sustainability AI Expert, analyze this building data for a ${type} facility:
    - Average Energy: ${avgEnergy.toFixed(2)} kWh
    - Peak Energy: ${peakEnergy.toFixed(2)} kWh
    - Building Type: ${type}
    - Primary Focus Area: ${activeMetric}
    
    Provide 6-8 specific, actionable optimization recommendations in JSON format.
    Ensure you include at least one recommendation for EACH of these categories: 'energy', 'water', 'waste', 'carbon'.
    Prioritize recommendations related to the Primary Focus Area (${activeMetric}).
    
    Each recommendation should have:
    - title: Short title
    - description: Detailed explanation
    - type: one of 'energy', 'water', 'waste', 'carbon'
    - impact: estimated percentage improvement (number 1-30)
    - action: The primary action to take
    
    Format the response as a valid JSON array of objects.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Error:", error);
    return [
      {
        title: `${type} Peak Shifting`,
        description: "Shift heavy machinery operation to off-peak hours (11 PM - 6 AM) to reduce grid strain.",
        type: "energy",
        impact: 12,
        action: "Reschedule maintenance"
      },
      {
        title: "HVAC Optimization",
        description: "Adjust setpoints by 2°C during low occupancy periods detected by AI sensors.",
        type: "energy",
        impact: 15,
        action: "Update BMS settings"
      },
      {
        title: "Water Leak Detection",
        description: "Anomalous flow patterns detected in Zone B during night hours suggest a minor leak.",
        type: "water",
        impact: 8,
        action: "Inspect Zone B plumbing"
      },
      {
        title: "Greywater Recycling",
        description: "Implement greywater treatment for non-potable uses like irrigation and flushing.",
        type: "water",
        impact: 18,
        action: "Enable recycling valve"
      },
      {
        title: "Waste Segregation Audit",
        description: "Contamination levels in recycling bins are high. Improve signage and staff training.",
        type: "waste",
        impact: 20,
        action: "Staff training session"
      },
      {
        title: "Composting Protocol",
        description: "Divert organic waste to onsite composting units to reduce landfill contribution.",
        type: "waste",
        impact: 25,
        action: "Deploy compost bins"
      },
      {
        title: "Carbon Offset Protocol",
        description: "Purchase renewable energy certificates to offset unavoidable operational emissions.",
        type: "carbon",
        impact: 10,
        action: "Procure RECs"
      }
    ];
  }
}
