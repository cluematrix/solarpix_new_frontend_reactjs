import React from "react";
import { Form } from "react-bootstrap";

const CustomCheckbox = ({
  label,
  name,
  checked = false,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
}) => {
  return (
    <Form.Group>
      <Form.Check
        type="checkbox"
        name={name}
        id={name}
        label={
          <>
            {label} {required && <span className="text-danger">*</span>}
          </>
        }
        checked={checked}
        onChange={onChange}
        onBlur={onBlur}
        className={touched && error ? "is-invalid" : ""}
      />
      {touched && error && (
        <div className="invalid-feedback" style={{ fontSize: "11px" }}>
          {error}
        </div>
      )}
    </Form.Group>
  );
};

export default CustomCheckbox;
