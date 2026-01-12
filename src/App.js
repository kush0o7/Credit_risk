// src/App.js
import React, { useState } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
  Card,
  Collapse,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import "./App.css";
import "./index.css";

const DEMO_DATA = {
  limitBal: 20000,
  sex: 1,
  education: 2,
  marriage: 2,
  age: 30,
  pay0: 0,
  pay2: 0,
  pay3: 0,
  pay4: 0,
  pay5: 0,
  pay6: 0,
  billAmt1: 5000,
  billAmt2: 4800,
  billAmt3: 4500,
  billAmt4: 4300,
  billAmt5: 4200,
  billAmt6: 4000,
  payAmt1: 2000,
  payAmt2: 1500,
  payAmt3: 1200,
  payAmt4: 1000,
  payAmt5: 1000,
  payAmt6: 1000,
};

function clampNumber(n) {
  const x = Number(n);
  return Number.isFinite(x) ? x : 0;
}

function severityFromProb(p) {
  if (p >= 0.7) return { label: "High risk", color: "var(--danger)" };
  if (p >= 0.4) return { label: "Medium risk", color: "#f59e0b" };
  return { label: "Low risk", color: "var(--success)" };
}

const initialFormState = {
  limitBal: "",
  sex: "1",
  education: "2",
  marriage: "2",
  age: "",
  pay0: "",
  pay2: "",
  pay3: "",
  pay4: "",
  pay5: "",
  pay6: "",
  billAmt1: "",
  billAmt2: "",
  billAmt3: "",
  billAmt4: "",
  billAmt5: "",
  billAmt6: "",
  payAmt1: "",
  payAmt2: "",
  payAmt3: "",
  payAmt4: "",
  payAmt5: "",
  payAmt6: "",
};

export default function App() {
  const [formData, setFormData] = useState({ ...initialFormState });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openAdvanced, setOpenAdvanced] = useState(false);

  const apiBase = process.env.REACT_APP_API_URL || "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const fillDemo = () => {
    setFormData(DEMO_DATA);
    setPrediction(null);
    setError(null);
    setOpenAdvanced(false);
  };

  const clearForm = () => {
    setFormData({ ...initialFormState });
    setPrediction(null);
    setError(null);
  };

  const buildFeatures = (data) => {
    const ordered = [
      data.limitBal,
      data.sex,
      data.education,
      data.marriage,
      data.age,

      data.pay0,
      data.pay2,
      data.pay3,
      data.pay4,
      data.pay5,
      data.pay6,

      data.billAmt1,
      data.billAmt2,
      data.billAmt3,
      data.billAmt4,
      data.billAmt5,
      data.billAmt6,

      data.payAmt1,
      data.payAmt2,
      data.payAmt3,
      data.payAmt4,
      data.payAmt5,
      data.payAmt6,
    ];

    return ordered.map((x) => clampNumber(x));
  };

  const validateRequired = () => {
    const required = ["limitBal", "sex", "education", "marriage", "age"];
    for (const k of required) {
      if (formData[k] === "" || formData[k] === null || formData[k] === undefined) {
        const nice = {
          limitBal: "Credit limit",
          sex: "Gender",
          education: "Education",
          marriage: "Marital status",
          age: "Age",
        };
        return `Please fill "${nice[k] || k}"`;
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPrediction(null);

    const vError = validateRequired();
    if (vError) {
      setError(vError);
      return;
    }

    setLoading(true);
    const features = buildFeatures(formData);
    try {
      const response = await axios.post(`${apiBase}/predict`, { features }, { timeout: 8000 });
      const data = response.data || {};
      const default_prediction = data.default_prediction !== undefined ? data.default_prediction : null;
      const prob = data.probability !== undefined ? Number(data.probability) : null;
      const explanation = data.explanation || data.message || data.notes || null;
      const modelVersion = data.model_version || data.model || null;

      setPrediction({
        default: default_prediction,
        prob,
        explanation,
        modelVersion,
      });

      // open advanced UI if the model returned feature-level info? (example)
      if (data.feature_importance) setOpenAdvanced(true);
    } catch (err) {
      console.error(err);
      const serverMsg = err?.response?.data?.error || err?.message || "Prediction failed";
      setError(
        `Prediction failed. Confirm backend at ${apiBase || "http://127.0.0.1:5000"}/predict. ${serverMsg}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="app-container" fluid>
      <div className="ui-wrapper" style={{ maxWidth: 1100, margin: "0 auto" }}>
        <header className="app-header" style={{ marginBottom: 28 }}>
          <h1 style={{ fontWeight: 700, letterSpacing: "0.01em" }}>Credit Risk — Predictive Demo</h1>
          <p className="muted" style={{ marginTop: 6 }}>
            Enter features or use demo data. Use the advanced fields to tune inputs.
          </p>
        </header>

        <Card style={{ background: "transparent", border: "none", marginBottom: 18 }}>
          <Card.Body style={{ padding: 0 }}>
            <Form onSubmit={handleSubmit}>
              <Row className="g-4">
                <Col md={6}>
                  <Form.Group controlId="limitBal">
                    <Form.Label className="form-label">Credit limit</Form.Label>
                    <InputGroup>
                      <InputGroup.Text style={{ background: "rgba(255,255,255,0.02)", border: "none", color: "var(--muted)" }}>
                        $
                      </InputGroup.Text>
                      <FormControl
                        name="limitBal"
                        type="number"
                        placeholder="e.g. 20000"
                        value={formData.limitBal}
                        onChange={handleChange}
                        className="large-input"
                      />
                    </InputGroup>
                    <div className="muted small-note">Total credit limit (numeric). Lower limits typically increase risk.</div>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="sex">
                    <Form.Label className="form-label">Gender</Form.Label>
                    <Form.Select name="sex" value={formData.sex} onChange={handleChange} className="large-input">
                      <option value="1">1 — Male</option>
                      <option value="2">2 — Female</option>
                      <option value="3">3 — Other / Prefer not to say</option>
                    </Form.Select>
                    <div className="muted small-note">SEX encoding (1=Male, 2=Female).</div>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="education">
                    <Form.Label className="form-label">Education</Form.Label>
                    <Form.Select name="education" value={formData.education} onChange={handleChange} className="large-input">
                      <option value="1">1 — Grad</option>
                      <option value="2">2 — University</option>
                      <option value="3">3 — High school</option>
                      <option value="4">4 — Other</option>
                    </Form.Select>
                    <div className="muted small-note">Highest achieved education (categorical).</div>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="marriage">
                    <Form.Label className="form-label">Marital status</Form.Label>
                    <Form.Select name="marriage" value={formData.marriage} onChange={handleChange} className="large-input">
                      <option value="1">1 — Married</option>
                      <option value="2">2 — Single</option>
                      <option value="3">3 — Other</option>
                    </Form.Select>
                    <div className="muted small-note">Marital status (categorical).</div>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="age">
                    <Form.Label className="form-label">Age</Form.Label>
                    <Form.Control
                      name="age"
                      type="number"
                      min="18"
                      max="100"
                      placeholder="e.g. 30"
                      value={formData.age}
                      onChange={handleChange}
                      className="large-input"
                    />
                    <div className="muted small-note">Applicant age (years).</div>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                    <div>
                      <Button type="submit" variant="primary" className="primary-cta" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : "Predict"}
                      </Button>

                      <Button variant="outline-secondary" onClick={clearForm} className="ms-2">Clear</Button>

                      <Button variant="outline-secondary" onClick={fillDemo} className="ms-2">Use demo data</Button>
                    </div>

                    <div>
                      <Button variant="outline-secondary" size="sm" onClick={() => setOpenAdvanced(s => !s)}>
                        {openAdvanced ? "Hide advanced fields" : "Show advanced fields"}
                      </Button>
                    </div>
                  </div>

                  <Collapse in={openAdvanced}>
                    <div id="advanced-collapse" className="advanced-section" style={{ marginTop: 16 }}>
                      <Row className="g-3">
                        {/* Payment statuses */}
                        <Col md={4}>
                          <Form.Group controlId="pay0">
                            <Form.Label className="form-label">PAY_0 (most recent)</Form.Label>
                            <Form.Control name="pay0" type="number" value={formData.pay0} onChange={handleChange} />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group controlId="pay2">
                            <Form.Label className="form-label">PAY_2</Form.Label>
                            <Form.Control name="pay2" type="number" value={formData.pay2} onChange={handleChange} />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group controlId="pay3">
                            <Form.Label className="form-label">PAY_3</Form.Label>
                            <Form.Control name="pay3" type="number" value={formData.pay3} onChange={handleChange} />
                          </Form.Group>
                        </Col>

                        <Col md={4}>
                          <Form.Group controlId="pay4">
                            <Form.Label className="form-label">PAY_4</Form.Label>
                            <Form.Control name="pay4" type="number" value={formData.pay4} onChange={handleChange} />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group controlId="pay5">
                            <Form.Label className="form-label">PAY_5</Form.Label>
                            <Form.Control name="pay5" type="number" value={formData.pay5} onChange={handleChange} />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group controlId="pay6">
                            <Form.Label className="form-label">PAY_6</Form.Label>
                            <Form.Control name="pay6" type="number" value={formData.pay6} onChange={handleChange} />
                          </Form.Group>
                        </Col>

                        {/* Bill amounts */}
                        <Col md={6}>
                          <Form.Group controlId="billAmt1">
                            <Form.Label className="form-label">Bill amount (most recent)</Form.Label>
                            <Form.Control name="billAmt1" type="number" value={formData.billAmt1} onChange={handleChange} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId="billAmt2">
                            <Form.Label className="form-label">Bill amount (previous)</Form.Label>
                            <Form.Control name="billAmt2" type="number" value={formData.billAmt2} onChange={handleChange} />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group controlId="billAmt3">
                            <Form.Label className="form-label">Bill amount (3)</Form.Label>
                            <Form.Control name="billAmt3" type="number" value={formData.billAmt3} onChange={handleChange} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId="billAmt4">
                            <Form.Label className="form-label">Bill amount (4)</Form.Label>
                            <Form.Control name="billAmt4" type="number" value={formData.billAmt4} onChange={handleChange} />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group controlId="billAmt5">
                            <Form.Label className="form-label">Bill amount (5)</Form.Label>
                            <Form.Control name="billAmt5" type="number" value={formData.billAmt5} onChange={handleChange} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId="billAmt6">
                            <Form.Label className="form-label">Bill amount (6)</Form.Label>
                            <Form.Control name="billAmt6" type="number" value={formData.billAmt6} onChange={handleChange} />
                          </Form.Group>
                        </Col>

                        {/* Payment amounts */}
                        <Col md={6}>
                          <Form.Group controlId="payAmt1">
                            <Form.Label className="form-label">Payment amount (most recent)</Form.Label>
                            <Form.Control name="payAmt1" type="number" value={formData.payAmt1} onChange={handleChange} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId="payAmt2">
                            <Form.Label className="form-label">Payment amount (previous)</Form.Label>
                            <Form.Control name="payAmt2" type="number" value={formData.payAmt2} onChange={handleChange} />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group controlId="payAmt3">
                            <Form.Label className="form-label">Payment amount (3)</Form.Label>
                            <Form.Control name="payAmt3" type="number" value={formData.payAmt3} onChange={handleChange} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId="payAmt4">
                            <Form.Label className="form-label">Payment amount (4)</Form.Label>
                            <Form.Control name="payAmt4" type="number" value={formData.payAmt4} onChange={handleChange} />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group controlId="payAmt5">
                            <Form.Label className="form-label">Payment amount (5)</Form.Label>
                            <Form.Control name="payAmt5" type="number" value={formData.payAmt5} onChange={handleChange} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId="payAmt6">
                            <Form.Label className="form-label">Payment amount (6)</Form.Label>
                            <Form.Control name="payAmt6" type="number" value={formData.payAmt6} onChange={handleChange} />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  </Collapse>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        <div className="result-area" style={{ marginTop: 18 }}>
          {error && <Alert variant="danger">{error}</Alert>}

          {prediction && (
            <Card className="result-card">
              <Card.Body>
                <div className="result-top" style={{ alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0 }}>
                      Result: <span style={{ fontWeight: 700 }}>{prediction.default === 1 ? "Default" : "No Default"}</span>
                    </h3>
                    <div className="muted" style={{ marginTop: 6 }}>Model probability (if provided)</div>
                    {prediction.explanation && <div className="explain" style={{ marginTop: 10 }}><strong>Notes:</strong> {prediction.explanation}</div>}
                    {prediction.modelVersion && <div className="muted" style={{ marginTop: 10 }}><strong>Model:</strong> {prediction.modelVersion}</div>}
                  </div>

                  <div style={{ marginLeft: 18, textAlign: "right" }}>
                    {prediction.prob !== null && prediction.prob !== undefined ? (
                      <>
                        <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--accent)" }}>
                          {Math.round((prediction.prob || 0) * 100)}%
                        </div>
                        <div className="muted" style={{ fontSize: 13 }}>confidence</div>
                        <div
                          className="severity"
                          style={{
                            marginTop: 12,
                            background: severityFromProb(prediction.prob).color,
                            color: "#fff",
                          }}
                        >
                          {severityFromProb(prediction.prob).label}
                        </div>
                      </>
                    ) : (
                      <div className="muted">No probability returned</div>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}
        </div>
      </div>
    </Container>
  );
}
