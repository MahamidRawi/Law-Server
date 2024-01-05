import React, { useContext, useState, ChangeEvent, FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { sendMail } from '../../actions/main/mail.actions';
import { AuthContext } from '../../Providers/auth.provider';
import { fieldsOfLaw, lawSystems } from '../../schemas/law.inputs';
import { Form } from 'react-bootstrap';
import '../../wallet.css';
import { ActivityIncicator } from '../../RC/acitivity.incdicator';

interface NewCaseProps {}

const NewCase: React.FC<NewCaseProps> = () => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const tMail = location.state?.targetMail;
  const targetMail = tMail ? tMail : '';

  const [subject, setSubject] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState<string>(targetMail);
  const [message, setMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [fol, setFOL] = useState<string>('');
  const [selectedPosition, setSelectedPosition] = useState<string>('defense');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('easy');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError('');
    return setTimeout(() => setLoading(false), 400)
  };

  const handlePositionChange = (e: ChangeEvent<HTMLInputElement>) => setSelectedPosition(e.target.value);
  const handleDifficultyChange = (e: ChangeEvent<HTMLInputElement>) => setSelectedDifficulty(e.target.value);

  const setFieldOfLaw = (field: string) => setFOL(field);

  return (
    <div className="p-m-c">
      <div className="container py-4 m-form ncform">
        {loading ? <ActivityIncicator fullScreen /> : (
        <form id="contactForm" onSubmit={handleSubmit}>
          <center>
            <h2>Find New Case</h2>
          </center>
          <Form.Group>
            <Form.Label className="form-label">Field Of Law</Form.Label>
            <Form.Control as="select" value={fol} onChange={(e: any) => setFieldOfLaw(e.target.value)} className="transfer-reasons mb-4">
              <option value="">Select a Field of Law</option>
              {fieldsOfLaw.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Form.Control>

            <Form.Label className="form-label">Position</Form.Label>

            <Form.Check
              label="Defense"
              name="position"
              type="radio"
              id={`inline-radio-defense`}
              value="defense"
              checked={selectedPosition === 'defense'}
              onChange={handlePositionChange}
            />
            <Form.Check
              className="mb-3"
              label="Prosecution"
              name="position"
              type="radio"
              id={`inline-radio-prosecution`}
              value="prosecution"
              checked={selectedPosition === 'prosecution'}
              onChange={handlePositionChange}
            />

            <Form.Label className="form-label">Difficulty</Form.Label>

            {['Easy', 'Medium', 'Hard', 'Extreme'].map((diff) => (
              <Form.Check
                key={diff}
                label={diff}
                name="difficulty"
                type="radio"
                className={diff == 'Extreme' ? 'mb-3' : ''}
                id={`inline-radio-${diff.toLowerCase()}`}
                value={diff.toLowerCase()}
                checked={selectedDifficulty === diff.toLowerCase()}
                onChange={handleDifficultyChange}
              />
            ))}
          </Form.Group>

          <Form.Label className="form-label">Additional Keywords</Form.Label>

          <Form.Control type="text" placeholder="Enter Additional Keywords" />
          <Form.Text className="text-muted">
            Make sure to separate them with ";" (Ex: Inside Trading ; Defamation...)
          </Form.Text>
          <br />

          <Form.Label className="form-label mt-3">Law System</Form.Label>
          <Form.Control as="select" value={fol} onChange={(e: any) => setFOL(e.target.value)} className="transfer-reasons mb-4">
            <option value="">Select a Law System</option>
            {lawSystems.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Form.Control>

          {submitted && !submitError && (
            <div className="alert alert-success" role="alert" id="submitSuccessMessage">
              <center>Mail Sent Successfully!</center>
            </div>
          )}

          {submitError && (
            <div className="alert alert-danger" role="alert" id="submitErrorMessage">
              <center>{submitError}</center>
            </div>
          )}

          <div className="d-grid">
            <button className="btn btn-primary btn-lg" id="submitButton" type="submit">
              Find New Case
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default NewCase;
