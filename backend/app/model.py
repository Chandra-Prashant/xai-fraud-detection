from pydantic import BaseModel
from typing import List

# This holds the result of a *single* AI model
class ModelResult(BaseModel):
    name: str
    prediction: int
    probability: float

# This is the input data (unchanged)
class TransactionFeatures(BaseModel):
    Time: float
    V1: float
    V2: float
    V3: float
    V4: float
    V5: float
    V6: float
    V7: float
    V8: float
    V9: float
    V10: float
    V11: float
    V12: float
    V13: float
    V14: float
    V15: float
    V16: float
    V17: float
    V18: float
    V19: float
    V20: float
    V21: float
    V22: float
    V23: float
    V24: float
    V25: float
    V26: float
    V27: float
    V28: float
    Amount: float

# This is the response for the /predict endpoint
class PredictionResponse(BaseModel):
    final_status: str
    model_results: List[ModelResult]

# --- NEW: These are the models for the /explain endpoint ---
class ExplainFeature(BaseModel):
    feature: str
    impact: float

class ExplainResponse(BaseModel):
    base_value: float
    top_features: List[ExplainFeature]