import api from "./api";
import { toast } from "react-hot-toast";

class PromosService {
  constructor() {
    this.endpoint = "/promos";
    this.entityName = "Promo";
  }

  async getAll(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString
        ? `${this.endpoint}?${queryString}`
        : this.endpoint;
      const response = await api.get(url);
      // Handle nested data structure from backend
      const data = response.data.data || response.data || [];
      return { data: data, error: null };
    } catch (error) {
      const errorMessage = `Failed to fetch ${this.entityName}s`;
      toast.error(errorMessage);
      return { data: [], error: errorMessage };
    }
  }

  async create(data) {
    try {
      const response = await api.post(this.endpoint, data);
      toast.success(`${this.entityName} created successfully`);
      // Handle nested data structure from backend
      const responseData = response.data.data || response.data || null;
      return { data: responseData, error: null };
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
      // Handle nested data structure from backend
      const responseData = response.data.data || response.data || null;
      return { data: responseData, error: null };
    } catch (error) {
      const errorMessage = `Failed to update ${this.entityName}`;
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

  async reorder(data) {
    try {
      console.log("Sending reorder data:", data); // Debug logging
      const response = await api.put(`${this.endpoint}/reorder`, data);
      toast.success("Promo order updated successfully");
      // Handle nested data structure from backend
      const responseData = response.data.data || response.data || null;
      return { data: responseData, error: null };
    } catch (error) {
      console.error(
        "Reorder API error:",
        error.response?.data || error.message
      );
      const errorMessage = "Failed to reorder promos";
      toast.error(errorMessage);
      return { data: null, error: errorMessage };
    }
  }
}

export const promosService = new PromosService();
export default PromosService;
