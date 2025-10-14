import React, { useRef, useEffect, useState } from "react";
import { Modal, Button, Table, Row, Col } from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import api from "../../../../api/axios"; // Axios instance

const PurchaseOrderModal = ({ show, handleClose, deal }) => {
  const modalContentRef = useRef(null);
  const [employees, setEmployees] = useState([]);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    if (show) {
      // Fetch active employees
      api
        .get("/api/v1/admin/employee/active")
        .then((res) => setEmployees(res.data.data || []))
        .catch((err) => console.error("Error fetching employees:", err));

      // Fetch company master
      api
        .get("/api/v1/admin/companyMaster")
        .then((res) => {
          const companyData = res.data?.data?.[0];
          setCompany(companyData);
        })
        .catch((err) => console.error("Error fetching company:", err));
    }
  }, [show]);

  if (!deal) return null;

  // Destructure and fallback logic
  const purchaseOrderNo = deal.purchase_order_no || "N/A";
  const date = deal.date
    ? new Date(deal.date).toLocaleDateString("en-GB")
    : "DD/MM/YYYY";

  const deliveryDate = deal.delivery_date
    ? new Date(deal.delivery_date).toLocaleDateString("en-GB")
    : "N/A";

  const client = deal.Client || {};
  const supplier = deal.supplierManagement || {};
  const tds = deal.TDS || {};
  const paymentTerms = deal.paymentTerms?.payment_term || "N/A";
  const notes = deal.notes_customer || "";
  const total = Number(deal.total || 0);
  const subTotal = Number(deal.sub_total || 0);
  const adjustment = Number(deal.adjustment || 0);
  const deductionAmount = Number(deal.deductionAmount || 0);

  const items =
    deal.item_details?.selectedCategories?.flatMap((category) =>
      category.items.map((item, index) => ({
        ...item,
        categoryName: category.name,
        srNo: index + 1,
        interTax: category.interTax,
        intraTax: category.intraTax,
      }))
    ) || [];

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

        pdf.save(`purchase-order-${purchaseOrderNo}.pdf`);
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        alert("Failed to generate PDF. Please try again.");
      });
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);

  console.log("company", company);
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="xl"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Purchase Order</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div
          className="p-3 border bg-white"
          ref={modalContentRef}
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            color: "#333",
          }}
        >
          {/* Header with dynamic company info */}
          <Row className="align-items-center border-bottom pb-2 mb-2">
            <Col xs={8}>
              {company ? (
                <>
                  <h6 className="fw-bold">{company.name}</h6>
                  <div>
                    Address: {company.address}, {company.city}, {company.state}{" "}
                    - {company.pincode}
                  </div>
                  <div>
                    Phone: {company.mobile1}
                    {company.mobile2 ? ` / ${company.mobile2}` : ""}
                  </div>
                  <div>Email: {company.email}</div>
                  <div>GSTIN: {company.GSTno}</div>
                  <div>State: {company.state}</div>
                </>
              ) : (
                <div>Loading company info...</div>
              )}
            </Col>
            <Col xs={4} className="text-end">
              {company?.logo && (
                <img
                  src={company.logo}
                  alt="Company Logo"
                  style={{ maxWidth: "100px" }}
                />
              )}
            </Col>
          </Row>

          {/* Title */}
          <div className="bg-primary text-white text-center fw-bold py-2 mb-3">
            PURCHASE ORDER
          </div>

          {/* Supplier & PO Info */}
          <Row className="mb-3">
            <Col xs={6}>
              <h6 className="fw-bold">Supplier Details:</h6>
              <div>
                <strong>Name:</strong> {supplier.name || "N/A"}
              </div>
              <div>
                <strong>Company:</strong> {supplier.company_name || "N/A"}
              </div>
              <div>
                <strong>Address:</strong>{" "}
                {`${supplier.billing_address || ""}, ${
                  supplier.billing_city || ""
                }, ${supplier.billing_state || ""} - ${
                  supplier.billing_pincode || ""
                }`}
              </div>
              <div>
                <strong>Phone:</strong> {supplier.billing_phone || "N/A"}
              </div>
              <div>
                <strong>Email:</strong> {supplier.email || "N/A"}
              </div>
              <div>
                <strong>GSTIN:</strong> {supplier.GSTIN || "N/A"}
              </div>
            </Col>
            <Col xs={6}>
              <div className="text-end">
                <h6 className="fw-bold">Purchase Order Details</h6>
                <div>
                  <strong>PO No:</strong> {purchaseOrderNo}
                </div>
                <div>
                  <strong>Date:</strong> {date}
                </div>
                <div>
                  <strong>Delivery Date:</strong> {deliveryDate}
                </div>
                <div>
                  <strong>Payment Terms:</strong> {paymentTerms}
                </div>
                <div>
                  <strong>Reference:</strong> {deal.reference || "N/A"}
                </div>
              </div>
            </Col>
          </Row>

          {/* Bill To */}
          <Row className="mb-3">
            <Col xs={12}>
              <h6 className="fw-bold">Bill To:</h6>
              <div>
                <strong>Name:</strong> {client.name || "N/A"}
              </div>
              <div>
                <strong>Email:</strong> {client.email || "N/A"}
              </div>
            </Col>
          </Row>

          {/* Items Table */}
          <Table bordered size="sm" className="align-middle text-center mb-3">
            <thead className="table-light">
              <tr>
                <th>Sr No</th>
                <th>Category</th>
                <th>Item Name</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.srNo}</td>
                  <td>{item.categoryName}</td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(Number(item.price))}</td>
                  <td>{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Taxes (if applicable) */}
          {items.length > 0 && items[0].interTax && (
            <div className="mb-2">
              <small>
                <strong>Taxes Applied:</strong> Inter-State (
                {items[0].interTax.name}: {items[0].interTax.inter_per}%),
                Intra-State ({items[0].intraTax.name}:{" "}
                {items[0].intraTax.intra_per}%)
              </small>
            </div>
          )}

          {/* Totals */}
          <Row className="justify-content-end">
            <Col xs={6}>
              <Table bordered size="sm">
                <tbody>
                  <tr>
                    <td>
                      <strong>Sub Total</strong>
                    </td>
                    <td className="text-end">{formatCurrency(subTotal)}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>
                        TDS ({tds.name || "N/A"}: {tds.percentage || "0"}%)
                      </strong>
                    </td>
                    <td className="text-end fw-bold">
                      {formatCurrency(deductionAmount)}
                    </td>
                  </tr>
                  {adjustment !== 0 && (
                    <tr>
                      <td>Adjustment</td>
                      <td className="text-end">{formatCurrency(adjustment)}</td>
                    </tr>
                  )}
                  <tr className="table-light">
                    <td>
                      <strong>Total Amount</strong>
                    </td>
                    <td className="text-end fw-bold">
                      {formatCurrency(total)}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>

          {/* Notes & Terms */}
          {notes && (
            <div className="mt-3">
              <h6 className="fw-bold">Notes:</h6>
              <p>{notes}</p>
            </div>
          )}
          <div className="mt-3">
            <h6 className="fw-bold">Terms & Conditions</h6>
            <p style={{ fontSize: "13px" }}>
              1. Please deliver the goods as per the specified delivery date.
              <br />
              2. All items must meet quality standards and specifications.
              <br />
              3. Payment will be made as per agreed payment terms.
              <br />
              4. TDS will be deducted as applicable.
            </p>
          </div>

          {/* Footer */}
          <Row className="mt-4">
            <Col className="text-end">
              <div className="fw-bold">Authorized Signatory</div>
              <div style={{ marginTop: "50px" }}>
                {company?.name || "Company"}
              </div>
            </Col>
          </Row>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handleDownload}>
          Download PDF
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PurchaseOrderModal;
