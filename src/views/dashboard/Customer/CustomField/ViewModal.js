import React, { useEffect, useState } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import api from "../../../../api/axios";
import { errorToast } from "../../../../components/Toast/errorToast";

const ViewModal = ({ show, handleClose, item }) => {
  const [metaData, setMetaData] = useState({
    unitData: [],
    taxPreferenceData: [],
    venderData: [],
    invCatData: [],
    invTypeData: [],
    warehouse: [],
    intraTaxData: [],
    interTaxData: [],
    custData: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [
          unitRes,
          taxPrefRes,
          vendorRes,
          invCatRes,
          invTypeRes,
          warehouseRes,
          intraTaxRes,
          interTaxRes,
          custRes,
        ] = await Promise.all([
          api.get("/api/v1/admin/unit"),
          api.get("/api/v1/admin/taxPreference/active"),
          api.get("/api/v1/admin/supplierManagement/active"),
          api.get("/api/v1/admin/inventoryCategory/active"),
          api.get(
            "/api/v1/admin/inventoryType/active/pagination?page=1&limit=10"
          ),
          api.get("/api/v1/admin/branch"),
          api.get("/api/v1/admin/intraTax/active"),
          api.get("/api/v1/admin/interTax/active"),
          api.get("/api/v1/admin/client/active"),
        ]);

        setMetaData({
          unitData: unitRes?.data?.data?.filter((e) => e.isActive) || [],
          taxPreferenceData: taxPrefRes.data.data || [],
          venderData: vendorRes.data || [],
          invCatData: invCatRes.data || [],
          invTypeData: invTypeRes.data.data || [],
          warehouse: warehouseRes.data.data || [],
          intraTaxData: intraTaxRes.data.data || [],
          interTaxData: interTaxRes.data.data || [],
          custData: custRes.data.data || [],
        });
      } catch (error) {
        errorToast("Error loading metadata");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (show) {
      fetchAll();
    }
  }, [show]);

  if (!item) return null;

  const taxPrefName = metaData.taxPreferenceData.find(
    (d) => d.id === item.tax_preference_id
  )?.name;

  const getLabel = (key, dataArray, labelKey = "name", valueKey = "id") => {
    const found = dataArray.find((d) => d[valueKey] === item[key]);
    return found ? found[labelKey] : "N/A";
  };

  if (loading) {
    return (
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>View Stock Material</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Loading...</div>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>View Stock Material</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Type</Form.Label>
              <p>{item.type || "N/A"}</p>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Direct Send</Form.Label>
              <p>{item.direct_send || "N/A"}</p>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>
                {item.direct_send === "Warehouse" ? "Warehouse" : "Customer"}
              </Form.Label>
              <p>
                {item.direct_send === "Warehouse"
                  ? getLabel(
                      "branch_id",
                      metaData.warehouse,
                      "branch_name",
                      "id"
                    )
                  : getLabel("client_id", metaData.custData, "name", "id")}
              </p>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Inventory Category</Form.Label>
              <p>
                {getLabel(
                  "inventory_category_id",
                  metaData.invCatData,
                  "category",
                  "id"
                )}
              </p>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Inventory Type</Form.Label>
              <p>
                {getLabel(
                  "inventoryType_id",
                  metaData.invTypeData,
                  "type",
                  "id"
                )}
              </p>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Material Name</Form.Label>
              <p>{item.material || "N/A"}</p>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>
                {item.type === "Goods" ? "HSN Code" : "SAC Code"}
              </Form.Label>
              <p>{item.type === "Goods" ? item.hsc_code : item.sac || "N/A"}</p>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Unit</Form.Label>
              <p>{getLabel("unit_id", metaData.unitData, "unit", "id")}</p>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Tax Preference</Form.Label>
              <p>
                {getLabel(
                  "tax_preference_id",
                  metaData.taxPreferenceData,
                  "name",
                  "id"
                )}
              </p>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          {taxPrefName?.toLowerCase() === "non-taxable" && (
            <Col md={4}>
              <Form.Group>
                <Form.Label>Exemption Reason</Form.Label>
                <p>{item.exemption_reason || "N/A"}</p>
              </Form.Group>
            </Col>
          )}
          <Col md={4}>
            <Form.Group>
              <Form.Label>Balance</Form.Label>
              <p>{item.balance || "N/A"}</p>
            </Form.Group>
          </Col>
          {/* <Col md={4}>
            <Form.Group>
              <Form.Label>Serial Numbers</Form.Label>
              {item.serialNumbers && item.serialNumbers.length > 0 ? (
                <ul>
                  {item.serialNumbers.map((sn, idx) => (
                    <li key={idx}>{sn}</li>
                  ))}
                </ul>
              ) : (
                <p>N/A</p>
              )}
            </Form.Group>
          </Col> */}
        </Row>
        <hr />

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Sales Information</Form.Label>
              <p>{item.type_sales_info ? "Yes" : "No"}</p>
            </Form.Group>
            <Form.Group>
              <Form.Label>Selling Price</Form.Label>
              <p>INR {item.sales_info_selling_price || "N/A"}</p>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Purchase Information</Form.Label>
              <p>{item.type_purchase_info ? "Yes" : "No"}</p>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cost Price</Form.Label>
              <p>INR {item.purchase_info_cost_price || "N/A"}</p>
            </Form.Group>
            <Form.Group>
              <Form.Label>Preferred Vendor</Form.Label>
              <p>
                {getLabel(
                  "purchase_info_vendor_id",
                  metaData.venderData,
                  "name",
                  "id"
                )}
              </p>
            </Form.Group>
          </Col>
        </Row>
        <hr />

        {taxPrefName?.toLowerCase() !== "non-taxable" && (
          <Row className="mb-3">
            <h6 className="mb-3">Default Tax Rates</h6>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Intra State Tax Rate</Form.Label>
                <p>
                  {getLabel(
                    "intra_state_tax_rate_id",
                    metaData.intraTaxData,
                    "name",
                    "id"
                  )}
                  {metaData.intraTaxData.find(
                    (d) => d.id === item.intra_state_tax_rate_id
                  )?.intra_per
                    ? ` (${
                        metaData.intraTaxData.find(
                          (d) => d.id === item.intra_state_tax_rate_id
                        ).intra_per
                      }%)`
                    : ""}
                </p>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Inter State Tax Rate</Form.Label>
                <p>
                  {getLabel(
                    "inter_state_tax_rate_id",
                    metaData.interTaxData,
                    "name",
                    "id"
                  )}
                  {metaData.interTaxData.find(
                    (d) => d.id === item.inter_state_tax_rate_id
                  )?.inter_per
                    ? ` (${
                        metaData.interTaxData.find(
                          (d) => d.id === item.inter_state_tax_rate_id
                        ).inter_per
                      }%)`
                    : ""}
                </p>
              </Form.Group>
            </Col>
          </Row>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewModal;
