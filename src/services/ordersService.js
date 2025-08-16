import api from "./api";
import { toast } from "react-hot-toast";

class OrdersService {
  constructor() {
    this.endpoint = "/orders";
    this.entityName = "Order";
  }

  async getAll(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString
        ? `${this.endpoint}?${queryString}`
        : this.endpoint;
      const response = await api.get(url);

      // Debug logging
      console.log("Orders API Response:", response);
      console.log("Orders API Response Data:", response.data);
      console.log("Is response.data an array?", Array.isArray(response.data));

      // Handle different response formats
      let ordersData = response.data;
      if (response.data && response.data.success && response.data.data) {
        ordersData = response.data.data;
      }

      console.log("Final orders data:", ordersData);
      console.log("Is final data an array?", Array.isArray(ordersData));

      return { data: Array.isArray(ordersData) ? ordersData : [], error: null };
    } catch (error) {
      console.error("Orders API Error:", error);
      const errorMessage = `Failed to fetch ${this.entityName}s`;
      toast.error(errorMessage);
      return { data: [], error: errorMessage };
    }
  }

  async getById(id) {
    try {
      const response = await api.get(`${this.endpoint}/${id}`);
      return { data: response.data, error: null };
    } catch (error) {
      const errorMessage = `Failed to fetch ${this.entityName}`;
      toast.error(errorMessage);
      return { data: null, error: errorMessage };
    }
  }

  async getByPhone(phone) {
    try {
      const response = await api.get(`${this.endpoint}/customer/${phone}`);
      return { data: response.data, error: null };
    } catch (error) {
      const errorMessage = `Failed to fetch orders by phone`;
      toast.error(errorMessage);
      return { data: [], error: errorMessage };
    }
  }

  async create(data) {
    try {
      const response = await api.post(this.endpoint, data);
      toast.success(`${this.entityName} created successfully`);
      return { data: response.data, error: null };
    } catch (error) {
      const errorMessage = `Failed to create ${this.entityName}`;
      toast.error(errorMessage);
      return { data: null, error: errorMessage };
    }
  }

  async update(id, data) {
    try {
      const response = await api.put(`${this.endpoint}/${id}`, data);
      toast.success(`${this.entityName} updated successfully`);
      return { data: response.data, error: null };
    } catch (error) {
      const errorMessage = `Failed to update ${this.entityName}`;
      toast.error(errorMessage);
      return { data: null, error: errorMessage };
    }
  }

  async patch(id, data) {
    try {
      const response = await api.patch(`${this.endpoint}/${id}`, data);
      toast.success(`${this.entityName} updated successfully`);
      return { data: response.data, error: null };
    } catch (error) {
      const errorMessage = `Failed to update ${this.entityName}`;
      toast.error(errorMessage);
      return { data: null, error: errorMessage };
    }
  }

  async updateStatus(id, status) {
    try {
      const response = await api.patch(`${this.endpoint}/${id}/status`, {
        status,
      });
      toast.success(`Order status updated to ${status}`);
      return { data: response.data, error: null };
    } catch (error) {
      const errorMessage = `Failed to update order status`;
      toast.error(errorMessage);
      return { data: null, error: errorMessage };
    }
  }

  async delete(id) {
    try {
      await api.delete(`${this.endpoint}/${id}`);
      toast.success(`${this.entityName} deleted successfully`);
      return { error: null };
    } catch (error) {
      const errorMessage = `Failed to delete ${this.entityName}`;
      toast.error(errorMessage);
      return { error: errorMessage };
    }
  }

  async getStats() {
    try {
      const response = await api.get(`${this.endpoint}/stats`);
      return { data: response.data, error: null };
    } catch (error) {
      const errorMessage = `Failed to fetch order statistics`;
      toast.error(errorMessage);
      return { data: null, error: errorMessage };
    }
  }

  async search(query) {
    try {
      const response = await api.get(`${this.endpoint}/search?q=${query}`);
      return { data: response.data, error: null };
    } catch (error) {
      const errorMessage = `Failed to search ${this.entityName}s`;
      toast.error(errorMessage);
      return { data: [], error: errorMessage };
    }
  }
}

// Create and export the service instance
export const ordersService = new OrdersService();
export default OrdersService;
