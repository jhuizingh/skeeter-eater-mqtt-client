import React from 'react';
import './app.scss';
import { Col, Row, Navbar } from 'react-bootstrap';
import ServerList from './components/server/ServerList';
import SubscriptionList from './components/subscription/SubscriptionList';
import webSocketClient from './webSocketClient';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log('componentDidMount');
    webSocketClient.init();
  }

  handleServerSelected = (server) => {
    // console.log('App ServerItemClicked (handleServerSelected) =');
    // console.log(server);
    this.setState({ selectedServer: server });
  };

  render() {
    const { selectedServer } = this.state;
    // console.log('App Render(). selectedServer=');
    // console.log(selectedServer);
    return (
      <React.Fragment>
        <Navbar bg="light" variant="light">
          <Navbar.Brand>Skeeter Eater MQTT Client</Navbar.Brand>
        </Navbar>
        <div className="app-container">
          <Row>
            <Col xs="auto" className="pr-0">
              <ServerList
                onServerSelected={this.handleServerSelected}
                selectedServer={selectedServer}
              />
            </Col>
            <Col className="pl-0">
              <SubscriptionList server={selectedServer} />
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}
