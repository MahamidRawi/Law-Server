import React, {useState, useEffect} from 'react';
import { Form } from 'react-bootstrap';
import { fieldsOfLaw } from '../../../schemas/law.inputs';
import { ActivityIncicator } from '../../../RC/acitivity.incdicator';

const SubpoenaScreen: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [subpoenaType, setSubpoenaType] = useState();
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    return (
<div className="p-m-c">
      <div className="container py-4 m-form ncform">
        {loading ? <ActivityIncicator placeholder='Please wait patiently... It can take up to a minute :)' fullScreen /> : (
        <form id="contactForm">
          <center>
            <h2>Find New Case</h2>
          </center>
          <Form.Group>
            <Form.Label className="form-label">Field Of Law</Form.Label>
            <Form.Control required as="select" value={subpoenaType} onChange={(e: any) => setSubpoenaType(e.target.value)} className="transfer-reasons mb-4">
              <option value="">Select a Field of Law</option>
              {fieldsOfLaw.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Form.Control>

            ))
          </Form.Group>

          <Form.Label className="form-label">Additional Keywords</Form.Label>
          <br />

          <Form.Label className="form-label mt-3">Law System</Form.Label>

          {submitted && !submitError && (
            <div className="alert alert-success" role="alert" id="submitSuccessMessage">
              <center>Case Created Successfully</center>
            </div>
          )}

          {submitError && (
            <div className="alert alert-danger" role="alert" id="submitErrorMessage">
              <center>{submitError}</center>
            </div>
          )}

          <div className="d-grid">
            <button className="btn btn-primary btn-lg" id="submitButton" type="submit">
              Find New Case (250 $)
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
    )
}

export default SubpoenaScreen;

