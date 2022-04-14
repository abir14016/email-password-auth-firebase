import app from './firebase.init';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';

const auth = getAuth(app)

function App() {

  const [validated, setValidated] = useState(false);
  const [regestered, setRegestered] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [success, setSuccess] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNameField = (event) => {
    // console.log(event.target.value)
    setName(event.target.value)
  }

  const handleEmailField = (event) => {
    setEmail(event.target.value)
  }

  const handlePasswordField = event => {
    setPassword(event.target.value)
  }

  const handleRegisteredChecked = event => {
    setRegestered(event.target.checked);
  }

  const updateUserProfile = () => {
    updateProfile(auth.currentUser, {
      displayName: name
    })
      .then(() => {
        console.log("updating name")
      })
      .catch(error => {
        setError(error)
      })
  }

  const verifyemail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        console.log("verification message sent");
      })
  }

  const handleForgetPassWord = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("email sent");
      })
  }

  const handleFormSubmit = event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (!/(?=.*[!@#$&*])/.test(password)) {
      setError("password should contain at least one special character")
      return
    }
    setValidated(true);
    setError('')

    // console.log('clicked', email, password)
    if (regestered) {
      signInWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user
          console.log(user)
          setSuccess("Login successfully")
        })
        .catch(error => {
          setError(error.message)
        })
    }
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user
          console.log(user)
          setEmail('')
          setPassword('')
          verifyemail()
          updateUserProfile()
          setSuccess("regestered successfully")
        })
        .catch(error => {
          setError(error.message)
          console.error(error)
        })
    }
  }

  return (
    <div>
      <div className="registration w-50 mx-auto mt-5">
        <h2 className='text-primary'>{regestered ? "Log In" : "Please Register!!"}</h2>
        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>

          {!regestered && <Form.Group className="mb-3">
            <Form.Label>Your Name</Form.Label>
            <Form.Control onBlur={handleNameField} type="text" placeholder="Enter your name" required />
            <Form.Control.Feedback type="invalid">
              Please provide your name.
            </Form.Control.Feedback>
          </Form.Group>}

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handleEmailField} type="email" placeholder="Enter email" required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onBlur={handlePasswordField} type="password" placeholder="Password" required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check onChange={handleRegisteredChecked} type="checkbox" label="Already Regestered?" />
            </Form.Group>
            <p className='text-danger'>{error}</p>
            <p className='text-success'>{success}</p>
          </Form.Group>
          <Button onClick={handleForgetPassWord} variant='link'>Forget Password?</Button>
          <br />
          <Button variant="primary" type="submit">
            {regestered ? "Login" : "Regester"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
