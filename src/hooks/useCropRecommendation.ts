import { useState, useCallback } from 'react';
import { CropInput, PredictionResult } from '../types';

/**
 * Custom hook to handle crop recommendation API calls and state.
 */
export function useCropRecommendation() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches the crop recommendation from the backend API.
   */
  const getRecommendation = useCallback(async (input: CropInput) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get recommendation from server.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("API Call Error:", err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Resets the recommendation state.
   */
  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    result,
    loading,
    error,
    getRecommendation,
    reset
  };
}
