import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Chip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const UserTable = ({ users, onEdit, onDelete, loading }) => {
  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "error";
      case "SHOPKEEPER":
        return "warning";
      case "CUSTOMER":
        return "primary";
      default:
        return "default";
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Username</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Role</TableCell>
          <TableCell>Created At</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.id}</TableCell>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Chip
                label={user.role}
                color={getRoleColor(user.role)}
                size="small"
              />
            </TableCell>
            <TableCell>
              {new Date(user.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <IconButton onClick={() => onEdit(user)}>
                <Edit />
              </IconButton>
              <IconButton onClick={() => onDelete(user.id)}>
                <Delete />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
