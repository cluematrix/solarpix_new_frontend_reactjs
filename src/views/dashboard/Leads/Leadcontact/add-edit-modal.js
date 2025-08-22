import React from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const AddEditModal = ({
  show,
  handleClose,
  onSave,
  formData,
  setFormData,
  editData,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editData ? "Edit Lead" : "Add Lead"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Row 1 */}
            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="pt-4">Salutation</Form.Label>
                  <Form.Select
                    name="salutation"
                    value={formData.salutation}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={5}>
                <Form.Group>
                  <Form.Label className="pt-4">
                    Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email will be used to send proposals"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Row 2 */}
            <Row className="mt-2">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">Lead Source</Form.Label>
                  <Form.Control
                    type="text"
                    name="leadSource"
                    value={formData.leadSource}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">Added By</Form.Label>
                  <Form.Control
                    type="text"
                    name="addedBy"
                    value={formData.addedBy}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">Lead Owner</Form.Label>
                  <Form.Control
                    type="text"
                    name="leadOwner"
                    value={formData.leadOwner}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Row 3 */}
            <Row className="mt-2">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">Deal Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="dealName"
                    value={formData.dealName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">Pipeline *</Form.Label>
                  <Form.Control
                    type="text"
                    name="pipeline"
                    value={formData.pipeline}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">Deal Stage *</Form.Label>
                  <Form.Control
                    type="text"
                    name="dealStage"
                    value={formData.dealStage}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Row 4 */}
            <Row className="mt-2">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">Deal Value (INR)</Form.Label>
                  <Form.Control
                    type="number"
                    name="dealValue"
                    value={formData.dealValue}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">Close Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="closeDate"
                    value={formData.closeDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">Deal Category</Form.Label>
                  <Form.Control
                    type="text"
                    name="dealCategory"
                    value={formData.dealCategory}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Row 5 */}
            <Row className="mt-2">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">Deal Agent</Form.Label>
                  <Form.Control
                    type="text"
                    name="dealAgent"
                    value={formData.dealAgent}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">Products</Form.Label>
                  <Form.Control
                    type="text"
                    name="products"
                    value={formData.products}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">Deal Watcher</Form.Label>
                  <Form.Control
                    type="text"
                    name="dealWatcher"
                    value={formData.dealWatcher}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="text-end mt-3">
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="ms-2">
                Submit
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddEditModal;
