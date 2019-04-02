import React from 'react';
import {
  Alert, Button, Form, Modal
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';
import FormGroup from '../FormGroup';

export default class SubscriptionEdit extends React.Component {
  static propTypes = {
    action: PropTypes.string.isRequired,
    modalShow: PropTypes.bool,
    handleClose: PropTypes.func.isRequired,
    form: PropTypes.shape({ id: PropTypes.string }),
    server: PropTypes.shape({ id: PropTypes.string.isRequired })
  };

  static defaultProps = {
    modalShow: false,
    form: {},
    server: { id: '' }
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
    const { form } = this.state;
    const { handleClose, server } = this.props;

    console.log(`SubscriptionEdit handleSave() server=[${JSON.stringify(server)}]`);

    if (!form.topic) {
      this.setState({ errorMessage: 'Please enter values for Topic.' });
      return;
    }

    this.setState({ errorMessage: '' });
    console.log(form);

    try {
      const postResponse = await axios.post(`./api/servers/${server.id}/subscriptions`, form);
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
    const {
      handleClose, modalShow, action, server
    } = this.props;
    const { form, buttonsDisabled, errorMessage } = this.state;
    const modalClose = () => {
      this.setState({ form: {} });
      handleClose();
    };
    console.log(`SubscriptionEdit render() server=[${JSON.stringify(server)}]`);

    return (
      <Modal show={modalShow} centered onHide={modalClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {action}
            {' Subscription to '}
            { server.name }
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
              controlId="topic"
              label="Topic"
              placeholder="Topic"
              helpText="Subscription topic. Something like &quot;primary/secondary/#&quot;"
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
