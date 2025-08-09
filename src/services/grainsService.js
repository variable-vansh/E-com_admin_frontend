import CrudService from "./crudService";
import api from "./api";
import { toast } from "react-hot-toast";

class GrainsService extends CrudService {
  constructor() {
    super("/grains", "Grain");
  }

  async getAllIncludingInactive() {
    try {
      const response = await api.get(`${this.endpoint}/all`);
      return { data: response.data, error: null };
    } catch (error) {
      const errorMessage = `Failed to fetch all ${this.entityName}s`;
      toast.error(errorMessage);
      return { data: [], error: errorMessage };
    }
  }

  async getStats() {
    try {
      const response = await api.get(`${this.endpoint}/stats`);
      return { data: response.data, error: null };
    } catch (error) {
      const errorMessage = `Failed to fetch ${this.entityName} statistics`;
      toast.error(errorMessage);
      return { data: {}, error: errorMessage };
    }
  }

  async search(query) {
    try {
      const response = await api.get(`${this.endpoint}/search`, {
        params: { q: query },
      });
      return { data: response.data, error: null };
    } catch (error) {
      const errorMessage = `Failed to search ${this.entityName}s`;
      toast.error(errorMessage);
      return { data: [], error: errorMessage };
    }
  }

  async deactivate(id) {
    try {
      const response = await api.patch(`${this.endpoint}/${id}/deactivate`);
      toast.success(`${this.entityName} deactivated successfully`);
      return { data: response.data, error: null };
    } catch (error) {
      const errorMessage = `Failed to deactivate ${this.entityName}`;
      toast.error(errorMessage);
      return { data: null, error: errorMessage };
    }
  }
}

export const grainsService = new GrainsService();
export default GrainsService;
