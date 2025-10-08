// src/views/dashboard/InventoryManagement/StockMaterial/ViewModal.js
import React, { useRef, useEffect, useState } from "react";
import { Modal, Button, Row, Col, Table } from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../../../assets/images/logo/main_logo.jpg";
import api from "../../../../api/axios";
import { errorToast } from "../../../../components/Toast/errorToast";

const ModalQuatation = ({ show, handleClose, item }) => {
  const modalContentRef = useRef(null);
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
    brandData: [],
    stockNameData: [],
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
          brandRes,
          stockNameRes,
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
          api.get("/api/v1/admin/brand/active"),
          api.get("/api/v1/admin/stockName/active"),
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
          brandData: brandRes.data || [],
          stockNameData: stockNameRes.data.data || stockNameRes.data || [],
        });
      } catch (error) {
        errorToast("Error loading metadata");
        console.error("Error fetching metadata:", error);
      } finally {
        setLoading(false);
      }
    };

    if (show) fetchAll();
  }, [show]);

  const handleDownload = () => {
    const input = modalContentRef.current;
    html2canvas(input, { scale: 2, useCORS: true })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = 210;
        const pageHeight = 297;
        const marginX = 10;
        const marginY = 10;
        const usableWidth = pageWidth - marginX * 2;

        const imgHeight = (canvas.height * usableWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = marginY;

        pdf.addImage(imgData, "PNG", marginX, position, usableWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight + marginY;
          pdf.addPage();
          pdf.addImage(
            imgData,
            "PNG",
            marginX,
            position,
            usableWidth,
            imgHeight
          );
          heightLeft -= pageHeight;
        }

        pdf.save("StockMaterial.pdf");
      })
      .catch((err) => {
        console.error("PDF Error:", err);
        alert("Failed to generate PDF. Please try again.");
      });
  };

  const getLabel = (key, dataArray, labelKey = "name", valueKey = "id") => {
    const found = dataArray.find((d) => d[valueKey] === item?.[key]);
    return found ? found[labelKey] : "N/A";
  };

  if (!item) return null;

  if (loading)
    return (
      <Modal show={show} onHide={handleClose} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Stock Material Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>Loading...</Modal.Body>
      </Modal>
    );

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Stock Material Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          ref={modalContentRef}
          className="p-3 border bg-white"
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "13px",
            color: "#333",
          }}
        >
          {/* Header */}
          <Row className="align-items-center border-bottom pb-2 mb-3">
            <Col xs={8}>
              <h6 className="fw-bold">Solarpix Energy Pvt. Ltd.</h6>
              <div>312, Ratan Apt no 3, Ganeshpeth, Nagpur - 440018</div>
              <div>Phone: 9096941011 / 9552383397</div>
              <div>Email: office.solarpix@gmail.com</div>
              <div>GSTIN: 27ABCDE1234F1Z5</div>
            </Col>
            <Col xs={4} className="text-end">
              <img src={logo} alt="Logo" style={{ maxWidth: "80px" }} />
            </Col>
          </Row>

          {/* Section Title */}
          <div className="bg-primary text-white text-center fw-bold py-1 mb-3">
            Stock Material Information
          </div>

          {/* Material Info */}
          <Table bordered size="sm" className="align-middle">
            <tbody>
              <tr>
                <th>Quotation No</th>
                <td>{item.short_code || "N/A"}</td>
                <th>Type</th>
                <td>{item.type || "N/A"}</td>
                <th>Direct Send</th>
                <td>{item.direct_send || "N/A"}</td>
              </tr>
              <tr>
                <th>
                  {item.direct_send === "Warehouse" ? "Warehouse" : "Customer"}
                </th>
                <td colSpan={2}>
                  {item.direct_send === "Warehouse"
                    ? getLabel(
                        "branch_id",
                        metaData.warehouse,
                        "branch_name",
                        "id"
                      )
                    : getLabel("client_id", metaData.custData, "name", "id")}
                </td>
                <th>Stock Name</th>
                <td colSpan={2}>
                  {getLabel(
                    "stock_name_id",
                    metaData.stockNameData,
                    "name",
                    "id"
                  )}
                </td>
              </tr>
              <tr>
                <th>Make</th>
                <td>
                  {getLabel("brand_id", metaData.brandData, "brand_name", "id")}
                </td>
                <th>{item.type === "Goods" ? "HSN Code" : "SAC Code"}</th>
                <td>{item.hsc_code || item.sac || "N/A"}</td>
                <th>Unit</th>
                <td>{getLabel("unit_id", metaData.unitData, "unit", "id")}</td>
              </tr>
              <tr>
                <th>Tax Preference</th>
                <td>
                  {getLabel(
                    "tax_preference_id",
                    metaData.taxPreferenceData,
                    "name",
                    "id"
                  )}
                </td>
                <th>Balance</th>
                <td>{item.balance || "N/A"}</td>
                <th>Vendor</th>
                <td>
                  {getLabel(
                    "purchase_info_vendor_id",
                    metaData.venderData,
                    "name",
                    "id"
                  )}
                </td>
              </tr>
            </tbody>
          </Table>

          {/* Price Info */}
          <div className="mt-3">
            <h6 className="fw-bold">Pricing Information</h6>
            <Table bordered size="sm">
              <tbody>
                <tr>
                  <th>Selling Price</th>
                  <td>₹ {item.sales_info_selling_price || "N/A"}</td>
                  <th>Cost Price</th>
                  <td>₹ {item.purchase_info_cost_price || "N/A"}</td>
                </tr>
              </tbody>
            </Table>
          </div>

          {/* Tax Info */}
          <div className="mt-3">
            <h6 className="fw-bold">Default Tax Rates</h6>
            <Table bordered size="sm">
              <tbody>
                <tr>
                  <th>Intra State Tax Rate</th>
                  <td>
                    {getLabel(
                      "intra_state_tax_rate_id",
                      metaData.intraTaxData,
                      "name",
                      "id"
                    )}
                  </td>
                  <th>Inter State Tax Rate</th>
                  <td>
                    {getLabel(
                      "inter_state_tax_rate_id",
                      metaData.interTaxData,
                      "name",
                      "id"
                    )}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>

          {/* Footer */}
          <Row className="mt-4">
            <Col className="text-end">
              <div className="fw-bold">For Solarpix Energy Pvt. Ltd.</div>
              <div style={{ marginTop: "50px" }}>Authorized Signatory</div>
            </Col>
          </Row>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handleDownload}>
          Download PDF
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalQuatation;
