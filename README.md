# Credit Risk Prediction — Full-Stack ML Demo

A full-stack credit risk assessment web application that demonstrates end-to-end
feature engineering, model inference, and risk visualization using a modern
React + Flask architecture.

This project focuses on **system design, feature richness, and UX clarity**
for financial risk modeling rather than only raw model accuracy.

---

## 🚀 Features

- Clean, modern React UI with collapsible advanced financial inputs
- REST API for live credit risk inference
- Probability-based risk scoring with severity buckets (Low / Medium / High)
- Supports rich financial features:
  - Credit limits
  - Payment history (PAY\_0 – PAY\_6)
  - Bill amounts & payment amounts
- Demo data for instant testing
- Easily extensible to plug in a production ML model

---

## 🧠 Model & Approach

> **Current implementation uses a mock inference layer** to demonstrate
end-to-end system design and feature flow.

The architecture is intentionally designed so that a trained model
(e.g. Logistic Regression, Random Forest, XGBoost) can be plugged in
without modifying the frontend.

**Typical production setup would include:**
- Model trained on historical credit data (e.g. UCI Credit Default dataset)
- Probability calibration (Platt scaling / isotonic regression)
- Evaluation using ROC-AUC, recall at fixed FPR, and calibration curves

---

## 🏗 Architecture


- Frontend handles input validation and UX
- Backend validates requests and performs inference
- Responses return probability, risk severity, and metadata

---

## 🖥 Tech Stack

**Frontend**
- React
- React-Bootstrap
- CSS (custom dark fintech theme)

**Backend**
- Flask
- REST APIs
- JSON-based inference contract

**ML / Data**
- Scikit-learn (model-ready interface)
- Feature engineering pipeline

---

## ▶️ Running Locally

### Backend
```bash
pip install -r requirements.txt
python app.py

### Backend
npm install
npm start


Runs at: http://localhost:3000