import React, { useState, useEffect } from "react";
import { Box, Button, Tabs, Tab } from "@mui/material";
import { LocalOffer, CardGiftcard } from "@mui/icons-material";
import { productsService } from "../services/crudService";
import { couponsService } from "../services/couponsService";
import useCrud from "../hooks/useCrud";
import PageHeader from "../components/common/PageHeader";
import SearchBar from "../components/common/SearchBar";
import ConfirmDialog from "../components/common/ConfirmDialog";
import CouponForm from "../components/coupons/CouponForm";
import CouponTable from "../components/coupons/CouponTable";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Fetch products for additional item coupons
  useEffect(() => {
    const fetchProducts = async () => {
      const result = await productsService.getAll();
      setProducts(result.data || []);
    };
    fetchProducts();
  }, []);

  // Fetch coupons with server-side filtering
  const fetchCoupons = async () => {
    setLoading(true);
    const params = {};

    // Add type filter based on active tab
    if (activeTab === 0) params.type = "additional_item";
    if (activeTab === 1) params.type = "discount_code";

    // Add search query if present
    if (searchQuery.trim()) params.search = searchQuery.trim();

    // Add pagination
    params.page = pagination.page;
    params.limit = pagination.limit;

    const result = await couponsService.getAll(params);
    setCoupons(result.data || []);
    if (result.pagination) {
      setPagination(result.pagination);
    }
    setLoading(false);
  };

  // Handle search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCoupons();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeTab, pagination.page, pagination.limit]);

  // Initial fetch
  useEffect(() => {
    fetchCoupons();
  }, []);

  // Filter coupons by type based on active tab - now handled server-side
  const filteredCoupons = React.useMemo(() => {
    if (!Array.isArray(coupons)) {
      console.warn("Coupons data is not an array:", coupons);
      return [];
    }
    return coupons; // No client-side filtering needed anymore
  }, [coupons]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when changing tabs
  };

  const handleOpen = (coupon = null, couponType = null) => {
    // If creating new coupon, set the type based on active tab
    if (!coupon && couponType) {
      setCurrentCoupon({ type: couponType });
    } else {
      setCurrentCoupon(coupon);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentCoupon(null);
  };

  const handleSubmit = async (couponData) => {
    let result;
    if (currentCoupon && currentCoupon.id) {
      result = await couponsService.update(currentCoupon.id, couponData);
    } else {
      result = await couponsService.create(couponData);
    }

    // Refresh the coupon list after successful create/update
    if (result && !result.error) {
      fetchCoupons();
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    const result = await couponsService.delete(deleteDialog.id);
    setDeleteDialog({ open: false, id: null });

    // Refresh the coupon list after successful delete
    if (result && !result.error) {
      fetchCoupons();
    }
  };

  const getAddButtonText = () => {
    if (activeTab === 0) return "Add Additional Item Coupon";
    if (activeTab === 1) return "Add Discount Code Coupon";
    return "Add Coupon";
  };

  const getCouponType = () => {
    if (activeTab === 0) return "additional_item";
    if (activeTab === 1) return "discount_code";
    return null;
  };

  return (
    <Box>
      <PageHeader
        title="Coupons Management"
        actionButton={
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search coupons..."
              sx={{ width: 300 }}
            />
            <Button
              variant="contained"
              onClick={() => handleOpen(null, getCouponType())}
            >
              {getAddButtonText()}
            </Button>
          </Box>
        }
      />

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab
            label="Additional Item Coupons"
            icon={<CardGiftcard />}
            iconPosition="start"
          />
          <Tab
            label="Discount Code Coupons"
            icon={<LocalOffer />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      <CouponTable
        coupons={filteredCoupons}
        products={products}
        onEdit={handleOpen}
        onDelete={handleDeleteClick}
        loading={loading}
        couponType={activeTab === 0 ? "additional_item" : "discount_code"}
      />

      <CouponForm
        open={open}
        onClose={handleClose}
        coupon={currentCoupon}
        onSubmit={handleSubmit}
        products={products}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Coupon"
        message="Are you sure you want to delete this coupon? This action cannot be undone."
      />
    </Box>
  );
};

export default Coupons;
