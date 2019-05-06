import React from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function FormGroup(props) {
  const {
    controlId, label, placeholder, helpText, onChange, form
  } = props;
  const localOnChange = (event) => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;

    onChange(name, value);
  };
  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type="text"
        name={controlId}
        placeholder={placeholder}
        onChange={localOnChange}
        defaultValue={form[controlId]}
      />
      <Form.Text className="text-muted">{helpText}</Form.Text>
    </Form.Group>
  );
}
FormGroup.propTypes = {
  controlId: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  helpText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  form: PropTypes.shape({})
};
FormGroup.defaultProps = {
  placeholder: '',
  helpText: '',
  form: {}
};
