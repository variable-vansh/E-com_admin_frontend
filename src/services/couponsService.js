import api from "./api";
import { toast } from "react-hot-toast";

class CouponsService {
  constructor() {
    this.endpoint = "/coupons";
  }

  async getAll(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString
        ? `${this.endpoint}?${queryString}`
        : this.endpoint;
      const response = await api.get(url);

      if (response.data && response.data.success && response.data.data) {
        return {
          data: response.data.data,
          pagination: response.data.pagination,
          error: null,
        };
      }

      // Fallback for legacy response structure
      return { data: response.data || [], error: null };
    } catch (error) {
      const errorMessage = "Failed to fetch coupons";
      toast.error(errorMessage);
      return { data: [], error: errorMessage };
    }
  }

  async getById(id) {
    try {
      const response = await api.get(`${this.endpoint}/${id}`);

      if (response.data && response.data.success && response.data.data) {
        return { data: response.data.data, error: null };
      }

      return { data: response.data, error: null };
    } catch (error) {
      const errorMessage = "Failed to fetch coupon";
      toast.error(errorMessage);
      return { data: null, error: errorMessage };
    }
  }

  async create(data) {
    try {
      const response = await api.post(this.endpoint, data);
      toast.success("Coupon created successfully");

      if (response.data && response.data.success && response.data.data) {
        return { data: response.data.data, error: null };
      }

      return { data: response.data, error: null };
    } catch (error) {
      let errorMessage = "Failed to create coupon";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
      return { data: null, error: errorMessage };
    }
  }

  async update(id, data) {
    try {
      const response = await api.put(`${this.endpoint}/${id}`, data);
      toast.success("Coupon updated successfully");

      if (response.data && response.data.success && response.data.data) {
        return { data: response.data.data, error: null };
      }

      return { data: response.data, error: null };
    } catch (error) {
      let errorMessage = "Failed to update coupon";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
      return { data: null, error: errorMessage };
    }
  }

  async delete(id) {
    try {
      await api.delete(`${this.endpoint}/${id}`);
      toast.success("Coupon deleted successfully");
      return { data: true, error: null };
    } catch (error) {
      const errorMessage = "Failed to delete coupon";
      toast.error(errorMessage);
      return { data: false, error: errorMessage };
    }
  }

  // Validate coupon code (public endpoint)
  async validateCoupon(code, orderAmount, userId = null, items = []) {
    try {
      const response = await api.post(`${this.endpoint}/validate`, {
        code,
        orderAmount,
        userId,
        items,
      });

      if (response.data && response.data.success) {
        return {
          valid: response.data.valid,
          coupon: response.data.coupon,
          discountAmount: response.data.discountAmount,
          message: response.data.message,
          error: null,
        };
      }

      return {
        valid: false,
        message: response.data.message || "Invalid coupon",
        error: response.data.error,
      };
    } catch (error) {
      let errorMessage = "Failed to validate coupon";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      return {
        valid: false,
        message: errorMessage,
        error: error.response?.data?.error || "NETWORK_ERROR",
      };
    }
  }

  // Apply coupon to order
  async applyCoupon(couponId, orderId, userId, orderAmount, discountApplied) {
    try {
      const response = await api.post(`${this.endpoint}/apply`, {
        couponId,
        orderId,
        userId,
        orderAmount,
        discountApplied,
      });

      if (response.data && response.data.success) {
        toast.success(response.data.message || "Coupon applied successfully");
        return { data: response.data.data, error: null };
      }

      return { data: null, error: response.data.message };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to apply coupon";
      toast.error(errorMessage);
      return { data: null, error: errorMessage };
    }
  }

  // Get available additional item coupons
  async getAdditionalItemCoupons(orderAmount) {
    try {
      const response = await api.get(
        `${this.endpoint}/additional-items/available?orderAmount=${orderAmount}`
      );

      if (response.data && response.data.success) {
        return { data: response.data.data, error: null };
      }

      return { data: [], error: null };
    } catch (error) {
      const errorMessage = "Failed to fetch additional item coupons";
      toast.error(errorMessage);
      return { data: [], error: errorMessage };
    }
  }
}

export const couponsService = new CouponsService();
export default couponsService;
