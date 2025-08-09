import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Chip,
  Avatar,
} from "@mui/material";
import { Edit, Delete, Image as ImageIcon } from "@mui/icons-material";

const ProductTable = ({
  products,
  categories = [],
  onEdit,
  onDelete,
  loading,
}) => {
  console.log(products);
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "N/A";
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Image</TableCell>
          <TableCell>ID</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Price</TableCell>
          <TableCell>Category</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <Avatar
                src={product.image}
                alt={product.name}
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
            <TableCell>{product.id}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>
              {product.description?.length > 50
                ? `${product.description.substring(0, 50)}...`
                : product.description}
            </TableCell>
            <TableCell>
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(product.price)}
            </TableCell>
            <TableCell>{getCategoryName(product.categoryId)}</TableCell>
            <TableCell>
              <Chip
                label={product.isActive ? "Active" : "Inactive"}
                color={product.isActive ? "success" : "default"}
                size="small"
              />
            </TableCell>
            <TableCell>
              <IconButton onClick={() => onEdit(product)}>
                <Edit />
              </IconButton>
              <IconButton onClick={() => onDelete(product.id)}>
                <Delete />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductTable;
