import React, { useState, useEffect } from "react";
import { Modal, Table, Spinner, Form, Button } from "react-bootstrap";
import api from "../../../../../api/axios";

const SrNoModal = ({
  show,
  handleClose,
  branch_id,
  stock_material_id,
  selectedSrNos = [],
  onSelectionChange, // callback to parent
  formik, // pass your useFormik instance
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(selectedSrNos);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch SrNos
  const fetchSrNos = async (page = 1) => {
    try {
      setLoading(true);
      // fetch SrNos from backend
      const res = await api.get(
        `/api/v1/admin/stockMaterialSrNo/branchIdStockId/${branch_id}/${stock_material_id}/available/pagination?page=${page}&limit=${itemsPerPage}`
      );
      setData(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching SrNos:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      fetchSrNos();
      setSelected(selectedSrNos); // restore previous selection
    }
  }, [show]);

  const handleCheckboxChange = (srNo) => {
    let updated;
    if (selected.includes(srNo)) {
      updated = selected.filter((item) => item !== srNo);
    } else {
      updated = [...selected, srNo];
    }
    setSelected(updated);
    onSelectionChange(updated);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allSrNos = data.map((d) => d.serialNumber);
      setSelected(allSrNos);
      onSelectionChange(allSrNos);
    } else {
      setSelected([]);
      onSelectionChange([]);
    }
  };

  const allSelected = data.length > 0 && selected.length === data.length;

  // 🔹 Instead of API, save in formik.values.item_details
  const handleSave = () => {
    const existingCategories =
      formik.values.item_details?.selectedCategories || [];

    // Filter data rows where serialNumber is selected
    const selectedItems = data.filter((d) => selected.includes(d.serialNumber));

    console.log("selectedItems", selectedItems);
    // Group by stock_material_id (so multiple SrNos of same material go together)
    const grouped = selectedItems.reduce((acc, item) => {
      const key = item.stock_material_id;
      if (!acc[key]) {
        acc[key] = {
          id: item.stock_material_id,
          branch_id: item.branch_id,
          name: item.stock_material?.material || "Material",
          items: [
            {
              id: item.stock_material_id,
              name: item.stock_material?.material || "Material",
              serialNumbers: [item.serialNumber],
            },
          ],
        };
      } else {
        acc[key].items[0].serialNumbers.push(item.serialNumber);
      }
      return acc;
    }, {});

    // Merge with existing categories (remove previous category with same id)
    Object.values(grouped).forEach((cat) => {
      const idx = existingCategories.findIndex((c) => c.id === cat.id);
      if (idx > -1) {
        existingCategories[idx] = cat;
      } else {
        existingCategories.push(cat);
      }
    });

    formik.setFieldValue("item_details.selectedCategories", existingCategories);

    handleClose(); // close modal
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Select Serial Numbers</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover>
              <thead className="table-light">
                <tr>
                  <th>
                    <Form.Check
                      type="checkbox"
                      checked={allSelected}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Sr. No.</th>
                  <th>Serial Number</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={item.id}>
                      <td>
                        <Form.Check
                          type="checkbox"
                          disabled={item.isUsed} // disable if already used
                          checked={selected.includes(item.serialNumber)}
                          onChange={() =>
                            handleCheckboxChange(item.serialNumber)
                          }
                        />
                      </td>
                      <td>{index + 1}</td>
                      <td>{item.serialNumber}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No serial numbers found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={selected.length === 0 || formik.isSubmitting}
        >
          {formik.isSubmitting ? "Loading" : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SrNoModal;
