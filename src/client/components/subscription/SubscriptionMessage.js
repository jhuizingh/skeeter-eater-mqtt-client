import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, Col, Row, Badge
} from 'react-bootstrap';

export default function SubscriptionMessage(props) {
  const { subscription, message } = props;
  console.log(`message=${JSON.stringify(message)}`);
  const { time, qos, content } = message;
  return (
    <Card className="subscription-message">
      <Card.Header>
        <Row>
          <Col md="auto" className="time text-left pl-1">
            {time}
            <Badge>
              {' QoS: '}
              {qos}
            </Badge>
          </Col>
          <Col>{message.topic === subscription.topic ? '' : message.topic}</Col>
        </Row>
      </Card.Header>
      <Card.Body className="text-left">
        <div>
          <Badge variant="primary">Content: </Badge>
          {` ${content}`}
        </div>
      </Card.Body>
    </Card>
  );
}
SubscriptionMessage.propTypes = {
  subscription: PropTypes.shape({
    topic: PropTypes.string.isRequired
  }).isRequired,
  message: PropTypes.shape({
    time: PropTypes.string.isRequired,
    content: PropTypes.string,
    topic: PropTypes.string.isRequired,
    qos: PropTypes.number
  }).isRequired
};
