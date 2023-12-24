import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { sendMail } from '../actions/main/mail.actions';
import { AuthContext } from '../Providers/auth.provider';

const ContactForm = () => {
    const {logout} = useContext(AuthContext);
    const location = useLocation();
    const tMail = location.state?.targetMail;
    const targetMail = tMail ? tMail : '';
  const [subject, setSubject] = useState('');
  const [emailAddress, setEmailAddress] = useState(targetMail);
  const [message, setMessage] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubjectChange = (e: { target: { value: React.SetStateAction<string>; }; }) => setSubject(e.target.value);
  const handleEmailChange = (e: { target: { value: React.SetStateAction<string>; }; }) => setEmailAddress(e.target.value);
  const handleMessageChange = (e: { target: { value: React.SetStateAction<string>; }; }) => setMessage(e.target.value);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log(message);
    try {
        await sendMail(emailAddress, subject, message);
        return setSubmitted(true);
    } catch (err: any) {
        // if (err.AR == true) return logout();
        return setSubmitError(err.message);
    }
  };

  return (
    <div className="p-m-c">
    <div className="container py-4 m-form">
      <form id="contactForm" onSubmit={handleSubmit}>
      <div className="mb-3">
          <label className="form-label" htmlFor="emailAddress">Email Address</label>
          <input className="form-control" id="emailAddress" type="email" placeholder="Email Address" required value={emailAddress} onChange={handleEmailChange} />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="name">Subject</label>
          <input className="form-control" id="name" type="text" placeholder="Subject" required value={subject} onChange={handleSubjectChange} />
        </div>
        
        <div className="mb-3">
          <label className="form-label" htmlFor="message">Message</label>
          <textarea className="form-control" id="message" placeholder="Message" style={{ height: '10rem' }} required value={message} onChange={handleMessageChange}></textarea>
        </div>

        {submitted && !submitError && (
          <div className="alert alert-success" role="alert" id="submitSuccessMessage">
            <center>Maik Sent Successfully !</center>
          </div>
        )}

        {submitError && (
          <div className="alert alert-danger" role="alert" id="submitErrorMessage">
            {submitError}
          </div>
        )}

        <div className="d-grid">
          <button className="btn btn-primary btn-lg" id="submitButton" type="submit">Send</button>
        </div>

      </form>
    </div>
    </div>
  );
};

export default ContactForm;
