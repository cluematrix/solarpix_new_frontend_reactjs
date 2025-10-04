import React from "react";
import { Form, InputGroup } from "react-bootstrap";

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
  min,
  readOnly = false,
  disabled = false,
  title,
  Icon, // ✅ Icon prop accept karega (React component)
  iconPosition = "left", // optional: "left" or "right"
  nameIcon,
}) => {
  return (
    <Form.Group>
      {label && (
        <Form.Label>
          {label} {required && <span className="text-danger">*</span>}
        </Form.Label>
      )}

      {/* ✅ Wrap input in InputGroup */}
      <InputGroup>
        {/* Left Icon */}
        {Icon && iconPosition === "left" && (
          <InputGroup.Text style={{ padding: "0px 5px" }}>
            <Icon size={16} />
          </InputGroup.Text>
        )}

        {nameIcon && iconPosition === "left" && (
          <InputGroup.Text
            style={{
              padding: "0rem .5rem",
              fontSize: "13px",
              backgroundColor: "lightgray",
              color: "black",
            }}
          >
            <>{nameIcon}</>
          </InputGroup.Text>
        )}
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
          readOnly={readOnly}
          disabled={disabled}
          style={{ color: "black", cursor: disabled && "not-allowed" }}
          title={title}
        />

        {/* Right Icon */}
        {Icon && iconPosition === "right" && (
          <InputGroup.Text>
            <Icon size={16} />
          </InputGroup.Text>
        )}
        {nameIcon && iconPosition === "right" && (
          <InputGroup.Text style={{ padding: "0rem .7rem", fontSize: "10px" }}>
            <>{nameIcon}</>
          </InputGroup.Text>
        )}
      </InputGroup>

      {touched && errors && (
        <div className="invalid-feedback" style={{ fontSize: "11px" }}>
          {errors}
        </div>
      )}
    </Form.Group>
  );
};

export default CustomInput;
