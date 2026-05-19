export type SoilType = 'Clay' | 'Sandy' | 'Loamy' | 'Black' | 'Red';
export type WaterAvailability = 'Low' | 'Medium' | 'High';
export type CropDuration = 'Short' | 'Medium' | 'Long';
export type CropCategory = 'Crops' | 'Trees';

export interface CropInput {
  soilType: SoilType;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  moisture: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  waterAvailability: WaterAvailability;
  irrigation: boolean;
  duration: CropDuration;
  category: CropCategory;
}

export interface CropData {
  name: string;
  category: CropCategory;
  idealSoil: SoilType[];
  idealN: [number, number];
  idealP: [number, number];
  idealK: [number, number];
  idealPh: [number, number];
  idealTemp: [number, number];
  idealHumidity: [number, number];
  idealRainfall: [number, number];
  idealMoisture: [number, number];
  waterRequirement: WaterAvailability;
  growthDuration: number;
  fertilizer: string;
  bestPlantingMonths: string[];
  harvestMonths: string[];
  yieldPerAcre: string;
  marketPricePerKg: number;
  growingSteps: string[];
}

export interface PredictionResult {
  bestCrop: string;
  category: CropCategory;
  suitabilityScore: number;
  growthDuration: number;
  waterRequirement: WaterAvailability;
  fertilizerSuggestion: string;
  reason: string;
  bestPlantingMonths: string[];
  harvestMonths: string[];
  yieldPerAcre: string;
  marketPricePerKg: number;
  growingSteps: string[];
  risks: string[];
  alternatives: { name: string; score: number }[];
  explainability: {
    phMatch: boolean;
    tempMatch: boolean;
    rainfallMatch: boolean;
    npkMatch: boolean;
  };
}
