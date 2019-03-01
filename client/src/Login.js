import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

class Login extends React.Component {

  loginClick = () => {
    const { login, password } = this.refs;
    this.props.onLogin(login.value, password.value);
  }

  render() {
    return (
      <div style={{ padding: "20px", paddingTop: "0px" }}>
        <Form className="border bg-light" style={{ padding: "10px" }}>

          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              <b className="text-info">Login</b>
            </Form.Label>
            <Col sm={10}>
              <Form.Control type="text" placeholder="Login id" ref="login" />
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              <b className="text-info">password</b>
            </Form.Label>
            <Col sm={10}>
              <Form.Control type="password" placeholder="password" ref="password" />
            </Col>
          </Form.Group>

          <div className="d-flex">
            <Button
              variant="outline-success"
              style={{ margin: "auto" }}
              onClick={this.loginClick}>
              Login
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default Login;