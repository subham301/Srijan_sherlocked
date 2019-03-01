import React from 'react';
import { Row, Form, Col, Button } from 'react-bootstrap';

class GetAnswerForm extends React.Component {

  onSubmit = () => {
    const { fileName, output } = this.refs;
    this.props.onSubmit(this.props.title, fileName.value, output.value);
  }

  render() {
    return (
      <div className="border border-dark mt-5 ml-5 mr-5 bg-light">
        <p className="pt-3 text-center text-info">{this.props.title}</p>
        <hr />

        <Form style={{ padding: "10px" }}>

          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              <b className="text-info">Input File name</b>
            </Form.Label>
            <Col sm={10}>
              <Form.Control type="text" placeholder="Input file name" ref="fileName" />
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              <b className="text-info">Your Output</b>
            </Form.Label>
            <Col sm={10}>
              <Form.Control type="text" placeholder="your output here" ref="output" />
            </Col>
          </Form.Group>

          <div className="d-flex">
            <Button
              variant="outline-warning"
              style={{ margin: "auto" }}
              onClick={this.onSubmit}>
              Verify and get key
            </Button>
            <Button
              variant="outline-danger"
              style={{ margin: "auto" }}
              onClick={this.props.onCancel}>
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default GetAnswerForm;