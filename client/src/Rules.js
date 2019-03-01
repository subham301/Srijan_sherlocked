import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import Login from './Login';
import { Redirect } from 'react-router-dom';
import server from './Axios';

class Rules extends React.Component {
  isUnmount = false;

  componentWillUnmount() {
    this.isUnmount = true;
  }

  state = {
    loginSuccess: false,
    redirect: false,
  }

  componentDidMount() {
    if (localStorage.getItem('x-auth')) {
      this.setState({ loginSuccess: true });
      server.defaults.headers['x-auth'] = localStorage.getItem('x-auth');
    }
  }

  onLogin = (email, password) => {
    server.post('/auth/login', { "email": email, "password": password })
      .then(result => {
        if (this.isUnmount) return;
        console.log(result);

        localStorage.setItem('x-auth', result.headers['x-auth']);
        server.defaults.headers['x-auth'] = result.headers['x-auth'];

        this.setState({ loginSuccess: true });
      })
      .catch(err => {
        if (this.isUnmount) return;
        if (err.response && err.response.status === 400) {
          this.refs.loginError.innerHTML = err.response.data.login;
          return;
        }
        console.log("login : " + err);
      });
  }

  render() {
    if (this.state.redirect)
      return <Redirect push to="/test" />;

    return (
      <div className="container" style={{ maxWidth: "750px" }}>

        <img
          alt="sherlocked poster"
          src={require('./images/poster.jpeg')}
          width="100%"
          style={{ margin: "auto", padding: "20px" }} />

        <div style={{ padding: "20px" }}>
          <ListGroup>
            <ListGroup.Item variant="info"><b>Rules</b></ListGroup.Item>
            <ListGroup.Item action>
              <i>Participants found using unfair means will be disqualifed</i>
            </ListGroup.Item>
            <ListGroup.Item variant="secondary" action>
              <i>Participants found using unfair means will be disqualifed</i>
            </ListGroup.Item>
          </ListGroup>
        </div>

        {this.state.loginSuccess === false ?
          <div>
            <Login onLogin={this.onLogin} />
            <small
              ref="loginError"
              style={{ marginLeft: "20px", paddingBottom: "20px" }}
              className="text-danger"></small>
          </div>
          :
          <div className="d-flex">
            <Button
              variant="outline-info"
              onClick={() => this.setState({ redirect: true })}
              style={{ marginLeft: "auto", marginRight: "auto" }}>
              Go to test
            </Button>
          </div>
        }
      </div>
    );
  }
}

export default Rules;