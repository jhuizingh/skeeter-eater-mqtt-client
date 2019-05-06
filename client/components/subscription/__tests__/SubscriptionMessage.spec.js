import 'jest-dom/extend-expect';
import React from 'react';
import { render } from 'react-testing-library';
import SubscriptionMessage from '../SubscriptionMessage';

const defaultTopic = 'test/topic/1';
const differentTopic = 'another/completely/different/topic';

const setup = (propOverrides, subscriptionOverrides, messageOverrides) => {
  const props = Object.assign({}, propOverrides);
  props.subscription = Object.assign(
    { topic: defaultTopic },
    subscriptionOverrides
  );
  props.message = Object.assign(
    {
      time: new Date(2019, 3, 1, 10, 13, 27).toString(),
      content: 'here is the value',
      topic: defaultTopic,
      qos: 0
    },
    messageOverrides
  );

  const component = render(<SubscriptionMessage {...props} />);

  return {
    props,
    component
  };
};

describe('SubscriptionMessage Component', () => {
  test('render', () => {
    const { component } = setup();
    console.log(component);

    expect(component.container).toMatchSnapshot();
  });
});

describe('Message topic shows if different than Subscription topic', () => {
  test('Does not show when matching', () => {
    const { component } = setup(
      null,
      { topic: defaultTopic },
      { topic: defaultTopic }
    );

    console.log(component);

    const topicNode = component.getByTestId('subscription-topic');
    console.log(topicNode);

    expect(topicNode).not.toHaveTextContent(differentTopic);

    expect(component.container).toMatchSnapshot();
  });

  test('Does show when not matching', () => {
    const { component } = setup(
      null,
      { topic: defaultTopic },
      { topic: differentTopic }
    );

    console.log(component);

    const topicNode = component.getByTestId('subscription-topic');
    console.log(topicNode);

    expect(topicNode).not.toHaveTextContent(differentTopic);

    expect(component.container).toMatchSnapshot();
  });
});
