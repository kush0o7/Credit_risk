# app.py
import os
import logging
from typing import Any, Dict, List, Optional

from flask import Flask, request, jsonify
from flask_cors import CORS
from pydantic import BaseModel, ValidationError

# logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("credit_risk_api")

# env config
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 5000))
DEBUG = os.getenv("DEBUG", "false").lower() == "true"
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")
MODEL_PATH = os.getenv("MODEL_PATH", "")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": CORS_ORIGINS}})


class PredictRequest(BaseModel):
    # Accept either a list (ordered features) or a dict of named features
    features: Optional[Any] = None


def try_float(v) -> Optional[float]:
    try:
        return float(v)
    except Exception:
        return None


def compute_severity(probability: float) -> str:
    if probability >= 0.75:
        return "High"
    if probability >= 0.25:
        return "Medium"
    return "Low"


# model loader stub - use joblib if you have a real model
MODEL = None
MODEL_VERSION = None


@app.before_request
def log_request_info():
    logger.info("%s %s - remote:%s", request.method, request.path, request.remote_addr)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model_loaded": MODEL is not None}), 200


@app.route("/metadata", methods=["GET"])
def metadata():
    return jsonify({
        "service": "credit-risk-demo",
        "model_loaded": MODEL is not None,
        "model_version": MODEL_VERSION
    })


@app.route("/predict", methods=["POST"])
def predict():
    try:
        payload = request.get_json(force=False, silent=True) or {}
        logger.debug("payload: %s", payload)
        # validate with pydantic
        req = PredictRequest(**payload)
    except ValidationError as ve:
        logger.warning("validation error: %s", ve.json())
        return jsonify({"error": "Invalid request", "details": ve.errors()}), 400

    features = req.features

    # Accept either list or dict; if missing -> error
    if features is None:
        return jsonify({"error": "No features provided"}), 400

    # If real model loaded, we'd call it here. For now, use robust mock logic:
    # If dict, try named keys; if list, take first element as credit limit
    credit_limit = None
    if isinstance(features, dict):
        # common names: limitBal, limit, credit_limit
        candidates = ["limitBal", "limit", "credit_limit", "limit_bal"]
        for k in candidates:
            if k in features:
                credit_limit = try_float(features.get(k))
                break
    elif isinstance(features, list):
        if len(features) == 0:
            return jsonify({"error": "Empty features list"}), 400
        credit_limit = try_float(features[0])
    else:
        return jsonify({"error": "Invalid 'features' type (expect list or object)"}), 400

    # Mock prediction rule: low credit limit -> higher default prob
    if credit_limit is None:
        # if credit limit not parseable, return neutral
        default_prediction = 0
        probability = 0.12
    else:
        default_prediction = 1 if credit_limit < 10000 else 0
        probability = 0.65 if default_prediction == 1 else 0.05

    severity = compute_severity(probability)
    confidence = 0.82 if default_prediction == 1 else 0.92

    response = {
        "default_prediction": int(default_prediction),
        "probability": round(float(probability), 4),
        "confidence": round(float(confidence), 4),
        "severity": severity,
        "model_version": MODEL_VERSION or "mock-v0",
        "notes": "mock prediction (dev-only). Replace MODEL with real artifact for production."
    }

    logger.info("predict -> %s", {k: response[k] for k in ("default_prediction", "probability", "severity")})
    return jsonify(response), 200


if __name__ == "__main__":
    logger.info(f"Starting app (debug={DEBUG}) on {HOST}:{PORT}")
    app.run(host=HOST, port=PORT, debug=DEBUG)
