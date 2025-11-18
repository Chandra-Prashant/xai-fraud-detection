// This defines the "shape" of the data we need to send (unchanged)
export interface TransactionPayload {
  Time: number;
  V1: number;
  V2: number;
  V3: number;
  V4: number;
  V5: number;
  V6: number;
  V7: number;
  V8: number;
  V9: number;
  V10: number;
  V11: number;
  V12: number;
  V13: number;
  V14: number;
  V15: number;
  V16: number;
  V17: number;
  V18: number;
  V19: number;
  V20: number;
  V21: number;
  V22: number;
  V23: number;
  V24: number;
  V25: number;
  V26: number;
  V27: number;
  V28: number;
  Amount: number;
}

// Defines the shape of a single model's result
export interface ModelResult {
  name: string;
  prediction: number;
  probability: number;
}

// This is the response shape from the /predict endpoint
export interface PredictionResponse {
  final_status: string;
  model_results: ModelResult[];
}

// These are the types for the /explain endpoint
export interface ExplainFeature {
  feature: string;
  impact: number;
}

export interface ExplainResponse {
  base_value: number;
  top_features: ExplainFeature[];
}

// --- THIS IS THE CRITICAL CHANGE ---
// It uses the Vercel "Environment Variable" first,
// but falls back to your local server if that's not found.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
// --- END OF CHANGE ---

/**
 * Calls the /predict endpoint of your FastAPI.
 */
export async function getFraudPrediction(
  payload: TransactionPayload
): Promise<PredictionResponse> {
  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || `HTTP error! status: ${response.status}`);
    }

    const data: PredictionResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch prediction:", error);
    throw error;
  }
}

/**
 * Calls the /explain endpoint of your FastAPI.
 */
export async function getExplanation(
  payload: TransactionPayload
): Promise<ExplainResponse> {
  try {
    const response = await fetch(`${API_URL}/explain`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || `HTTP error! status: ${response.status}`);
    }

    const data: ExplainResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch explanation:", error);
    throw error;
  }
}