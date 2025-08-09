import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ToggleOff as DeactivateIcon,
} from "@mui/icons-material";
import SearchBar from "../common/SearchBar";
import { useState } from "react";

const GrainTable = ({ grains, onEdit, onDelete, onDeactivate, loading }) => {
  const [searchText, setSearchText] = useState("");

  const filteredGrains = grains.filter(
    (grain) =>
      grain.name.toLowerCase().includes(searchText.toLowerCase()) ||
      grain.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Typography>Loading grains...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <SearchBar
        searchText={searchText}
        onSearchChange={setSearchText}
        placeholder="Search grains..."
      />

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGrains.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" color="text.secondary" py={4}>
                    {searchText
                      ? "No grains found matching your search."
                      : "No grains found."}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredGrains.map((grain) => (
                <TableRow key={grain.id} hover>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {grain.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {grain.description || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="medium">
                      {formatPrice(grain.price)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={grain.isActive ? "Active" : "Inactive"}
                      color={grain.isActive ? "success" : "default"}
                      variant={grain.isActive ? "filled" : "outlined"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" gap={1} justifyContent="center">
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => onEdit(grain)}
                          color="primary"
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {grain.isActive && (
                        <Tooltip title="Deactivate">
                          <IconButton
                            onClick={() => onDeactivate(grain.id)}
                            color="warning"
                            size="small"
                          >
                            <DeactivateIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => onDelete(grain.id)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GrainTable;
