import { Row, Col, Button, Form } from 'react-bootstrap';
import { useState } from 'react';

function LoginForm(props) {
  const [username, setUsername] = useState("mario.rossi@example.com");
  const [password, setPassword] = useState("NTanTriN");
  const [errorUsername, setErrorUsername] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const handleChangeUsername = (event) => {
    setErrorUsername("");
    setUsername(event.target.value);
  }

  const handleChangePassword = (event) => {
    setErrorPassword("");
    setPassword(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    let validForm = true;

    // Username validation
    if (username === "") {
      setErrorUsername("Username field cannot be empty");
      validForm = false;
    } else if (!username.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
      setErrorUsername("Username field is not a valid email");
      validForm = false;
    }

    // Password validation
    if (password === "") {
      setErrorPassword("Password field cannot be field");
      validForm = false;
    } else if (password.length < 8) {
      setErrorPassword("Password field must be at least 8 characters long")
      validForm = false;
    }

    if (validForm) {
      props.doLogin({ username: username, password: password });
    }
  };

  return (
    <>
      <Row className="justify-content-center min-vh-100 pt-nav">
        <Col md={4} className="my-auto">
          {/* Form */}
          <Form>
            {/* Username field */}
            <Form.Group controlId="username">
              <Form.Label>E-Mail</Form.Label>
              <Form.Control type="email" value={username} isInvalid={errorUsername} onChange={handleChangeUsername} />
              <Form.Control.Feedback type="invalid">{errorUsername}</Form.Control.Feedback>
            </Form.Group>
            {/* Password field */}
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} isInvalid={errorPassword} onChange={handleChangePassword} />
              <Form.Control.Feedback type="invalid">{errorPassword}</Form.Control.Feedback>
            </Form.Group>
            {/* Submit Button */}
            <Button variant="success" onClick={handleSubmit}>Login</Button>
          </Form>
        </Col>
      </Row>
    </>
  );
}

export default LoginForm;
