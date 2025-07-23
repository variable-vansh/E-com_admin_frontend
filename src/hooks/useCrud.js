import { useState, useEffect, useCallback } from "react";

const useCrud = (service, autoFetch = true) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);
      const result = await service.getAll(params);
      setData(result.data);
      setError(result.error);
      setLoading(false);
      return result;
    },
    [service]
  );

  const createItem = useCallback(
    async (itemData) => {
      const result = await service.create(itemData);
      if (!result.error) {
        await fetchData();
      }
      return result;
    },
    [service, fetchData]
  );

  const updateItem = useCallback(
    async (id, itemData) => {
      const result = await service.update(id, itemData);
      if (!result.error) {
        await fetchData();
      }
      return result;
    },
    [service, fetchData]
  );

  const patchItem = useCallback(
    async (id, itemData) => {
      const result = await service.patch(id, itemData);
      if (!result.error) {
        await fetchData();
      }
      return result;
    },
    [service, fetchData]
  );

  const deleteItem = useCallback(
    async (id) => {
      const result = await service.delete(id);
      if (!result.error) {
        await fetchData();
      }
      return result;
    },
    [service, fetchData]
  );

  const searchItems = useCallback(
    async (query) => {
      setLoading(true);
      setError(null);
      const result = await service.search(query);
      setData(result.data);
      setError(result.error);
      setLoading(false);
      return result;
    },
    [service]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  return {
    data,
    loading,
    error,
    fetchData,
    createItem,
    updateItem,
    patchItem,
    deleteItem,
    searchItems,
    refetch: fetchData,
  };
};

export default useCrud;
