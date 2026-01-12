# tests/test_predict.py
import json
from app import app

def test_predict_list_features():
    client = app.test_client()
    payload = {"features": [20000, 1, 2, 2, 30]}
    resp = client.post("/predict", data=json.dumps(payload), content_type="application/json")
    assert resp.status_code == 200
    data = resp.get_json()
    assert "default_prediction" in data
    assert "probability" in data

def test_predict_named_features():
    client = app.test_client()
    payload = {"features": {"limitBal": 5000, "age": 35}}
    resp = client.post("/predict", data=json.dumps(payload), content_type="application/json")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["default_prediction"] in (0,1)
