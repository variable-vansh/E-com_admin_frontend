import api from "./api";
import { toast } from "react-hot-toast";

class CrudService {
  constructor(endpoint, entityName) {
    this.endpoint = endpoint;
    this.entityName = entityName;
  }

  async getAll(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString
        ? `${this.endpoint}?${queryString}`
        : this.endpoint;
      const response = await api.get(url);
      return { data: response.data, error: null };
    } catch (error) {
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

// Create service instances
export const categoriesService = new CrudService("/categories", "Category");
export const productsService = new CrudService("/products", "Product");
export const grainsService = new CrudService("/grains", "Grain");
export const usersService = new CrudService("/users", "User");
// Note: Using enhanced ordersService from ordersService.js instead
// export const ordersService = new CrudService("/orders", "Order");
export const inventoryService = new CrudService("/inventory", "Inventory");
export const promosService = new CrudService("/promos", "Promo");

export default CrudService;
