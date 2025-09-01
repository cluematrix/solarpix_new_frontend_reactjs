import React from "react";
import { Form } from "react-bootstrap";

const CustomSelect = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  placeholder = "Select an option",
  error,
  touched,
  required = false,
  size = "md", // optional size
  lableKey="id",
  lableName="name"
}) => {
  return (
    <Form.Group>
      {label && (
        <Form.Label htmlFor={name}>
          {label} {required && <span className="text-danger">*</span>}
        </Form.Label>
      )}
      <Form.Select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={touched && error ? "is-invalid" : ""}
      >
        <option value="">{placeholder}</option>
        {options.length > 0 &&  options?.map((item) => (
          <option key={item[lableKey]} value={item[lableKey]}>
            {item[lableName]}
          </option>
        ))}
      </Form.Select>
      {touched && error && (
        <div className="invalid-feedback" style={{ fontSize: "11px" }}>
          {error}
        </div>
      )}
    </Form.Group>
  );
};

export default CustomSelect;
