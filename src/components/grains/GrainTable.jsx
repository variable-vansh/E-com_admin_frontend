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
  Avatar,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from "@mui/icons-material";

const GrainTable = ({ grains, onEdit, onDelete, loading }) => {
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
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {grains.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography variant="body1" color="text.secondary" py={4}>
                  No grains found.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            grains.map((grain) => (
              <TableRow key={grain.id} hover>
                <TableCell>
                  <Avatar
                    src={grain.image}
                    alt={grain.name}
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 1,
                    }}
                    variant="rounded"
                  >
                    <ImageIcon />
                  </Avatar>
                </TableCell>
                <TableCell>{grain.id}</TableCell>
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
                  <IconButton onClick={() => onEdit(grain)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDelete(grain.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GrainTable;
