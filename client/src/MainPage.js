import React from 'react';
import { Button, InputGroup, Form, DropdownButton, Dropdown } from 'react-bootstrap';
import GetAnswerForm from './GetAnswerForm';
import server from './Axios';
import { Redirect } from 'react-router-dom';

class MainPage extends React.Component {
  isUnmount = false;

  state = {
    questionSelect: false,
    questionName: "",
    result: null,
    resultColor: "text-danger",
    score: 0,

    attemptsLeft: 3,
    key: "Select a code file for which you want the key!",

    codeFileNames: [],
    questionFileNames: [],

    isLogin: true,

  };

  componentWillUnmount() {
    this.isUnmount = true;
  }

  componentDidMount() {
    if (localStorage.getItem('x-auth'))
      server.defaults.headers['x-auth'] = localStorage.getItem('x-auth');

    server.get('/me/codes')
      .then(response => {
        if (this.isUnmount) return;
        this.setState({ codeFileNames: response.data });
      })
      .catch(err => {
        if (this.isUnmount) return;
        if (err.response && err.response.status === 400 && err.response.data.token) {
          // either token expires or user has changed it
          this.setState({ isLogin: false });
          localStorage.removeItem('x-auth');
          return;
        }
        console.log("codeFileNames: " + err);
      });

    server.get('/me/question')
      .then(response => {
        if (this.isUnmount) return;
        this.setState({ questionFileNames: response.data });
      })
      .catch(err => {
        if (this.isUnmount) return;
        if (err.response && err.response.status === 400 && err.response.data.token) {
          // either token expires or user has changed it
          this.setState({ isLogin: false });
          localStorage.removeItem('x-auth');
          return;
        }
      });

      server.get('/me/info')
        .then(response => {
          if(this.isUnmount) return;
          this.setState({...response.data});
        })
        .catch(err => {
          if(this.isUnmount) return;
          if (err.response && err.response.status === 400 && err.response.data.token) {
            // either token expires or user has changed it
            this.setState({ isLogin: false });
            localStorage.removeItem('x-auth');
            return;
          }
          console.log("info get error: " + err);
        });
  }

  onQuesClick = (evt) => {
    console.log(evt.target.innerHTML);
    const question = evt.target.innerHTML;
    this.setState({ questionSelect: true, questionName: question });
  }

  codeFileSelected = (evt) => {
    console.log(evt.target.innerText);
    this.refs.codeFileName.value = evt.target.innerText;
  }

  onCodeKeyClick = () => {
    if (this.refs.codeFileName.value === "") return;

    server.get(`/me/codes/${this.refs.codeFileName.value}`)
      .then(response => {
        if (this.isUnmount) return;
        this.setState({
          key: response.data.password,
          attemptsLeft: response.data.remainingAccess
        });
      })
      .catch(err => {
        if (this.isUnmount) return;
        if (err.response && err.response.status === 400 && err.response.data.token) {
          // either token expires or user has changed it
          this.setState({ isLogin: false });
          localStorage.removeItem('x-auth');
          return;
        }
        if (err.response && err.response.status === 400 && err.response.data.error) {
          // maximum limit reached
          this.setState({ key: err.response.data.error });
          return;
        }
      });
  }

  onFileOutputSubmit = (questionName, inputFileName, output) => {
    server.get(`/me/question/${questionName}/${inputFileName}/${output}`)
      .then(response => {
        if (this.isUnmount) return;
        this.setState({
          score: response.data.score,
          result: response.data.nextFilePassword,
          resultColor: "text-success"
        })
      })
      .catch(err => {
        if (this.isUnmount) return;
        if (err.response && err.response.status === 400 && err.response.data.token) {
          // either token expires or user has changed it
          this.setState({ isLogin: false });
          localStorage.removeItem('x-auth');
          return;
        }
        if (err.response && err.response.status === 400 && err.response.data.question) {
          this.setState({
            result: err.response.data.question,
            resultColor: "text-danger"
          });
          return;
        }
      });
  }

  render() {
    if (this.state.isLogin === false) {
      localStorage.removeItem('x-auth');
      return <Redirect to="/" />;
    }
    return (
      <div className="d-flex flex-column p-4">
        <div>
          <p className="text-info mb-4"><b>Select the Question to answer</b></p>
          <div className="d-flex flex-row flex-wrap" style={{ justifyContent: "space-between" }}>
            {this.state.questionFileNames.map((cur, ind) => (
              <Button
                key={`question${ind}`}
                variant="outline-dark"
                onClick={this.onQuesClick}>
                {cur}
              </Button>
            ))}

          </div>
          {this.state.questionSelect &&
            <GetAnswerForm
              title={this.state.questionName}
              onSubmit={this.onFileOutputSubmit}
              onCancel={() => this.setState({ questionSelect: false, result: null })} />}

          {this.state.result &&
            <p className="border border-dark bg-light ml-5 mr-5 mb-5 mt-2 p-3">
              <b className="text-info">Result</b>:&nbsp;
              <b className={`${this.state.resultColor}`}>{this.state.result}</b></p>}
        </div>
        <hr style={{ width: "100%" }} />
        <div className="pt-2">
          <p className="text-info"><b>Get the password of the files to access</b></p>

          <Form className="border border-dark bg-light p-2">
            <p className="text-warning text-center pt-2">
              <b>Only {this.state.attemptsLeft} attempts left</b>
            </p>
            <hr />

            <InputGroup>
              <DropdownButton
                title="select"
                as={InputGroup.Prepend}
                variant="outline-dark">
                {this.state.codeFileNames.map((x, ind) => (
                  <Dropdown.Item
                    key={`codeFile${ind}`}
                    onClick={this.codeFileSelected}>
                    {x}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
              <Form.Control type="text" placeholder="File name" ref="codeFileName" />
            </InputGroup>

            <div className="d-flex mt-2">
              <Button
                className="m-auto"
                variant="outline-success"
                onClick={this.onCodeKeyClick}>
                Get the key
              </Button>
            </div>
          </Form>

          {this.state.key &&
            <p
              className="text-danger mt-3 border border-dark p-2 bg-light">
              Key: <b>{this.state.key}</b>
            </p>}
        </div>
      </div>
    );
  }
}

export default MainPage;