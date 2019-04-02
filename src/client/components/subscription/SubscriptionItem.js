import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  Card, Row, Col, DropdownButton, Dropdown
} from 'react-bootstrap';
import SubscriptionMessage from './SubscriptionMessage';
import SubscriptionEdit from './SubscriptionEdit';
import WebSocketClient from '../../webSocketClient';
import CollectionHelper from '../../../server/utilities/collectionHelper';

const collectionName = 'messages';

export default class SubscriptionItem extends React.Component {
  static propTypes = {
    subscription: PropTypes.shape({
      id: PropTypes.string.isRequired,
      topic: PropTypes.string.isRequired,
      messages: PropTypes.arrayOf(PropTypes.object)
    }).isRequired,
    server: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired
  };

  constructor(props) {
    super(props);
    this.state = { modalShow: false, messages: [] };
  }

  componentDidMount = async () => {
    const { subscription } = this.props;
    await fetch(`/api/subscriptions/${subscription.id}/messages/`)
      .then(res => res.json())
      .then(messages => this.setState({ messages }));


    WebSocketClient.addListener(collectionName, (action, data) => {
      console.log(`Servers socket listener received [${action}] message.`);
      console.log(`typeof action = ${typeof action}`);

      // TODO - Make this filter the messages based on parent id. Right now it will show 
      // all messages in all subscriptions
      this.setState(CollectionHelper.GetSetStateDelegate(action, collectionName, data),
        () => { this.forceUpdate(); });
    });
  }

  handleEdit = () => {
    this.setState({ modalShow: true });
  };

  handleDelete = async (key, event) => {
    const { subscription } = this.props;

    console.log('delete click');
    console.log(event);
    const postResponse = await axios.delete(`./api/subscriptions/${subscription.id}`);

    console.log('postResponse=');
    console.log(postResponse);
  };

  render() {
    const { modalShow, messages } = this.state;
    const { subscription, server } = this.props;
    const { topic } = subscription;
    const handleClose = () => {
      this.setState({ modalShow: false });
    };
    return (
      <React.Fragment>
        <Card className="subscription-item">
          <Card.Header>
            <Row>
              <Col xs="auto" className="p-0 align-self-center">
                <DropdownButton variant="outline-primary" size="sm" title="" className="p-0 m-0">

                  <Dropdown.Item onSelect={this.handleEdit} eventKey="edit">Edit</Dropdown.Item>
                  <Dropdown.Item onSelect={this.handleDelete} eventKey="delete">Delete</Dropdown.Item>
                </DropdownButton>
              </Col>
              <Col>
                <h2>
                  {'Topic: '}
                  {topic}
                </h2>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <h3>Messages</h3>
            {messages.map(message => (
              <SubscriptionMessage key={message.id} message={message} subscription={subscription} />
            ))}
          </Card.Body>
        </Card>
        <SubscriptionEdit action="Edit" modalShow={modalShow} handleClose={handleClose} form={subscription} server={server} />
      </React.Fragment>
    );
  }
}
