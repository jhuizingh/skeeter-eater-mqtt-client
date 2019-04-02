import React from 'react';
import {
  Alert, Button, Form, Modal
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';
import FormGroup from '../FormGroup';

export default class ServerEdit extends React.Component {
  static propTypes = {
    action: PropTypes.string.isRequired,
    modalShow: PropTypes.bool,
    handleClose: PropTypes.func.isRequired,
    form: PropTypes.shape({ id: PropTypes.string })
  };

  static defaultProps = {
    modalShow: false,
    form: {}
  };

  constructor(props) {
    super(props);

    const { form } = props;

    this.state = {
      buttonsDisabled: false,
      errorMessage: '',
      form
    };
  }

  handleSave = async () => {
    const { form, errorMessage } = this.state;
    const { handleClose } = this.props;
    console.log(errorMessage);

    if (!form.server || !form.name) {
      this.setState({ errorMessage: 'Please enter values for Name and Server.' });
      return;
    }

    this.setState({ errorMessage: '' });
    console.log(form);

    try {
      const postResponse = await axios.post('./api/servers', form);
      console.log(`postResponse.status = [${postResponse.status}]`);

      this.setState({ form: {} });
      handleClose();
    } catch (error) {
      console.log('Error. Response =');
      console.log(error);
    }
  };

  handleInputChange = (name, value) => {
    this.setState((state) => {
      const { form } = state;

      const newProp = {};
      newProp[name] = value;
      const newForm = Object.assign(form, newProp);

      const newPartialState = { form: newForm };
      return newPartialState;
    });
  };

  render() {
    const { handleClose, modalShow, action } = this.props;
    const { form, buttonsDisabled, errorMessage } = this.state;
    const modalClose = () => {
      this.setState({ form: {} });
      handleClose();
    };

    return (
      <Modal show={modalShow} centered onHide={modalClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {action}
            {' MQTT Server'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && (
            <Alert variant="danger" show={errorMessage} transition={null}>
              {errorMessage}
            </Alert>
          )}
          <Form className="text-left">
            <FormGroup
              controlId="name"
              label="Connection Name"
              placeholder="Name"
              helpText="Human readable for the server."
              onChange={this.handleInputChange}
              form={form}
            />
            <FormGroup
              controlId="server"
              label="Server"
              placeholder="Enter name"
              helpText="Connection Information. Include protocol and port. Example: tcp://mqttHostname:1833"
              onChange={this.handleInputChange}
              form={form}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleSave} disabled={buttonsDisabled}>
            {'Save'}
          </Button>
          <Button onClick={modalClose} disabled={buttonsDisabled}>
            {'Cancel'}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
