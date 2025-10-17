import React, { useEffect, useState } from "react";
import { Col, Modal, Row, Table, Button, Form } from "react-bootstrap";
import api from "../../../../api/axios";
import { errorToast } from "../../../../components/Toast/errorToast";
import { successToast } from "../../../../components/Toast/successToast";

const AddPurchaseOrderModal = ({
  show,
  handleClose,
  onSave,
  existingData,
  formik,
}) => {
  const [loadingCat, setLoadingCat] = useState(false);
  const [intCategory, setIntCategory] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [allItems, setAllItems] = useState([]);

  // Serial modal state
  const [serialModal, setSerialModal] = useState({
    show: false,
    item: null,
    serials: [],
  });

  // Fetch categories
  const fetchIntCategory = async () => {
    try {
      setLoadingCat(true);
      const res = await api.get("/api/v1/admin/inventoryCategory/active");
      const data = (res.data || []).map((cat) => ({
        ...cat,
        selected:
          existingData?.selectedCategories?.some((c) => c.id === cat.id) ||
          false,
      }));
      setIntCategory(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoadingCat(false);
    }
  };

  // Fetch items
  const fetchAllItems = async () => {
    try {
      setLoadingItems(true);
      const res = await api.get("/api/v1/admin/stockMaterial/active");
      const dataWithExtras = res.data.map((item) => {
        const existingItem = existingData?.selectedCategories
          ?.flatMap((c) => c.items)
          .find((i) => i.id === item.id);

        return {
          ...item,
          quantity: existingItem?.quantity || 0, // Default 0
          total:
            existingItem?.total ||
            parseFloat(item.sales_info_selling_price || 0) * 0,
          selected: !!existingItem,
          serialAdded: existingItem?.serialNumbers?.length > 0 || false,
          serialNumbers: existingItem?.serialNumbers || [],
          sales_info_selling_price:
            existingItem?.price || item.sales_info_selling_price,
        };
      });
      setAllItems(dataWithExtras);
    } catch (err) {
      console.error("Error fetching stock materials:", err);
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    if (show) {
      fetchIntCategory();
      fetchAllItems();
    }
  }, [show]);

  // Toggle category selection
  const toggleCategorySelect = (catId) => {
    setIntCategory((prev) =>
      prev.map((cat) =>
        cat.id === catId ? { ...cat, selected: !cat.selected } : cat
      )
    );
  };

  // Get items for a given category
  const getItemsForCategory = (catId) => {
    return allItems.filter((item) => {
      const itemCatId =
        item.stockName?.inv_cat_id || item.stockName?.InventoryCat?.id;
      return itemCatId === catId;
    });
  };

  // Quantity update (auto-select + total 0 logic)
  const updateQuantity = (id, type) => {
    setAllItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          let newQty =
            type === "inc" ? item.quantity + 1 : Math.max(0, item.quantity - 1);

          return {
            ...item,
            quantity: newQty,
            selected: newQty > 0,
            total: newQty * parseFloat(item.sales_info_selling_price || 0),
            serialAdded: newQty === 0 ? false : item.serialAdded,
            serialNumbers: newQty === 0 ? [] : item.serialNumbers,
          };
        }
        return item;
      })
    );
  };

  // Manual quantity typing also auto-selects
  const handleManualQtyChange = (id, value) => {
    const newQty = Number(value);
    setAllItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: newQty,
              selected: newQty > 0,
              total: newQty * parseFloat(item.sales_info_selling_price || 0),
              serialAdded: newQty === 0 ? false : item.serialAdded,
              serialNumbers: newQty === 0 ? [] : item.serialNumbers,
            }
          : item
      )
    );
  };

  // Price edit
  const handlePriceChange = (id, value) => {
    setAllItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              sales_info_selling_price: value,
              total: item.quantity * parseFloat(value || 0),
            }
          : item
      )
    );
  };

  // Toggle item checkbox manually
  const toggleItemSelect = (id) => {
    setAllItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              selected: !item.selected,
              quantity: !item.selected ? 1 : 0,
              total: !item.selected
                ? parseFloat(item.sales_info_selling_price || 0)
                : 0,
              serialAdded: false,
              serialNumbers: [],
            }
          : item
      )
    );
  };

  // Open serial modal
  const openSerialModal = (item) => {
    const serials = Array.from(
      { length: item.quantity },
      (_, i) => item.serialNumbers[i] || ""
    );
    setSerialModal({ show: true, item, serials });
  };

  // Handle serial change
  const handleSerialChange = (index, value) => {
    setSerialModal((prev) => {
      const updated = [...prev.serials];
      updated[index] = value;
      return { ...prev, serials: updated };
    });
  };

  // Save serials & hit API
  const saveSerials = async () => {
    const { item, serials } = serialModal;
    if (serials.some((s) => !s.trim()))
      return errorToast("Please fill all serial numbers");

    try {
      const payload = {
        Credit: item.quantity,
        remark: "Stock purchase",
        stock_material_id: item.id,
        stock_particular_id: 3,
        supplier_management_id: formik.values.supplier_id,
        brand_id: formik.values?.branch_id || null,
        serialNumbers: serials,
      };

      await api.post("/api/v1/admin/stockManagement", payload);
      successToast(`Serials added for ${item.material}`);

      setAllItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, serialNumbers: serials, serialAdded: true }
            : i
        )
      );

      setSerialModal({ show: false, item: null, serials: [] });
    } catch (err) {
      setSerialModal({ show: false, item: null, serials: [] });
      errorToast(err.response?.data?.message || "Error saving serials");
    }
  };

  // Only enable Save if at least one item is selected and all have serials
  const selectedItems = allItems.filter((i) => i.selected);
  const allSerialsAdded =
    selectedItems.length > 0 && selectedItems.every((i) => i.serialAdded);

  // Save
  const handleSave = () => {
    const selectedCategories = intCategory
      .filter((cat) => cat.selected)
      .map((cat) => {
        const categoryItems = allItems
          .filter((item) => {
            const itemCatId =
              item.stockName?.inv_cat_id || item.stockName?.InventoryCat?.id;
            return itemCatId === cat.id && item.selected;
          })
          .map((item) => ({
            id: item.id,
            name: item.material,
            price: item.sales_info_selling_price,
            quantity: item.quantity,
            total: item.total,
            serialNumbers: item.serialNumbers,
          }));

        const totalQuantity = categoryItems.reduce(
          (sum, i) => sum + Number(i.quantity),
          0
        );
        const grandTotal = categoryItems.reduce((sum, i) => sum + i.total, 0);

        return {
          id: cat.id,
          name: cat.category,
          items: categoryItems,
          totalQuantity,
          grandTotal,
          taxPreference: cat.TaxPreference || null,
          intraTax: cat.intraTax || null,
          interTax: cat.interTax || null,
        };
      })
      .filter((cat) => cat.items.length > 0); // only include cats with items

    onSave({
      selectedCategories,
      overallTotalQuantity: selectedCategories.reduce(
        (sum, c) => sum + c.totalQuantity,
        0
      ),
      overallGrandTotal: selectedCategories.reduce(
        (sum, c) => sum + c.grandTotal,
        0
      ),
    });
    handleClose();
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        backdrop="static"
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {/* LEFT: Categories */}
            <Col md={4}>
              {loadingCat ? (
                <p>Loading...</p>
              ) : (
                <div className="table-responsive">
                  <Table hover bordered>
                    <thead>
                      <tr className="table-gray">
                        <th>Select</th>
                        <th>Sr.No</th>
                        <th>Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {intCategory.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="text-center">
                            No Item Category Available
                          </td>
                        </tr>
                      ) : (
                        intCategory.map((cat, idx) => (
                          <tr key={cat.id}>
                            <td>
                              <Form.Check
                                type="checkbox"
                                checked={cat.selected}
                                onChange={() => toggleCategorySelect(cat.id)}
                              />
                            </td>
                            <td>{idx + 1}</td>
                            <td>{cat.category}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              )}
            </Col>

            {/* RIGHT: Items per category */}
            <Col md={8}>
              {!loadingItems &&
                intCategory
                  .filter((cat) => cat.selected)
                  .map((cat) => {
                    const categoryItems = getItemsForCategory(cat.id);
                    const selectedItems = categoryItems.filter(
                      (i) => i.selected
                    );
                    const totalQuantity = selectedItems.reduce(
                      (sum, i) => sum + i.quantity,
                      0
                    );
                    const grandTotal = selectedItems.reduce(
                      (sum, i) => sum + i.total,
                      0
                    );

                    return (
                      <div key={cat.id} className="mb-5">
                        <h5 className="mb-3 text-primary">{cat.category}</h5>
                        <div className="table-responsive">
                          <Table bordered hover>
                            <thead className="table-light">
                              <tr>
                                <th>Select</th>
                                <th>Item Name</th>
                                <th>Price (₹)</th>
                                <th>Qty</th>
                                <th>Total (₹)</th>
                                <th>Serial Numbers</th>
                              </tr>
                            </thead>
                            <tbody>
                              {categoryItems.map((item) => (
                                <tr key={item.id}>
                                  <td>
                                    <Form.Check
                                      type="checkbox"
                                      checked={item.selected}
                                      onChange={() => toggleItemSelect(item.id)}
                                    />
                                  </td>
                                  <td>{item.material}</td>
                                  <td>
                                    <Form.Control
                                      type="number"
                                      value={item.sales_info_selling_price}
                                      onChange={(e) =>
                                        handlePriceChange(
                                          item.id,
                                          e.target.value
                                        )
                                      }
                                      style={{ width: "100px" }}
                                    />
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={() =>
                                          updateQuantity(item.id, "dec")
                                        }
                                      >
                                        -
                                      </Button>
                                      <Form.Control
                                        type="number"
                                        value={item.quantity}
                                        min={0}
                                        onChange={(e) =>
                                          handleManualQtyChange(
                                            item.id,
                                            e.target.value
                                          )
                                        }
                                        style={{
                                          width: "60px",
                                          textAlign: "center",
                                          margin: "0 5px",
                                        }}
                                      />
                                      <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={() =>
                                          updateQuantity(item.id, "inc")
                                        }
                                      >
                                        +
                                      </Button>
                                    </div>
                                  </td>
                                  <td>{item.total.toFixed(2)}</td>
                                  <td>
                                    {(item.selected &&
                                      formik.values.branch_id) ||
                                    (formik.values.client_id &&
                                      formik.values.supplier_id) ? (
                                      <Button
                                        variant={
                                          item.serialAdded
                                            ? "success"
                                            : "outline-primary"
                                        }
                                        size="sm"
                                        onClick={() => openSerialModal(item)}
                                      >
                                        {item.serialAdded
                                          ? "Added"
                                          : "+ Add Serials"}
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="outline-primary"
                                        disabled
                                        size="sm"
                                      >
                                        + Add Serials
                                      </Button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                        {selectedItems.length > 0 && (
                          <div className="text-end mt-2">
                            <strong>
                              Total Quantity: {totalQuantity} | Grand Total: ₹
                              {grandTotal.toFixed(2)}
                            </strong>
                          </div>
                        )}
                      </div>
                    );
                  })}
            </Col>

            <div className="text-end mt-3">
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={!allSerialsAdded}
              >
                Save
              </Button>
            </div>
          </Row>
        </Modal.Body>
      </Modal>

      {/* 🔹 Serial Entry Modal */}
      <Modal
        show={serialModal.show}
        onHide={() => setSerialModal({ show: false, item: null, serials: [] })}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Add Serials for {serialModal.item?.material || ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {serialModal.item && (
            <div>
              {serialModal.serials.map((s, idx) => (
                <Form.Group key={idx} className="mb-2">
                  <Form.Label>Serial {idx + 1}</Form.Label>
                  <Form.Control
                    type="text"
                    value={s}
                    onChange={(e) => handleSerialChange(idx, e.target.value)}
                  />
                </Form.Group>
              ))}
              <div className="text-end mt-3">
                <Button
                  variant="primary"
                  onClick={saveSerials}
                  disabled={serialModal.serials.some((s) => !s.trim())}
                >
                  Save Serials
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddPurchaseOrderModal;
