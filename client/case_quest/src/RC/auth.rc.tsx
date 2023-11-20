import React, {useState, useEffect, useContext} from 'react';
import { Form, Button } from 'react-bootstrap';
import { AuthContext } from '../Providers/auth.provider';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styling.css'
import { SignInArray, SignUpArray } from '../data/data';
import { Link, useNavigate, useNavigation } from 'react-router-dom';
import { signInSchema, signUpSchema } from '../schemas/joi.schema';
import { cleanRes } from '../helper/res.helper';
import { signIn, signUp } from '../actions/auth.actions';
import { ActivityIncicator } from './acitivity.incdicator';

export interface AuthFormProps {
    formType: 'Sign In' | 'Sign Up';
}

export const AuthForm = ({ formType }: AuthFormProps) => {
    const [formData, setFormData] = useState<any>({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    const {login} = useContext(AuthContext)

    
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const chosenArray = formType === 'Sign In' ? SignInArray : SignUpArray;

    const handleChange = (e: any, field: string) => setFormData({...formData, [field]: e.target.value});


    useEffect(() => {setError(''); setSuccessMessage('');}, [formType])

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        formType === 'Sign In' ? signInSchema.validateAsync({ email: formData.email, password: formData.password })
        .then(() => {
            signIn({credentials: {email: formData.email, password: formData.password}}).then((res) => {setLoading(false); setSuccessMessage(res.message); login(res.token); navigate('/')}).catch(err => setError(cleanRes(err.message)));

        }).catch(err => {setError(cleanRes(err.message)); setLoading(false)}) : signUpSchema.validateAsync(formData)
        .then(() => {
            signUp(formData).then((res) => {setLoading(false); navigate('/SignIn')}).catch(err => setError(cleanRes(err.message)));
            // Handle successful sign up
        }).catch(err => {setError(cleanRes(err.message)); setLoading(false)});
    };

    return (
        <div className="auth-container">
            {loading ? <ActivityIncicator /> : (
    <div className="auth-form">
        <h2 className="auth-header">{formType}</h2>
        <Form>
            {chosenArray.map((field, index) => (
                <Form.Group className="mb-3" controlId={`formBasic${field}`} key={index}>
                    <Form.Label className="form-label">{cleanRes(field)}</Form.Label>
                    <Form.Control
                        className="form-input"
                        type={field === 'email' ? 'email' : field === 'password' ? 'password' : 'text'}
                        placeholder={`Enter ${cleanRes(field)}`}
                        value={formData[field] || ''}
                        onChange={(e) => handleChange(e, field)}
                    />
                </Form.Group>
            ))}
            {error ? <p className="alert alert-danger text-center">{error}</p> : null}
            {successMessage ? <p className="alert alert-success text-center">{successMessage} !</p> : null}
            <Button variant="primary" className="submit-button" type="submit" onClick={(e) => {e.preventDefault(); handleSubmit(e)}}>
                {formType}
            </Button>
            <div className="auth-switch">
                    {formType === 'Sign In' ? (
                        <p className='lnk'>New to CaseQuest? <Link to="/signup">Sign Up for Free</Link></p>
                    ) : (
                        <p className='lnk'>Already have an account? <Link to="/signin">Sign In</Link></p>
                    )}
                </div>
        </Form>
    </div>
    )}
</div>
    );
};