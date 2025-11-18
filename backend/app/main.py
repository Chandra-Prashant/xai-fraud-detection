from fastapi import FastAPI, Depends, HTTPException
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import numpy as np
from typing import List

# Import SHAP
import shap

# Import our Pydantic models
from .model import TransactionFeatures, PredictionResponse, ModelResult, ExplainResponse, ExplainFeature

# --- Define the correct feature order (CRITICAL) ---
FEATURE_ORDER = [
    'Time', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10',
    'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17', 'V18', 'V19', 'V20',
    'V21', 'V22', 'V23', 'V24', 'V25', 'V26', 'V27', 'V28', 'Amount'
]

# This dictionary will hold our models and scalers
model_cache = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Code to run ON STARTUP ---
    print("Loading ML models, scalers, and explainer...")
    try:
        model_cache["amount_scaler"] = joblib.load("saved_model/amount_scaler.joblib")
        model_cache["time_scaler"] = joblib.load("saved_model/time_scaler.joblib")
        
        rf_model = joblib.load("saved_model/fraud_model.joblib")
        model_cache["rf_model"] = rf_model
        model_cache["nn_model"] = joblib.load("saved_model/nn_model.joblib")
        
        print("Loading background data for SHAP...")
        background_data = pd.read_csv("saved_model/background_data.csv")
        
        print("Creating SHAP TreeExplainer...")
        model_cache["explainer"] = shap.TreeExplainer(rf_model, background_data)
        
        print("Successfully loaded 2 models, 2 scalers, and 1 explainer.")
    except FileNotFoundError as e:
        print(f"ERROR: Model or scaler file not found: {e.filename}")
    
    yield 

    # --- Code to run ON SHUTDOWN ---
    print("Clearing model cache...")
    model_cache.clear()

# 1. Create the FastAPI app instance
app = FastAPI(
    title="Explainable AI Fraud API",
    description="An API that runs and *explains* competing AI models for fraud detection.",
    version="3.0.0",
    lifespan=lifespan
)

# 2. Set up CORS middleware (unchanged)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Helper functions (UPDATED)
def get_rf_model():
    return model_cache.get("rf_model")

def get_nn_model():
    return model_cache.get("nn_model")
    
def get_explainer():
    return model_cache.get("explainer")

def get_amount_scaler():
    return model_cache.get("amount_scaler")

def get_time_scaler():
    return model_cache.get("time_scaler")

# --- Helper function to scale and format data ---
def process_features(
    features: TransactionFeatures, 
    amount_scaler, 
    time_scaler
) -> pd.DataFrame:
    raw_features_dict = features.model_dump()
    
    amount_raw = [[raw_features_dict['Amount']]]
    time_raw = [[raw_features_dict['Time']]]
    
    amount_scaled = amount_scaler.transform(amount_raw)[0][0]
    time_scaled = time_scaler.transform(time_raw)[0][0]
    
    scaled_features_dict = raw_features_dict.copy()
    scaled_features_dict['Amount'] = amount_scaled
    scaled_features_dict['Time'] = time_scaled
    
    input_df = pd.DataFrame([scaled_features_dict])
    input_df = input_df[FEATURE_ORDER] 
    return input_df
# ---

# 4. Define the prediction endpoint (unchanged)
@app.post("/predict", response_model=PredictionResponse)
async def predict(
    features: TransactionFeatures, 
    rf_model = Depends(get_rf_model), 
    nn_model = Depends(get_nn_model), 
    amount_scaler = Depends(get_amount_scaler),
    time_scaler = Depends(get_time_scaler)
):
    if not all([rf_model, nn_model, amount_scaler, time_scaler]):
        raise HTTPException(status_code=500, detail="Models or scalers not loaded")

    input_df = process_features(features, amount_scaler, time_scaler)
    
    rf_pred = rf_model.predict(input_df)[0]
    rf_prob = rf_model.predict_proba(input_df)[0][1] 
    
    nn_pred = nn_model.predict(input_df)[0]
    nn_prob = nn_model.predict_proba(input_df)[0][1]

    final_prediction = 1 if (rf_pred == 1 or nn_pred == 1) else 0
    final_status = "Fraud" if final_prediction == 1 else "Legitimate"

    model_results = [
        ModelResult(name="Random Forest", prediction=int(rf_pred), probability=float(rf_prob)),
        ModelResult(name="Neural Network", prediction=int(nn_pred), probability=float(nn_prob))
    ]

    return {
        "final_status": final_status,
        "model_results": model_results
    }

# 5. --- NEW ENDPOINT: EXPLAIN ---
@app.post("/explain", response_model=ExplainResponse)
async def explain(
    features: TransactionFeatures, 
    explainer = Depends(get_explainer), 
    amount_scaler = Depends(get_amount_scaler),
    time_scaler = Depends(get_time_scaler)
):
    if not all([explainer, amount_scaler, time_scaler]):
        raise HTTPException(status_code=500, detail="Explainer or scalers not loaded")

    # 1. Scale and format the data
    input_df = process_features(features, amount_scaler, time_scaler)

    # 2. Get SHAP values
    # shap_values is now a *single array* for Class 1 (Fraud), e.g., shape (1, 30)
    shap_values = explainer.shap_values(input_df)
    
    # --- THIS IS THE FIX ---
    # We get the first (and only) row's explanation
    fraud_shap_values = shap_values[0] 
    # --- END OF FIX ---

    # 3. Format the response
    feature_impacts = [
        ExplainFeature(feature=col, impact=val[1]) 
        for col, val in zip(FEATURE_ORDER, fraud_shap_values)
    ]
    
    top_features = sorted(feature_impacts, key=lambda x: abs(x.impact), reverse=True)

    # Get the base value (average score) for Class 1
    # explainer.expected_value is often [class_0_base, class_1_base]
    base_value = explainer.expected_value
    
    # Handle if expected_value is a list or a single float
    if isinstance(base_value, (list, np.ndarray)):
        # Ensure we're getting the Class 1 base value, which is the second item
        if len(base_value) > 1:
            base_value = base_value[1] 
        else:
            base_value = base_value[0] # Fallback if it only returned one value

    return {
        "base_value": base_value,
        "top_features": top_features[:5] # Return the top 5
    }

# 6. (Optional) Define a root "hello world" endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the Explainable AI Fraud API!"}