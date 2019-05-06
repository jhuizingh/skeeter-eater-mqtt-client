import React from 'react';
import PropTypes from 'prop-types';
import { Card, DropdownButton, Dropdown, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import ServerEdit from './ServerEdit';

export default class ServerItem extends React.Component {
  static propTypes = {
    server: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
    isActive: PropTypes.bool,
    onClick: PropTypes.func.isRequired
  };

  static defaultProps = {
    isActive: false
  };

  constructor(props) {
    super(props);
    this.state = { modalShow: false };
  }

  handleEdit = () => {
    this.setState({ modalShow: true });
  };

  handleDelete = async (key, event) => {
    const { server } = this.props;

    console.log('delete click');
    console.log(event);
    const postResponse = await axios.delete(`./api/server/${server.id}`);

    console.log('postResponse=');
    console.log(postResponse);
  };

  handleServerClick = () => {
    const { server } = this.props;
    // console.log('ServerItem ServerItemClicked (handleServerClick) event =');
    // console.log(event);
    const { onClick } = this.props;
    onClick(server);
  };

  render() {
    const { modalShow } = this.state;
    const { server, isActive } = this.props;
    const { name } = server;
    const handleClose = () => {
      this.setState({ modalShow: false });
    };

    return (
      <React.Fragment>
        <Card
          bg={isActive ? 'light' : ''}
          text={isActive ? 'black' : ''}
          onClick={this.handleServerClick}
        >
          <Card.Body className="pr-1">
            <Row className="mr0">
              <Col xs="auto" className="p-0">
                <DropdownButton
                  onClick={e => e.stopPropagation()}
                  type=""
                  title=""
                  size="sm"
                  variant="outline-primary"
                  className="p-0 m-0"
                >
                  <Dropdown.Item onSelect={this.handleEdit} eventKey="edit">
                    Edit
                  </Dropdown.Item>
                  <Dropdown.Item onSelect={this.handleDelete} eventKey="delete">
                    Delete
                  </Dropdown.Item>
                </DropdownButton>
              </Col>
              <Col className="mr-1 text-left">{name}</Col>
            </Row>
          </Card.Body>
        </Card>
        <ServerEdit
          action="Edit"
          modalShow={modalShow}
          handleClose={handleClose}
          server={server}
        />
      </React.Fragment>
    );
  }
}
