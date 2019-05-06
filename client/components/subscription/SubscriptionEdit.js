import React from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';
import FormGroup from '../FormGroup';

export default class SubscriptionEdit extends React.Component {
  static propTypes = {
    action: PropTypes.string.isRequired,
    modalShow: PropTypes.bool,
    handleClose: PropTypes.func.isRequired,
    form: PropTypes.shape({ id: PropTypes.number }),
    server: PropTypes.shape({ id: PropTypes.number.isRequired })
  };

  static defaultProps = {
    modalShow: false,
    form: {},
    server: { id: '' }
  };

  constructor(props) {
    super(props);

    const { form } = props;
    const subscription = { id: form.id, topic: form.topic };

    this.state = {
      buttonsDisabled: false,
      errorMessage: '',
      subscription
    };
  }

  handleSave = async () => {
    const { subscription } = this.state;
    const { handleClose, server } = this.props;

    console.log(
      `SubscriptionEdit handleSave() server=[${JSON.stringify(server)}]`
    );

    if (!subscription.topic) {
      this.setState({ errorMessage: 'Please enter values for Topic.' });
      return;
    }

    this.setState({ errorMessage: '' });
    console.log(subscription);

    try {
      let postResponse = await (subscription.id
        ? axios.patch(`/api/subscription/${subscription.id}`, subscription)
        : axios.post('/api/subscription', subscription));

      console.log(`postResponse.status = [${postResponse.status}]`);

      this.setState({ subscription: {} });
      handleClose();
    } catch (error) {
      console.log('Error. Response =');
      console.log(error);
    }
  };

  handleInputChange = (name, value) => {
    this.setState(state => {
      const { subscription } = state;

      const newProp = {};
      newProp[name] = value;
      const newSubscription = Object.assign(subscription, newProp);

      const newPartialState = { subscription: newSubscription };
      return newPartialState;
    });
  };

  render() {
    const { handleClose, modalShow, action, server } = this.props;
    const { subscription, buttonsDisabled, errorMessage } = this.state;
    const modalClose = () => {
      this.setState({ subscription: {} });
      handleClose();
    };
    console.log(`SubscriptionEdit render() server=[${JSON.stringify(server)}]`);

    return (
      <Modal show={modalShow} centered onHide={modalClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {action}
            {' Subscription to '}
            {server.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && (
            <Alert variant="danger" show={errorMessage} transition={null}>
              {errorMessage}
            </Alert>
          )}
          {
            // TODO - keep form from submitting whole page when pressing Enter on keyboard
          }
          <Form className="text-left">
            <FormGroup
              controlId="topic"
              label="Topic"
              placeholder="Topic"
              helpText='Subscription topic. Something like "primary/secondary/#"'
              onChange={this.handleInputChange}
              form={subscription}
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
