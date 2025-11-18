# **🧠 Explainable AI (XAI) Fraud Detection System**

[🌐 Live Demo](https://xai-fraud-detection.vercel.app)!  
[💻 GitHub Repository](https://github.com/Chandra-Prashant/xai-fraud-detection)!

A full-stack, production-ready AI platform that detects credit card fraud in real-time and explains **why** a transaction was flagged.  
It solves the "Black Box" problem in AI by integrating **SHAP (SHapley Additive exPlanations)** to provide transparent, feature-level insights for every prediction.

---

## **🚀 Project Overview & Vision**

Traditional fraud detection systems flag transactions but fail to provide context, leading to mistrust and slow manual reviews.  
This project builds a bridge between high-accuracy AI and human interpretability. It utilizes a **microservices architecture** to decouple the heavy inference engine (Dockerized FastAPI) from the user interface, ensuring scalability and clear separation of concerns.

---

## **🏗️ 1. Technical Architecture & Deployment Strategy**

### **📁 Monorepo Structure**

```bash
fraud-detection-system/
├── ai-model/        # 🧠 Data Science (EDA, Training, Serialization)
├── backend/         # ⚙️ FastAPI Inference Engine (Dockerized)
└── frontend/        # 🖥️ Next.js Client (Dashboard & Visualization)
```
☁️ Poly-Host Deployment

| Service | Stack | Deployment Host | Purpose |
| :---- | :---- | :---- | :---- |
| **Frontend** | Next.js 14 (TypeScript), Tailwind	| **Vercel** |	Dashboard UI and visualization of SHAP values |
| **AI Backend** |	FastAPI, Python 3.10, Uvicorn |	**Render** |	Runs ML inference, SHAP calculations, and serves API |
|**Web Service** | Docker |	Docker Hub |	Ensures consistent runtime environment for ML libraries |

**Inter-Service Communication**

*Strict Typing: Frontend and Backend share strict interfaces via Pydantic (Backend) and TypeScript Interfaces (Frontend).

*Latency Management: Optimized Docker container to load large .joblib models into memory only once at startup.

### ⚙️ 2. Deep Dive: Advanced Feature Implementation
🤖 A. AI & Explainability (XAI)

Feature	Model / Technique	Technical Implementation
Multi-Model Inference	Random Forest vs. MLP Neural Network	The system runs two models in parallel. Random Forest is used for the primary decision due to better interpretability, while the Neural Network acts as a challenger model.
Explainability Engine	SHAP (SHapley Additive exPlanations)	On demand (/explain), the backend calculates the marginal contribution of features (Time, Amount, V1-V28) to the fraud score, visualized as a force plot on the UI.
Data Consistency	Persisted StandardScaler	To prevent Training-Serving Skew, the exact scaler fitted during training is serialized (scaler.joblib) and loaded into the Docker container for production inference.
🛡️ B. Engineering & DevOps

Logic Area	Functionality	Technical Detail
Input Validation	Type Safety & Error Handling	Pydantic models strictly validate incoming JSON payloads. Invalid transaction data is rejected with 422 Unprocessable Entity errors before reaching the model.
Containerization	Reproducibility	A multi-stage Docker build installs system dependencies (gcc, g++) required for scikit-learn and numpy, creating a lightweight production image.
Performance	Asynchronous Inference	FastAPI's async def endpoints allow non-blocking handling of prediction requests, suitable for high-concurrency scenarios.
### 💻 3. Technology Stack Breakdown
Category	Technologies
Frontend	Next.js 14, TypeScript, Tailwind CSS, Lucide React, Recharts
Backend (AI)	Python 3.10, FastAPI, Uvicorn, Pydantic, Joblib
Data Science	Scikit-learn, Pandas, NumPy, SHAP, Matplotlib, Jupyter
DevOps & Deployment	Docker, Render (Backend), Vercel (Frontend), GitHub Actions
### 🌟 4. Key Highlights & Impact
🔍 Transparency First: Unlike standard classifiers, this system tells the user why a transaction is 85% likely to be fraud.

⚡ Production-Grade: Includes proper serialization pipelines to ensure the model behaves exactly the same in production as it did in the notebook.

🐳 Dockerized: Solves the "it works on my machine" problem by containerizing the complex Python dependency tree.

🎨 Modern UI: A clean, responsive dashboard built with the latest Next.js App Router patterns.

### 🧭 5. Future Roadmap

* \[ \] Add LSTM / RNN Models for sequence-based fraud detection.
* \[ \] Implement Real-time Streaming using Apache Kafka.
* \[ \] Add User Authentication (OAuth2) for the dashboard.
* \[ \] Public API Documentation (Swagger/Redoc) integration.
* \[ \] Deploy model monitoring (Drift Detection).

## **👨‍💻 Author**

Prashant Chandra    
B.Tech CSE | Aspiring AI-Powered Full Stack Developer    
📍 Focus Areas: Full Stack Development, Machine Learning, Generative AI    
[🔗 Live Demo](https://xai-fraud-detection.vercel.app)\! • [GitHub](https://github.com/Chandra-Prashant/xai-fraud-detection)\!

### **⭐ If you like this project, consider giving it a star on [GitHub](https://github.com/Chandra-Prashant/xai-fraud-detection)\!**
