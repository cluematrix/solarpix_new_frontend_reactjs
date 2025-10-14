import React, { useEffect, useState } from "react";
import { Col, Modal, Row, Spinner, Table, Button, Form } from "react-bootstrap";
import api from "../../../../api/axios";

const AddSalesOrderModal = ({ show, handleClose, onSave, existingData }) => {
  const [loadingCat, setLoadingCat] = useState(false);
  const [intCategory, setIntCategory] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [allItems, setAllItems] = useState([]);

  // Fetch categories
  const fetchIntCategory = async () => {
    try {
      setLoadingCat(true);
      const res = await api.get("/api/v1/admin/inventoryCategory/active");
      // Mark selected based on existingData
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
        // Check if item exists in existingData
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

  // Quantity update
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
          };
        }
        return item;
      })
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

  // Toggle item checkbox
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
            }
          : item
      )
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
            }
          : item
      )
    );
  };

  // Save button logic
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
      });

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
              <div className="loader-div">
                {/* <Spinner animation="border" className="spinner" /> */}
                <p>Loading...</p>
              </div>
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
            {intCategory
              .filter((cat) => cat.selected)
              .map((cat) => {
                const categoryItems = getItemsForCategory(cat.id);
                const selectedItems = categoryItems.filter((i) => i.selected);
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
                                    handlePriceChange(item.id, e.target.value)
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
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          </div>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default AddSalesOrderModal;
