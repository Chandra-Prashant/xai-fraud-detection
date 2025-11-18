"use client";

import { useState } from "react";
import {
  getFraudPrediction,
  getExplanation, // <-- NEW
  TransactionPayload,
  PredictionResponse,
  ExplainResponse, // <-- NEW
  ExplainFeature, // <-- NEW
} from "../lib/api";

// --- REAL LEGITIMATE DATA ---
// (This data was extracted from your 2_Model_Training.ipynb notebook)
const defaultLegitData: TransactionPayload = {
  Time: 124312.0,
  V1: -0.793747768560731,
  V2: 0.555658602120352,
  V3: 0.189329973273121,
  V4: -0.0333241031269532,
  V5: 0.435427110197932,
  V6: -0.623996238379435,
  V7: 0.057799513361041,
  V8: 0.356077363483353,
  V9: 0.441369785830113,
  V10: -0.198399583792243,
  V11: -0.134983088037149,
  V12: 0.0463979803366034,
  V13: 0.054329388874134,
  V14: 0.0938450702159187,
  V15: 0.231904121528646,
  V16: 0.021878363717203,
  V17: -0.117497274027572,
  V18: 0.323631988927357,
  V19: -0.233015403063852,
  V20: -0.0963505195393248,
  V21: 0.126866164287968,
  V22: 0.414321775736184,
  V23: -0.063909770116631,
  V24: -0.38760662231268,
  V25: 0.0366364539126207,
  V26: -0.520448043644026,
  V27: 0.0440331613138856,
  V28: 0.0510524177747353,
  Amount: 9.99,
};

// --- REAL FRAUD DATA ---
// (This data was extracted from your 2_Model_Training.ipynb notebook)
const defaultFraudData: TransactionPayload = {
  Time: 12095.0,
  V1: -14.72462692,
  V2: 8.163229641,
  V3: -16.0378175,
  V4: 6.043590526,
  V5: -11.42065853,
  V6: -3.008342443,
  V7: -12.55104278,
  V8: 9.925016016,
  V9: -5.431189479,
  V10: -11.60361734,
  V11: 4.836852724,
  V12: -11.00207068,
  V13: 1.04838641,
  V14: -10.38883627,
  V15: 1.442651821,
  V16: -8.080536125,
  V17: -13.31035402,
  V18: -6.448981519,
  V19: -2.355153283,
  V20: 1.13778396,
  V21: 1.957999742,
  V22: -0.009385903,
  V23: 0.33026702,
  V24: 0.431818258,
  V25: -0.233285743,
  V26: 0.101732488,
  V27: 1.122339832,
  V28: 0.20310248,
  Amount: 1.0,
};

// --- NEW: A helper component to format the explanation ---
function Explanation({ feature }: { feature: ExplainFeature }) {
  const isPositive = feature.impact > 0;
  const impactColor = isPositive ? "text-red-500" : "text-green-500";
  const impactText = isPositive ? "Pushed score HIGHER (more likely fraud)" : "Pushed score LOWER (less likely fraud)";
  
  return (
    <li className="flex justify-between items-center text-sm">
      <span className="font-mono text-gray-700">{feature.feature}</span>
      <div className="text-right">
        <span className={`font-semibold ${impactColor}`}>{feature.impact.toFixed(4)}</span>
        <span className="block text-xs text-gray-500">{impactText}</span>
      </div>
    </li>
  );
}


export default function Home() {
  const [payload, setPayload] = useState(JSON.stringify(defaultLegitData, null, 2));
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // --- NEW: State for the explanation ---
  const [explanation, setExplanation] = useState<ExplainResponse | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setExplanation(null); // <-- NEW: Clear old explanation

    try {
      const parsedPayload: TransactionPayload = JSON.parse(payload);
      const response = await getFraudPrediction(parsedPayload);
      setResult(response);
    } catch (error) {
      console.error(error);
      alert("Error: Invalid JSON or API failed. Check console.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- NEW: Function to handle the "Why?" button click ---
  const handleExplain = async () => {
    setIsExplaining(true);
    setExplanation(null);
    try {
      const parsedPayload: TransactionPayload = JSON.parse(payload);
      const response = await getExplanation(parsedPayload);
      setExplanation(response);
    } catch (error) {
      console.error(error);
      alert("Error: Failed to get explanation. Check console.");
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12 bg-gray-50 text-gray-900">
      <h1 className="text-4xl font-bold mb-2">
        Explainable AI (XAI) Fraud Detection
      </h1>
      <p className="text-lg text-gray-600 mb-8">with Competing AI Models</p>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* --- Column 1: The Form --- */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Transaction Simulator</h2>
          
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setPayload(JSON.stringify(defaultLegitData, null, 2))}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              Load Legitimate Data
            </button>
            <button
              onClick={() => setPayload(JSON.stringify(defaultFraudData, null, 2))}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Load Fraud Data
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="payload" className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Data (JSON):
            </label>
            <textarea
              id="payload"
              rows={20}
              className="w-full p-2 border border-gray-300 rounded-md font-mono text-xs"
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? "Analyzing..." : "Check Transaction"}
            </button>
          </form>
        </div>

        {/* --- Column 2: The Result --- */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Prediction Result</h2>
          {isLoading && <div className="text-blue-600">Loading...</div>}
          
          {!result && !isLoading && (
            <p className="text-gray-500">Submit a transaction to see the result.</p>
          )}

          {result && (
            <div
              className={`p-6 rounded-lg ${
                result.final_status === "Fraud"
                  ? "bg-red-100 border-red-500"
                  : "bg-green-100 border-green-500"
              } border-l-4`}
            >
              <h3 className="text-2xl font-bold mb-4">
                {result.final_status === "Fraud" ? "🚨 ALERT: FRAUD DETECTED 🚨" : "✅ Status: Legitimate"}
              </h3>
              
              <div className="space-y-2">
                {result.model_results.map((modelRes) => (
                  <div key={modelRes.name} className="p-3 bg-gray-50 rounded-md">
                    <p className="font-semibold text-gray-800">{modelRes.name}</p>
                    <p className="text-sm text-gray-600">
                      Prediction: <span className="font-medium">{modelRes.prediction === 1 ? "Fraud" : "Legit"}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Fraud Score: <span className="font-medium">{(modelRes.probability * 100).toFixed(2)}%</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* --- NEW: The "Why?" Button --- */}
              <button
                onClick={handleExplain}
                disabled={isExplaining}
                className="w-full mt-4 px-4 py-2 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-800 disabled:bg-gray-400"
              >
                {isExplaining ? "Explaining..." : "Why? (Explain with SHAP)"}
              </button>
            </div>
          )}

          {/* --- NEW: The Explanation Result --- */}
          {isExplaining && <div className="mt-4 text-blue-600">Loading explanation...</div>}
          {explanation && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h4 className="font-semibold text-lg mb-2">Prediction Explained (Top 5 Factors)</h4>
              <p className="text-xs text-gray-600 mb-3">
                Based on the Random Forest model. Positive numbers push the score towards Fraud.
              </p>
              <ul className="space-y-3">
                {explanation.top_features.map((feature) => (
                  <Explanation key={feature.feature} feature={feature} />
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}