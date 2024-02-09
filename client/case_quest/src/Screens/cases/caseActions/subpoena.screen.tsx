import React, { useState, useEffect, useContext } from 'react';
import { Form } from 'react-bootstrap';
import { getSubpoenasPricings, issueSubpoena } from '../../../actions/main/cases.actions';
import { AuthContext } from '../../../Providers/auth.provider';
import { ActivityIncicator } from '../../../RC/acitivity.incdicator';
import { useLocation } from 'react-router-dom';

interface SubpoenaType {
  name: string;
  price: number;
}

interface SubpoenaProps {
  formtype: 'Subpoena' | 'File Motion'
}

type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const SubpoenaScreen: React.FC<SubpoenaProps> = ({formtype}) => {
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [type, setSubpoenaType] = useState<string | undefined>(undefined);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined | false>(false);
  const [subpoenas, setSubpoenas] = useState<SubpoenaType[]>([]);
  const [name, setName] = useState<string | undefined>(undefined);
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [entity, setTarget] = useState<string>('');
  const [justification, setJustification] = useState<string>('');
  const {caseId} = location.state;
  const shortened = formtype == 'File Motion' ? 'Motion' : 'Subpoena'

  // ftype = 1 : subpoena
  // ftype = 2 : file motion

  useEffect(() => {
    setLoading(true);
    const fetchPricings = async () => {
      try {
        const res = await getSubpoenasPricings(formtype);
        setSubpoenas(res.pricings);
        return setLoading(false);
      } catch (err) {
        return logout();
      }
    };

    fetchPricings();
  }, [logout]);

  const handleChange = (e: React.ChangeEvent<FormControlElement>) => {
    const value = e.target.value;
    const selectedSubpoena = subpoenas.find(subpoena => subpoena.name === value);
    if (selectedSubpoena) {
      setSubpoenaType(selectedSubpoena.name);
      setName(selectedSubpoena.name);
      setPrice(selectedSubpoena.price);
    }
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setSubmitError(false);
  setSubmitted(false);
  if (formtype == 'Subpoena') {
    issueSubpoena(caseId, {entity, justification, type}).then(res => {
    setSubmitted(true); 
    return setLoading(false)
  }).catch(err => {setLoading(false); err.AR ? logout() : setSubmitError(err.message)})
  } else {

  }
}

  return (
        loading ? <ActivityIncicator fullScreen /> : (
    <div className="p-m-c">
      <div className="container py-4 m-form ncform">
        <form id="contactForm" onSubmit={(e) => handleSubmit(e)}>
          <center>
            <h2>{formtype}</h2>
          </center>
          <br />
          <Form.Group>
            <Form.Label className="form-label">{shortened} Type</Form.Label>
            <Form.Control as="select" value={type} onChange={handleChange} className="transfer-reasons mb-4" required>
              <option value="">Select a {shortened} Type</option>
              {subpoenas.map((r, index) => (
                <option key={index} value={r.name}>
                  {r.name} - {r.price} $
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Label className="form-label">{formtype == 'Subpoena' ? 'Entity / Who ? / What ?' : 'Title' }</Form.Label>
          <Form.Control type='text' required placeholder={formtype == 'Subpoena' ? "Enter The Name of the Entity You Are Subpoenaing..." : 'Enter the Title for your Motion'} onChange={(e) => setTarget(e.target.value)}/>
          <Form.Text className="text-muted">
            {formtype == 'Subpoena' ? 'Please Precise Specific details of the Subject of your Subpoena.' : 'Please Precise a Specific title for the Motion'}
          </Form.Text>
          <br />
          <br />
          <Form.Label className="form-label">Ground</Form.Label>
          <textarea className="form-control" id="message" placeholder={`Justify the basis for the ${shortened}.`} style={{ height: '10rem' }} required onChange={(e) => setJustification(e.target.value)} />
          <Form.Text className="text-muted">
            Delineate the particular details pertaining to the subject matter of your {shortened} request.
          </Form.Text>
          <br />
          <br />
          {submitted && !submitError && (
            <div className="alert alert-success" role="alert" id="submitSuccessMessage">
              <center>Subpoena Issued Successfully</center>
            </div>
          )}
          {submitError && (
            <div className="alert alert-danger" role="alert" id="submitErrorMessage">
              <center>{submitError}</center>
            </div>
          )}
          <br />
          <div className="d-grid">
            <Form.Text className="text-muted">
              * {shortened}s are automatically endorsed by the issuer upon court approval.
              <br />
              * A price tag is accompagnied with each {shortened}.
              <br />
              * You will be charged even if your request is denied.
            </Form.Text>
            <br />
            <button className="btn btn-primary btn-lg" id="submitButton" type="submit">
              Issue {shortened} {price && `(${price} $)`}
            </button>
          </div>
        </form>
      </div>
    </div>
        )
  );
};

export default SubpoenaScreen;