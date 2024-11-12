import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';

function App() {
    const [formData, setFormData] = useState({
        limitBal: '', sex: '', education: '', marriage: '', age: '',
        pay0: '', pay2: '', pay3: '', pay4: '', pay5: '', pay6: '',
        billAmt1: '', billAmt2: '', billAmt3: '', billAmt4: '', billAmt5: '', billAmt6: '',
        payAmt1: '', payAmt2: '', payAmt3: '', payAmt4: '', payAmt5: '', payAmt6: ''
    });
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Convert formData to an array of numbers (feature vector)
        const features = Object.values(formData).map(Number);

        try {
            const response = await axios.post('http://127.0.0.1:5000/predict', { features });
            setPrediction(response.data.default_prediction);
        } catch (error) {
            console.error('Error making prediction', error);
            setError("There was an error making the prediction. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Credit Risk Prediction</h1>
            
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Credit Limit </Form.Label>
                            <Form.Control
                                type="number"
                                name="limitBal"
                                value={formData.limitBal}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Gender (SEX: 1=Male, 2=Female)</Form.Label>
                            <Form.Control
                                type="number"
                                name="sex"
                                value={formData.sex}
                                onChange={handleChange}
                                required
                                min="1"
                                max="2"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Education Level (EDUCATION: 1=Grad School, 2=University, 3=High School, 4=Others)</Form.Label>
                            <Form.Control
                                type="number"
                                name="education"
                                value={formData.education}
                                onChange={handleChange}
                                required
                                min="1"
                                max="4"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Marital Status (MARRIAGE: 1=Married, 2=Single, 3=Others)</Form.Label>
                            <Form.Control
                                type="number"
                                name="marriage"
                                value={formData.marriage}
                                onChange={handleChange}
                                required
                                min="1"
                                max="3"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Age</Form.Label>
                            <Form.Control
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                required
                                min="0"
                            />
                        </Form.Group>
                    </Col>

                    {/* Payment status fields */}
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Payment Status for September (PAY_0)</Form.Label>
                            <Form.Control
                                type="number"
                                name="pay0"
                                value={formData.pay0}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Payment Status for August (PAY_2)</Form.Label>
                            <Form.Control
                                type="number"
                                name="pay2"
                                value={formData.pay2}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Payment Status for July (PAY_3)</Form.Label>
                            <Form.Control
                                type="number"
                                name="pay3"
                                value={formData.pay3}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Payment Status for June (PAY_4)</Form.Label>
                            <Form.Control
                                type="number"
                                name="pay4"
                                value={formData.pay4}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Payment Status for May (PAY_5)</Form.Label>
                            <Form.Control
                                type="number"
                                name="pay5"
                                value={formData.pay5}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Payment Status for April (PAY_6)</Form.Label>
                            <Form.Control
                                type="number"
                                name="pay6"
                                value={formData.pay6}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>

                    {/* Bill amount fields */}
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Bill Amount for September (BILL_AMT1)</Form.Label>
                            <Form.Control
                                type="number"
                                name="billAmt1"
                                value={formData.billAmt1}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Bill Amount for August (BILL_AMT2)</Form.Label>
                            <Form.Control
                                type="number"
                                name="billAmt2"
                                value={formData.billAmt2}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Bill Amount for July (BILL_AMT3)</Form.Label>
                            <Form.Control
                                type="number"
                                name="billAmt3"
                                value={formData.billAmt3}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Bill Amount for June (BILL_AMT4)</Form.Label>
                            <Form.Control
                                type="number"
                                name="billAmt4"
                                value={formData.billAmt4}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Bill Amount for May (BILL_AMT5)</Form.Label>
                            <Form.Control
                                type="number"
                                name="billAmt5"
                                value={formData.billAmt5}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Bill Amount for April (BILL_AMT6)</Form.Label>
                            <Form.Control
                                type="number"
                                name="billAmt6"
                                value={formData.billAmt6}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>

                    {/* Payment amount fields */}
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Payment Amount for September (PAY_AMT1)</Form.Label>
                            <Form.Control
                                type="number"
                                name="payAmt1"
                                value={formData.payAmt1}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Payment Amount for August (PAY_AMT2)</Form.Label>
                            <Form.Control
                                type="number"
                                name="payAmt2"
                                value={formData.payAmt2}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Payment Amount for July (PAY_AMT3)</Form.Label>
                            <Form.Control
                                type="number"
                                name="payAmt3"
                                value={formData.payAmt3}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Payment Amount for June (PAY_AMT4)</Form.Label>
                            <Form.Control
                                type="number"
                                name="payAmt4"
                                value={formData.payAmt4}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Payment Amount for May (PAY_AMT5)</Form.Label>
                            <Form.Control
                                type="number"
                                name="payAmt5"
                                value={formData.payAmt5}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Payment Amount for April (PAY_AMT6)</Form.Label>
                            <Form.Control
                                type="number"
                                name="payAmt6"
                                value={formData.payAmt6}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>

                </Row>
                <div className="text-center">
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Predict'}
                    </Button>
                </div>
            </Form>

            {error && <Alert variant="danger" className="mt-4 text-center">{error}</Alert>}

            {prediction !== null && (
                <Alert variant="success" className="mt-4 text-center">
                    <h4>Prediction Result: {prediction === 1 ? 'Default' : 'No Default'}</h4>
                </Alert>
            )}
        </Container>
    );
}

export default App;
