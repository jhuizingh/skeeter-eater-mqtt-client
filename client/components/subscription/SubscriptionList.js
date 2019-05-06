import React from 'react';
import { Button, Card, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import SubscriptionItem from './SubscriptionItem';
import SubsciptionEdit from './SubscriptionEdit';
import WebSocketClient from '../../webSocketClient';
import CollectionHelper from '../../collectionHelper';

const collectionName = 'subscriptions';
export default class SubscriptionList extends React.Component {
  static propTypes = {
    server: PropTypes.shape({ id: PropTypes.number.isRequired })
  };

  static defaultProps = {
    server: { id: 0 }
  };

  constructor(props) {
    super(props);
    this.state = { subscriptions: [], modalShow: false };
  }

  _fetchSubscriptions = async () => {
    const { server } = this.props;
    console.log(`_fetchSubscriptions. server=${JSON.stringify(server)}`);
    return new Promise(resolve => {
      if (server.id) {
        console.log('got a server');
        resolve(
          fetch('/api/subscription/')
            .then(res => res.json())
            .then(subscriptions => this.setState({ subscriptions }))
        );
      } else {
        console.log('no server');
        this.setState({ subscriptions: [] }, resolve);
      }
    });
  };

  componentDidMount = async () => {
    await this._fetchSubscriptions();

    WebSocketClient.addListener(collectionName, (action, data) => {
      console.log(`Servers socket listener received [${action}] message.`);
      console.log(`typeof action = ${typeof action}`);

      this.setState(
        CollectionHelper.GetSetStateDelegate(action, collectionName, data),
        () => {
          this.forceUpdate();
        }
      );
    });
  };

  componentDidUpdate = async prevProps => {
    const { server } = this.props;
    const prevServer = prevProps.server;

    if (server.id !== prevServer.id) {
      await this._fetchSubscriptions();
    }
  };

  handleAddSubscription = () => {
    console.log('showing modal');
    this.setState({ modalShow: true });
  };

  render() {
    const { modalShow, subscriptions } = this.state;
    const { server } = this.props;
    const handleClose = () => {
      this.setState({ modalShow: false });
    };

    console.log(`SubscriptionList render() server=[${JSON.stringify(server)}]`);

    const addIsDisabled = !server.id;

    return (
      <React.Fragment>
        <Card className="subscription-list">
          <Card.Body>
            <Row className="mb-3">
              <Col xs="auto" className="align-self-center">
                <Button
                  title="Add Subscription"
                  onClick={this.handleAddSubscription}
                  disabled={addIsDisabled}
                  server={server}
                >
                  {'+'}
                </Button>
              </Col>
              <Col>
                <h1>
                  {'Subscriptions for '}
                  {server.name}
                </h1>
              </Col>
            </Row>

            {subscriptions.map(val => (
              <SubscriptionItem
                key={val.id}
                subscription={val}
                server={server}
              />
            ))}
          </Card.Body>
        </Card>
        <SubsciptionEdit
          action="Add"
          modalShow={modalShow}
          handleClose={handleClose}
          server={server}
        />
      </React.Fragment>
    );
  }
}
