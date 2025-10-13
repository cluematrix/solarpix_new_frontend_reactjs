import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import axios from "axios";

const InvCatAddEditModal = ({
  show,
  handleClose,
  roleName,
  setRoleName,
  errors,
  onSave,
  modalTitle,
  buttonLabel,
  loading,
  intraList,
  interList,
  selectedIntraId,
  setSelectedIntraId,
  selectedInterId,
  setSelectedInterId,
}) => {
  const [taxPreferenceList, setTaxPreferenceList] = useState([]);
  const [selectedTaxPrefId, setSelectedTaxPrefId] = useState("");
  const [selectedTaxPrefName, setSelectedTaxPrefName] = useState("");
  const [exemptionName, setExemptionName] = useState("");
  const [fetchingTaxPref, setFetchingTaxPref] = useState(false);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    const fetchTaxPreferences = async () => {
      setFetchingTaxPref(true);
      try {
        const res = await axios.get(
          "http://192.168.1.13:3000/api/v1/admin/taxPreference"
        );
        if (res.data.success) setTaxPreferenceList(res.data.data);
      } catch (error) {
        console.error("Failed to fetch tax preferences:", error);
      } finally {
        setFetchingTaxPref(false);
      }
    };

    fetchTaxPreferences();
  }, []);

  const handleTaxPreferenceChange = (e) => {
    const selectedId = e.target.value;
    setSelectedTaxPrefId(selectedId);

    const pref = taxPreferenceList.find(
      (item) => item.id.toString() === selectedId
    );
    setSelectedTaxPrefName(pref ? pref.name : "");

    // Reset dependent fields
    setExemptionName("");
    setSelectedIntraId("");
    setSelectedInterId("");
    setLocalError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation based on selected tax preference
    if (!roleName.trim()) {
      setLocalError("Inventory name is required");
      return;
    }

    if (!selectedTaxPrefId) {
      setLocalError("Please select a Tax Preference");
      return;
    }

    if (selectedTaxPrefName === "Taxable") {
      if (!selectedIntraId) {
        setLocalError("Please select Intra GST");
        return;
      }
      if (!selectedInterId) {
        setLocalError("Please select Inter GST");
        return;
      }
    }

    if (selectedTaxPrefName === "Non-Taxable") {
      if (!exemptionName.trim()) {
        setLocalError("Exemption Name is required");
        return;
      }
    }

    // Build payload
    const payload = {
      category: roleName,
      tax_preference_id: selectedTaxPrefId || null,
      intra_id:
        selectedTaxPrefName === "Taxable" ? selectedIntraId || null : null,
      inter_id:
        selectedTaxPrefName === "Taxable" ? selectedInterId || null : null,
      exemption_name:
        selectedTaxPrefName === "Non-Taxable" ? exemptionName.trim() : null,
    };

    onSave(payload);
    setLocalError(null);
  };

  return (
    <Modal centered show={show} onHide={handleClose} backdrop="static">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Inventory Name */}
          <Form.Group className="mb-3">
            <Form.Label className="custom-form-label">
              Inventory Name
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter inventory name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="custom-form-control"
            />
          </Form.Group>

          {/* Tax Preference */}
          <Form.Group className="mb-3">
            <Form.Label className="custom-form-label">
              Tax Preference
            </Form.Label>
            {fetchingTaxPref ? (
              <div>
                <Spinner animation="border" size="sm" /> Loading...
              </div>
            ) : (
              <Form.Select
                value={selectedTaxPrefId}
                onChange={handleTaxPreferenceChange}
                className="custom-form-control"
              >
                <option value="">Select Tax Preference</option>
                {taxPreferenceList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Form.Select>
            )}
          </Form.Group>

          {/* Taxable → Show GST dropdowns */}
          {selectedTaxPrefName === "Taxable" && (
            <>
              <Form.Group className="mb-3">
                <Form.Label className="custom-form-label">Intra GST</Form.Label>
                <Form.Select
                  value={selectedIntraId}
                  onChange={(e) => setSelectedIntraId(e.target.value)}
                  className="custom-form-control"
                >
                  <option value="">Select Intra GST</option>
                  {intraList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.intra_per}%)
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="custom-form-label">Inter GST</Form.Label>
                <Form.Select
                  value={selectedInterId}
                  onChange={(e) => setSelectedInterId(e.target.value)}
                  className="custom-form-control"
                >
                  <option value="">Select Inter GST</option>
                  {interList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.intra_per}%)
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </>
          )}

          {/* Non-Taxable → Show Exemption Name */}
          {selectedTaxPrefName === "Non-Taxable" && (
            <Form.Group className="mb-3">
              <Form.Label className="custom-form-label">
                Exemption Name
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter exemption name"
                value={exemptionName}
                onChange={(e) => setExemptionName(e.target.value)}
                className="custom-form-control"
              />
            </Form.Group>
          )}

          {/* Error message */}
          {(localError || errors) && (
            <p className="errors-text text-danger mt-2">
              {localError || errors}
            </p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button disabled={loading} variant="primary" type="submit">
            {loading ? "Saving..." : buttonLabel}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default InvCatAddEditModal;
