// Created by: Sufyan 26 Sep 2025

import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import CustomInput from "../../../../../components/Form/CustomInput";
import CustomFileInput from "../../../../../components/Form/CustomFileInput";

const AddProjectNp = ({ formik, NpField, handleDynamicChangeNp }) => {
  return (
    <Form>
      <div className="mb-3 mt-3 fw-light">
        <h6>Nodal Point Information: </h6>
      </div>

      <Row className="mt-3 mb-4">
        {NpField.length > 0 ? (
          NpField.map((field) => (
            <Col md={4} key={field.id} className="mb-3">
              {field.data_type === "text" && (
                <CustomInput
                  label={field.label}
                  name={`np_dynamic_fields.${field.field_name}`}
                  value={
                    formik.values.np_dynamic_fields?.[field.field_name] || ""
                  }
                  onChange={(e) =>
                    handleDynamicChangeNp(field.field_name, e.target.value)
                  }
                  placeholder={`Enter ${field.label}`}
                />
              )}

              {field.data_type === "number" && (
                <CustomInput
                  type="number"
                  label={field.label}
                  name={`np_dynamic_fields.${field.field_name}`}
                  value={
                    formik.values.np_dynamic_fields?.[field.field_name] || ""
                  }
                  onChange={(e) =>
                    handleDynamicChangeNp(field.field_name, e.target.value)
                  }
                  placeholder={`Enter ${field.label}`}
                />
              )}

              {(field.data_type === "pdf" || field.data_type === "image") && (
                <CustomFileInput
                  label={`${field.label} (${
                    field.data_type === "pdf" ? "PDF" : "Image"
                  })`}
                  name={`np_dynamic_fields.${field.field_name}`}
                  accept={
                    field.data_type === "pdf" ? "application/pdf" : "image/*"
                  }
                  onChange={(e) =>
                    handleDynamicChangeNp(
                      field.field_name,
                      e.currentTarget.files[0]
                    )
                  }
                />
              )}
            </Col>
          ))
        ) : (
          <Col>
            <p className="text-muted">No dynamic fields configured.</p>
          </Col>
        )}
      </Row>
    </Form>
  );
};

export default AddProjectNp;
