import React from 'react';
import { Button, Row, Col, Card, Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import ServerItem from './ServerItem';
import ServerEdit from './ServerEdit';
import WebSocketClient from '../../webSocketClient';
import CollectionHelper from '../../collectionHelper';

const collectionName = 'servers';
export default class ServerList extends React.Component {
  static propTypes = {
    onServerSelected: PropTypes.func.isRequired,
    selectedServer: PropTypes.shape({ id: PropTypes.number })
  };

  static defaultProps = {
    selectedServer: {}
  };

  constructor(props) {
    super(props);
    this.state = { servers: [], modalShow: false };
  }

  componentDidMount() {
    fetch('/api/server')
      .then(res => res.json())
      .then(servers => {
        if (servers && servers.length) {
          const [selectedServer] = servers;
          const { onServerSelected } = this.props;
          onServerSelected(selectedServer);
        }
        this.setState({ servers });
      });

    WebSocketClient.addListener(collectionName, (action, data) => {
      console.log(`Servers socket listener received [${action}] message.`);
      console.log(`typeof action = ${typeof action}`);

      this.setState(
        CollectionHelper.GetSetStateDelegate(action, 'servers', data)
      );
    });
  }

  handleAddServer = () => {
    console.log('showing modal');
    this.setState({ modalShow: true });
  };

  handleServerItemClick = server => {
    console.log('ServerList ServerItemClicked (handleServerItemClick) =');
    console.log(server);
    const { onServerSelected } = this.props;
    onServerSelected(server);
  };

  render() {
    const { servers, modalShow } = this.state;
    const { selectedServer } = this.props;

    const handleClose = () => {
      this.setState({ modalShow: false });
    };

    return (
      <React.Fragment>
        <Card body>
          <Container>
            <Row className="mb-3">
              <Col xs="auto" className="align-self-center">
                <Button
                  title="Add Server"
                  variant="primary"
                  onClick={this.handleAddServer}
                >
                  {'+'}
                </Button>
              </Col>
              <Col>
                <h1>Servers</h1>
              </Col>
            </Row>
            {servers.map(val => (
              <ServerItem
                key={val.id}
                server={val}
                isActive={selectedServer.id === val.id}
                onClick={this.handleServerItemClick}
              />
            ))}
          </Container>
        </Card>
        <ServerEdit
          action="Add"
          modalShow={modalShow}
          handleClose={handleClose}
          server={selectedServer}
        />
      </React.Fragment>
    );
  }
}
