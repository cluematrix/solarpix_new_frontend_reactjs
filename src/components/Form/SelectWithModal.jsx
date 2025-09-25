import React, { useState } from "react";
import { Badge, Button, Form, Modal } from "react-bootstrap";

const SelectWithModal = ({ 
  label,              // UI label (e.g. "Coordinate Members")
  formik,             // formik instance
  formikField,        // field name in formik (e.g. "co_ordinate")
  options,            // list of available options (array of {id, name})
  optionLabel = "name" // which field to display in label (default: name)
}) => {
  const [showModal, setShowModal] = useState(false);

  const toggleSelection = (id) => {
    const current = formik.values[formikField] || [];
    const alreadySelected = current.includes(id);
    if (alreadySelected) {
      formik.setFieldValue(
        formikField,
        current.filter((m) => m !== id)
      );
    } else {
      formik.setFieldValue(formikField, [...current, id]);
    }
  };

  const selectedNames = options
    .filter((m) => (formik.values[formikField] || []).includes(m.id))
    .map((m) => m[optionLabel]);

  return (
    <Form.Group>
      <Form.Label className="pt-4">{label}</Form.Label>
      <div>
        {selectedNames.length > 0 ? (
          selectedNames.map((name) => (
            <Badge key={name} bg="light" text="dark" className="me-2 p-1">
              {name}
            </Badge>
          ))
        ) : (
          <p className="text-muted" style={{ fontSize: "13px" }}>
            No {label.toLowerCase()} selected
          </p>
        )}
      </div>
      <Button size="sm" className="mt-2" onClick={() => setShowModal(true)}>
        Select {label}
      </Button>
      {formik.touched[formikField] && formik.errors[formikField] && (
        <div className="text-danger mt-1" style={{ fontSize: "11px" }}>
          {formik.errors[formikField]}
        </div>
      )}

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select {label}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {options?.map((opt) => (
            <Form.Check
              key={opt.id}
              type="checkbox"
              label={opt[optionLabel]}
              checked={(formik.values[formikField] || []).includes(opt.id)}
              onChange={() => toggleSelection(opt.id)}
            />
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Save Selection
          </Button>
        </Modal.Footer>
      </Modal>
    </Form.Group>
  );
};

export default SelectWithModal;
