import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Spinner,
  Form,
  Dropdown,
} from "react-bootstrap";
import api from "../../../../api/axios";

const SourceTrackList = () => {
  const [leads, setLeads] = useState([]);
  const [leadSources, setLeadSources] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSources, setLoadingSources] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  //  Fetch lead sources
  const fetchLeadSources = async () => {
    try {
      setLoadingSources(true);
      const res = await api.get("/api/v1/admin/leadSource/active");
      setLeadSources(res.data || []);
    } catch (err) {
      console.error("Error fetching lead sources:", err);
    } finally {
      setLoadingSources(false);
    }
  };

  // ✅ Fetch leads (backend filter)
  const fetchLeads = async () => {
    try {
      setLoading(true);

      let url = "/api/v1/admin/lead/leads_by_sources";
      if (selectedSources.length > 0) {
        url += `?sources=${selectedSources.join(",")}`;
      }

      const res = await api.get(url);

      const leads = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
        ? res.data.data
        : [];

      setLeads(leads);
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle checkbox select/unselect
  const handleSourceChange = (id) => {
    setSelectedSources((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchLeadSources();
    fetchLeads();
  }, []);

  return (
    <Card className="p-3">
      <Row className="mb-3">
        <Col>
          <h5>Filter by Lead Source</h5>
          <Dropdown
            show={showDropdown}
            onToggle={() => setShowDropdown(!showDropdown)}
          >
            <Dropdown.Toggle variant="primary" style={{ marginTop: "10px" }}>
              Select Lead
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ minWidth: "250px", padding: "10px" }}>
              {loadingSources ? (
                <div className="d-flex align-items-center p-2">
                  <Spinner animation="border" size="sm" className="me-2" />
                  Loading...
                </div>
              ) : (
                <>
                  {leadSources.map((src) => (
                    <Form.Check
                      key={src.id}
                      type="checkbox"
                      id={`src-${src.id}`}
                      label={src.lead_source}
                      checked={selectedSources.includes(src.id)}
                      onChange={() => handleSourceChange(src.id)}
                      className="mb-2"
                    />
                  ))}

                  <div className="d-flex justify-content-between mt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedSources([])}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        fetchLeads();
                        setShowDropdown(false);
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      <Row>
        <Col>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <p className="mt-2">Loading leads...</p>
            </div>
          ) : (
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Lead No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Lead Source</th>
                  <th>Customer Type</th>
                  <th>Priority</th>
                  <th>Last Call</th>
                  <th>Added By</th>
                </tr>
              </thead>
              <tbody>
                {leads.length > 0 ? (
                  leads.map((lead) => (
                    <tr key={lead.id}>
                      <td>{lead.lead_number}</td>
                      <td>{lead.name}</td>
                      <td>{lead.email}</td>
                      <td>{lead.contact}</td>
                      <td>{lead.leadSource?.lead_source || "-"}</td>
                      <td>{lead.customer_type}</td>
                      <td>{lead.priority}</td>
                      <td>
                        {new Date(lead.last_call).toLocaleDateString("en-GB")}{" "}
                      </td>

                      <td>{lead.addedBy?.name || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center">
                      No leads found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Card>
  );
};

export default SourceTrackList;
