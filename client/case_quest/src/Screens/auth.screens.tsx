import React, {useState, useEffect} from 'react';
import { Form, Button } from 'react-bootstrap';
import { AuthContext } from '../Providers/auth.provider';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'



export const SignIn = () => {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSignIn = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        return console.log('Sign In Handled')
    }

    return (
        <div className="parent-sign-in">
            <div className="sign-in">
                <br /><br /><br />
                    <p className="Header-Text">Sign In</p>
                <br /><br /><br />
            <Form className="my-auto">
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            </Form.Group>
           {error ? <p className="alert alert-danger">{error}</p> : <></>}
            <Button variant="dark" type="submit" onClick={(e) => handleSignIn(e)}>
                Sign In
            </Button>
            </Form>
            </div>
        </div>
    )
    
}


