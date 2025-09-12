import React from "react";
import { Form } from "react-bootstrap";

const CustomFileInput = ({
  label,
  name,
  onChange,
  onBlur,
  error,
  touched,
  accept = "image/*",
  required = false,
  size = "md", // optional size
  disabled = false,
  title
}) => {
  return (
    <Form.Group>
      {label && (
        <Form.Label htmlFor={name}>
          {label} {required && <span className="text-danger">*</span>}
        </Form.Label>
      )}
      <Form.Control
        type="file"
        id={name}
        name={name}
        accept={accept}
        onChange={onChange}
        onBlur={onBlur}
        className={touched && error ? "is-invalid" : ""}
        disabled={disabled}
        title={title}
      />
      {touched && error && (
        <div className="invalid-feedback" style={{ fontSize: "11px" }}>
          {error}
        </div>
      )}
    </Form.Group>
  );
};

export default CustomFileInput;
