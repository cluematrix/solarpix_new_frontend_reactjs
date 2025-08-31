// src/components/common/FormInput.jsx
import React from "react";
import { Form } from "react-bootstrap";

const CustomInput = ({
  label,
  name,
  type = "text",
  as,
  value,
  onChange,
  onBlur,
  placeholder,
  touched,
  errors,
  required = false,
  row,
  max,
  min
}) => {
  return (
    <Form.Group>
      <Form.Label>
        {label}
        {required && <span className="text-danger">*</span>}
      </Form.Label>
      <Form.Control
        type={as ? "undefined" : type}
        as={as}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={touched && errors ? "is-invalid" : ""}
        rows={row}
        max={max}
        min={min}
      />
      {touched && errors && (
        <div className="invalid-feedback" style={{ fontSize: "11px" }}>
          {errors}
        </div>
      )}
    </Form.Group>
  );
};

export default CustomInput;
