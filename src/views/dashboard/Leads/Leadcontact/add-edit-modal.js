import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Row, Col, Spinner } from "react-bootstrap";
import api from "../../../../api/axios";

const AddEditModal = ({
  show,
  handleClose,
  onSave,
  formData,
  setFormData,
  editData,
}) => {
  const [leadSources, setLeadSources] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDropdowns = async () => {
    try {
      setLoading(true);
      const [leadRes, empRes] = await Promise.all([
        api.get("/api/v1/admin/leadSource/active"),
        api.get("/api/v1/admin/employee/active"),
      ]);

      setLeadSources(leadRes.data || []);
      if (Array.isArray(empRes.data?.data)) setEmployees(empRes.data.data);
    } catch (err) {
      console.error("Error fetching dropdown data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) fetchDropdowns();
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{editData ? "Edit Lead" : "Add Lead"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-3">
            <Spinner animation="border" />
          </div>
        ) : (
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
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Row 2 */}
            <Row className="mt-2">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">Contact</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">Lead Source</Form.Label>
                  <Form.Select
                    name="leadSource"
                    value={formData.leadSource}
                    onChange={handleChange}
                  >
                    <option value="">Select Lead Source</option>
                    {leadSources.map((src) => (
                      <option key={src.id} value={src.id}>
                        {src.lead_source}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">Added By</Form.Label>
                  <Form.Select
                    name="addedBy"
                    value={formData.addedBy}
                    onChange={handleChange}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Row 3 */}
            <Row className="mt-2">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="pt-4">Lead Owner</Form.Label>
                  <Form.Select
                    name="leadOwner"
                    value={formData.leadOwner}
                    onChange={handleChange}
                  >
                    <option value="">Select Owner</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="pt-4">City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Row 4 */}
            <Row className="mt-2">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">State</Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">Pincode</Form.Label>
                  <Form.Control
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="pt-4">Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Row 5 */}
            <Row className="mt-2">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="pt-4">Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
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
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AddEditModal;
