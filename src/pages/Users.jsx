import { useState } from "react";
import { Box, Button } from "@mui/material";
import { usersService } from "../services/crudService";
import useCrud from "../hooks/useCrud";
import PageHeader from "../components/common/PageHeader";
import ConfirmDialog from "../components/common/ConfirmDialog";
import UserForm from "../components/users/UserForm";
import UserTable from "../components/users/UserTable";

const Users = () => {
  const {
    data: users,
    loading,
    createItem,
    updateItem,
    deleteItem,
  } = useCrud(usersService);

  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  const handleOpen = (user = null) => {
    setCurrentUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentUser(null);
  };

  const handleSubmit = async (userData) => {
    if (currentUser) {
      await updateItem(currentUser.id, userData);
    } else {
      await createItem(userData);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    await deleteItem(deleteDialog.id);
    setDeleteDialog({ open: false, id: null });
  };

  return (
    <Box>
      <PageHeader
        title="Users"
        actionButton={
          <Button variant="contained" onClick={() => handleOpen()}>
            Add User
          </Button>
        }
      />

      <UserTable
        users={users}
        onEdit={handleOpen}
        onDelete={handleDeleteClick}
        loading={loading}
      />

      <UserForm
        open={open}
        onClose={handleClose}
        user={currentUser}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message="Are you sure you want to delete this user?"
      />
    </Box>
  );
};

export default Users;
