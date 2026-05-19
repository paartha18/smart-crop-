import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { RecommendationService } from "./src/services/recommendationService.js";
import { CropInput, PredictionResult } from "./src/types.js";

async function startServer() {
  const app = express();
  const PORT = 3000;
  app.use(express.json());

  app.post("/api/recommend", async (req, res) => {
    try {
      const input: CropInput = req.body;
      const scores = RecommendationService.calculateScores(input);
      const best = scores[0];
      const alternatives = scores.slice(1, 4).map(s => ({ name: s.name, score: s.score }));
      const reason = await RecommendationService.getAIReasoning(best.name, input);
      const risks = RecommendationService.generateRisks(input, best.name);

      const result: PredictionResult = {
        bestCrop: best.name,
        category: best.cropData.category,
        suitabilityScore: best.score,
        growthDuration: best.cropData.growthDuration,
        waterRequirement: best.cropData.waterRequirement,
        fertilizerSuggestion: best.cropData.fertilizer,
        reason,
        bestPlantingMonths: best.cropData.bestPlantingMonths,
        harvestMonths: best.cropData.harvestMonths,
        yieldPerAcre: best.cropData.yieldPerAcre,
        marketPricePerKg: best.cropData.marketPricePerKg,
        growingSteps: best.cropData.growingSteps,
        risks,
        alternatives,
        explainability: best.explainability
      };

      res.json(result);
    } catch (error) {
      console.error("Recommendation API Error:", error);
      res.status(500).json({ error: "Failed to generate recommendation. Please try again later." });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://localhost:${PORT}`));
}

startServer();
