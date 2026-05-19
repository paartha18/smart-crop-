import { CropInput, PredictionResult } from "../types";
import { CROP_DATASET } from "../data/crops";
import { GoogleGenAI } from "@google/genai";

export class RecommendationService {
  static calculateScores(input: CropInput) {
    const filtered = CROP_DATASET.filter(c => c.category === input.category);
    const scores = filtered.map(crop => {
      const soilTypeScore = crop.idealSoil.includes(input.soilType) ? 100 : 0;
      const nMatch = this.isInRange(input.nitrogen, crop.idealN) ? 100 : 50;
      const pMatch = this.isInRange(input.phosphorus, crop.idealP) ? 100 : 50;
      const kMatch = this.isInRange(input.potassium, crop.idealK) ? 100 : 50;
      const phMatch = this.isInRange(input.ph, crop.idealPh) ? 100 : 50;
      const soilFinal = (soilTypeScore * 0.4) + (((nMatch + pMatch + kMatch + phMatch) / 4) * 0.6);
      const tempMatch = this.isInRange(input.temperature, crop.idealTemp) ? 100 : 50;
      const humMatch = this.isInRange(input.humidity, crop.idealHumidity) ? 100 : 50;
      const rainMatch = this.isInRange(input.rainfall, crop.idealRainfall) ? 100 : 50;
      const climateFinal = (tempMatch + humMatch + rainMatch) / 3;
      const waterMatch = input.waterAvailability === crop.waterRequirement ? 100 : 50;
      const durationMatch = this.checkDurationMatch(input.duration, crop.growthDuration) ? 100 : 50;
      const totalScore = (soilFinal * 0.4) + (climateFinal * 0.25) + (waterMatch * 0.2) + (durationMatch * 0.15);
      return {
        name: crop.name, score: Math.round(totalScore), cropData: crop,
        explainability: {
          phMatch: phMatch === 100, tempMatch: tempMatch === 100,
          rainfallMatch: rainMatch === 100, npkMatch: (nMatch + pMatch + kMatch) / 3 === 100
        }
      };
    });
    return scores.sort((a, b) => b.score - a.score);
  }

  static generateRisks(input: CropInput, cropName: string): string[] {
    const risks: string[] = [];
    if (input.rainfall > 1000) risks.push("High rainfall risk — ensure proper field drainage to prevent waterlogging.");
    if (input.humidity > 80) risks.push(`High humidity (${input.humidity}%) increases risk of fungal diseases. Apply preventive fungicide.`);
    if (input.ph < 6.0) risks.push(`Low soil pH (${input.ph}) — apply agricultural lime to raise pH before sowing.`);
    if (input.ph > 7.5) risks.push(`High soil pH (${input.ph}) — apply sulfur or acidifying fertilizers to lower pH.`);
    if (input.nitrogen > 150) risks.push("Excess nitrogen may cause vegetative overgrowth and reduce yield quality.");
    if (input.temperature > 35) risks.push(`High temperature (${input.temperature}°C) may cause heat stress — consider shade nets or mulching.`);
    if (input.temperature < 15) risks.push(`Low temperature (${input.temperature}°C) may slow germination — use plastic mulch to retain soil warmth.`);
    if (!input.irrigation && input.waterAvailability === 'Low') risks.push("No irrigation + low water availability — consider drought-tolerant varieties.");
    if (input.moisture > 80) risks.push("Very high soil moisture — risk of root rot. Improve drainage before planting.");
    if (risks.length === 0) risks.push("Conditions look favorable. Monitor regularly for pests and diseases.");
    return risks;
  }

  static async getAIReasoning(bestCropName: string, input: CropInput): Promise<string> {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return "The crop is highly suitable for your soil and climate conditions.";
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `As an agricultural expert, explain why ${bestCropName} is the best ${input.category === 'Trees' ? 'tree' : 'crop'} for these conditions:
      Soil: ${input.soilType}, NPK: ${input.nitrogen}-${input.phosphorus}-${input.potassium}, pH: ${input.ph}
      Climate: Temp ${input.temperature}°C, Humidity ${input.humidity}%, Rainfall ${input.rainfall}mm, Water: ${input.waterAvailability}.
      Keep it simple, farmer-friendly, and concise (max 2 sentences).`;
      const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
      return response.text || "Highly recommended based on your specific environmental profile.";
    } catch (e) {
      return "Highly recommended based on your specific environmental profile.";
    }
  }

  private static isInRange(val: number, range: [number, number]): boolean {
    return val >= range[0] && val <= range[1];
  }

  private static checkDurationMatch(target: string, actual: number): boolean {
    if (target === 'Short') return actual < 120;
    if (target === 'Medium') return actual >= 120 && actual < 200;
    if (target === 'Long') return actual >= 200;
    return false;
  }
}
