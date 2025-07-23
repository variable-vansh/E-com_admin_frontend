import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const CategoryTable = ({ categories, onEdit, onDelete, loading }) => {
  const getCategoryNameById = (id) => {
    if (!id) return "N/A";
    const category = categories.find((cat) => cat.id === id);
    return category ? category.name : "Unknown";
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Parent Category</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell>{category.id}</TableCell>
            <TableCell>{category.name}</TableCell>
            <TableCell>{getCategoryNameById(category.parentId)}</TableCell>
            <TableCell>
              <IconButton onClick={() => onEdit(category)}>
                <Edit />
              </IconButton>
              <IconButton onClick={() => onDelete(category.id)}>
                <Delete />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CategoryTable;
