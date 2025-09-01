import React from "react";
import { Form } from "react-bootstrap";

const CustomRadioGroup = ({
  label,
  name,
  options = [],
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
}) => {
  return (
    <Form.Group>
      {label && (
        <Form.Label>
          {label} {required && <span className="text-danger">*</span>}
        </Form.Label>
      )}
      <div className="d-flex gap-3">
        {options.map((option) => (
          <Form.Check
            key={option.id}
            type="radio"
            name={name}
            label={option.name} //Render only name
            id={`${name}-${option.id}`}
            value={option.name} //Send name as value
            checked={value === option.name} //Compare by name
            onChange={onChange}
            onBlur={onBlur}
            className={touched && error ? "is-invalid" : ""}
          />
        ))}
      </div>
      {touched && error && (
        <div className="invalid-feedback" style={{ fontSize: "11px" }}>
          {error}
        </div>
      )}
    </Form.Group>
  );
};

export default CustomRadioGroup;
