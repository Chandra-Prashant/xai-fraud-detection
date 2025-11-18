# Explainable AI (XAI) Fraud Detection System

![Python](https://img.shields.io/badge/Python-3.10-blue?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.68-009688?logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

A full-stack, production-ready AI platform that detects credit card fraud in real-time and explains **why** a transaction was flagged using SHAP analysis.

[**🚀 View Live Demo**](https://xai-fraud-detection.vercel.app)

![Project Dashboard](https://placehold.co/1200x600/171717/FFFFFF?text=Project+Screenshot+Here)
*(Note: Replace the image link above with your actual dashboard screenshot)*

---

## 📖 Overview

Traditional AI fraud detection systems are "black boxes"—they flag a transaction but don't tell you why. This creates a lack of trust and makes manual review difficult.

**This project solves that problem.**

It implements **Explainable AI (XAI)** using **SHAP (SHapley Additive exPlanations)** to provide transparency. For every prediction, the system identifies the top contributing factors (e.g., *transaction amount is too high for this time of day*) that led to the decision.

The system utilizes a **microservices architecture**, decoupling the heavy AI inference engine (Dockerized FastAPI) from the modern user interface (Next.js).

---

## ✨ Key Features

* **🧠 Multi-Model Inference**
    * Runs two competing models in parallel for every transaction.
    * **Random Forest Classifier:** Optimized for interpretability and SHAP analysis.
    * **Neural Network (MLPClassifier):** Optimized for complex non-linear pattern recognition.
* **🔍 Explainable AI (XAI)**
    * Features a "Why?" button that hits a dedicated `/explain` endpoint.
    * Visualizes SHAP values to show the top 5 risk factors driving the fraud score.
* **🏭 Production-Grade Pipeline**
    * Data preprocessing with persisted `StandardScaler` objects to prevent training-serving skew.
    * Strict Pydantic validation for all API inputs and outputs.
* **⚡ Modern Tech Stack**
    * **Frontend:** Next.js 14, TypeScript, Tailwind CSS.
    * **Backend:** FastAPI, Uvicorn, Python 3.10.
    * **DevOps:** Docker containerization for the AI backend.

---

## 🛠️ Technical Architecture

The project follows a monorepo structure with a clear separation of concerns between Data Science, API, and UI.

```bash
fraud-detection-system/
├── ai-model/                 # 🧠 Data Science & Training
│   ├── 1_Data_Exploration.ipynb   # EDA and class imbalance analysis
│   ├── 2_Model_Training.ipynb     # Training RF & Neural Network models
│   └── saved_model/               # Serialized .joblib models and scalers
│
├── backend/                  # ⚙️ AI Inference API (FastAPI)
│   ├── app/main.py                # API endpoints (/predict, /explain)
│   ├── Dockerfile                 # Container configuration for Render
│   └── requirements.txt           # Python dependencies
│
└── frontend/                 # 🖥️ User Interface (Next.js)
    ├── app/page.tsx               # Dashboard UI with real-time simulation
    └── lib/api.ts                 # Type-safe API integration
🔧 Setup & Installation
Prerequisites

Node.js (v18+)

Python 3.10+ (Anaconda recommended)

Docker (Optional, for local container testing)

1. Clone the Repository

Bash
git clone [https://github.com/yourusername/fraud-detection-system.git](https://github.com/yourusername/fraud-detection-system.git)
cd fraud-detection-system
2. Local Backend Setup

The backend serves the ML models via FastAPI.

Bash
cd backend

# Create & activate virtual environment (using Conda)
conda create -n fraud_api python=3.10
conda activate fraud_api

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload
The API will be available at http://127.0.0.1:8000. Documentation is available at /docs.

3. Local Frontend Setup

The frontend is a Next.js application.

Bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
The UI will be available at http://localhost:3000.

📊 Data & Models
The models were trained on the Kaggle Credit Card Fraud Detection Dataset, which contains 284,807 transactions.

Challenge: The dataset is highly imbalanced (fraud cases account for only 0.17% of all transactions).

Preprocessing: StandardScaler was applied to Time and Amount features.

Model Strategy:

Random Forest: Achieved high precision/recall balance; used as the primary source for SHAP explanations.

Neural Network: Used as a "challenger" model to validate results.

☁️ Deployment
Service	Component	Description
Render	Backend	Deployed as a Docker container. Ensures heavy ML libraries (scikit-learn, SHAP) are loaded into memory for fast inference.
Vercel	Frontend	Deployed as a serverless Next.js application for global edge delivery.
📬 Contact
Prashant Chandra


### Recommendations for your repo:
1.  **Screenshots:** Actually take a screenshot of your UI and replace the `placehold.co` link.
2.  **Links:** Be sure to update the `[Live Demo]`, `git clone`, and Contact links (LinkedIn/GitHub) with your actual URLs.
3.  **Environment Variables:** If your frontend relies on an ENV variable to find the backend (e.g., `NEXT_PUBLIC_API_URL`), make sure to add a small note in the setup section telling users to create a `.env.local` file.
