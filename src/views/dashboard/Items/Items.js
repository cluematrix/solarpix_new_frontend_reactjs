import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Skeleton,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Items() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setItems([
        {
          id: 1,
          item: "Sample Item 1",
          purchaseRate: 100,
          sellingPrice: 150,
          unit: "kg",
          opening: 20,
          credit: 5,
          debit: 5,
          close: 15,
        },
        {
          id: 2,
          item: "Sample Item 2",
          purchaseRate: 100,
          sellingPrice: 150,
          unit: "kg",
          opening: 20,
          credit: 5,
          debit: 5,
          close: 15,
        },
        {
          id: 3,
          item: "Sample Item 3",
          purchaseRate: 100,
          sellingPrice: 150,
          unit: "kg",
          opening: 20,
          credit: 5,
          debit: 5,
          close: 15,
        },
        {
          id: 4,
          item: "Sample Item 4",
          purchaseRate: 100,
          sellingPrice: 150,
          unit: "kg",
          opening: 20,
          credit: 5,
          debit: 5,
          close: 15,
        },
        {
          id: 5,
          item: "Sample Item 5",
          purchaseRate: 100,
          sellingPrice: 150,
          unit: "kg",
          opening: 20,
          credit: 5,
          debit: 5,
          close: 15,
        },
        {
          id: 6,
          item: "Sample Item 6",
          purchaseRate: 100,
          sellingPrice: 150,
          unit: "kg",
          opening: 20,
          credit: 5,
          debit: 5,
          close: 15,
        },
        {
          id: 7,
          item: "Sample Item 7",
          purchaseRate: 100,
          sellingPrice: 150,
          unit: "kg",
          opening: 20,
          credit: 5,
          debit: 5,
          close: 15,
        },
        {
          id: 8,
          item: "Sample Item 8",
          purchaseRate: 100,
          sellingPrice: 150,
          unit: "kg",
          opening: 20,
          credit: 5,
          debit: 5,
          close: 15,
        },
        {
          id: 9,
          item: "Sample Item 9",
          purchaseRate: 100,
          sellingPrice: 150,
          unit: "kg",
          opening: 20,
          credit: 5,
          debit: 5,
          close: 15,
        },
        {
          id: 10,
          item: "Sample Item 10",
          purchaseRate: 100,
          sellingPrice: 150,
          unit: "kg",
          opening: 20,
          credit: 5,
          debit: 5,
          close: 15,
        },
        {
          id: 11,
          item: "Sample Item 11",
          purchaseRate: 100,
          sellingPrice: 150,
          unit: "kg",
          opening: 20,
          credit: 5,
          debit: 5,
          close: 15,
        },
        {
          id: 12,
          item: "Sample Item 12",
          purchaseRate: 100,
          sellingPrice: 150,
          unit: "kg",
          opening: 20,
          credit: 5,
          debit: 5,
          close: 15,
        },
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  const [page, setPage] = useState(0);
  const rowsPerPage = 7;

  const filteredItems = items.filter((i) =>
    i.item.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedItems = filteredItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handlePageChange = (_, newPage) => setPage(newPage);

  const SkeletonRow = () => (
    <TableRow>
      {Array.from({ length: 8 }).map((_, i) => (
        <TableCell key={i}>
          <Skeleton height={20} />
        </TableCell>
      ))}
    </TableRow>
  );

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        mb={2}
        alignItems="center"
      >
        <h2>Items</h2>

        <Box display={"flex"} gap={2}>
          <TextField
            placeholder="Search item..."
            size="small"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            sx={{ width: 150 }}
          />

          <Button variant="contained" onClick={() => navigate(`/item-add`)}>
            Add Item
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ "& td, & th": { textAlign: "center" } }}>
              <TableCell>Item</TableCell>
              <TableCell>Purchase Rate</TableCell>
              <TableCell>Selling Price</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Opening</TableCell>
              <TableCell>Close</TableCell>
              <TableCell>Credit</TableCell>
              <TableCell>Close</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading
              ? Array.from({ length: rowsPerPage }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              : paginatedItems.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "& td, & th": { textAlign: "center" } }}
                  >
                    <TableCell sx={{ padding: "0.5rem" }}>
                      <Button
                        variant="text"
                        disableRipple
                        onClick={() => navigate(`/item-details/${row.id}`)}
                        sx={{
                          "&:hover": {
                            backgroundColor: "transparent",
                          },
                        }}
                      >
                        {row.item}
                      </Button>
                    </TableCell>

                    <TableCell sx={{ padding: "0.5rem" }}>
                      {row.purchaseRate}
                    </TableCell>
                    <TableCell sx={{ padding: "0.5rem" }}>
                      {row.sellingPrice}
                    </TableCell>
                    <TableCell sx={{ padding: "0.5rem" }}>{row.unit}</TableCell>
                    <TableCell sx={{ padding: "0.5rem" }}>
                      {row.opening}
                    </TableCell>
                    <TableCell sx={{ padding: "0.5rem" }}>
                      {row.credit}
                    </TableCell>
                    <TableCell sx={{ padding: "0.5rem" }}>
                      {row.debit}
                    </TableCell>
                    <TableCell sx={{ padding: "0.5rem" }}>
                      {row.close}
                    </TableCell>
                    <TableCell sx={{ padding: "0.5rem" }}>
                      <Button color="warning">Update</Button>
                      <Button color="error">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredItems.length}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[]}
        />
      </TableContainer>
    </Box>
  );
}
