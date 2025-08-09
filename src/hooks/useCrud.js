import { useState, useEffect, useCallback, useRef, useMemo } from "react";

const useCrud = (service, autoFetch = true) => {
  const [allData, setAllData] = useState([]); // Store all data
  const [filteredData, setFilteredData] = useState([]); // Store filtered data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const serviceRef = useRef(service);

  // Keep service reference updated
  useEffect(() => {
    serviceRef.current = service;
  }, [service]);
  const fetchData = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);
      const result = await serviceRef.current.getAll(params);
      setAllData(result.data || []);
      setError(result.error);
      setLoading(false);
      return result;
    },
    [] // No dependencies to prevent re-renders
  );

  // Client-side filtering based on search query
  const performSearch = useCallback(
    (query, categoryData = []) => {
      if (!query.trim()) {
        setFilteredData(allData);
        return;
      }

      const searchTerm = query.toLowerCase().trim();
      const filtered = allData.filter((item) => {
        // Search through common fields
        const searchableFields = [
          item.name,
          item.description,
          item.id?.toString(),
          // Convert price to string for searching
          item.price?.toString(),
          // Convert status to searchable text
          item.isActive ? "active" : "inactive",
        ];

        // For products with categoryId, find and include category name
        if (item.categoryId && categoryData.length > 0) {
          const category = categoryData.find(
            (cat) => cat.id === item.categoryId
          );
          if (category?.name) {
            searchableFields.push(category.name);
          }
        }

        return searchableFields.some((field) =>
          field?.toLowerCase().includes(searchTerm)
        );
      });

      setFilteredData(filtered);
    },
    [allData]
  );

  // Expose search function with optional category data
  const searchItems = useCallback(
    (query, categoryData = []) => {
      setSearchQuery(query);
      performSearch(query, categoryData);
    },
    [performSearch]
  );

  // Update filtered data when allData changes (but keep current search)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredData(allData);
    }
  }, [allData, searchQuery]);

  const createItem = useCallback(
    async (itemData) => {
      const result = await serviceRef.current.create(itemData);
      if (!result.error) {
        await fetchData();
      }
      return result;
    },
    [fetchData]
  );

  const updateItem = useCallback(
    async (id, itemData) => {
      const result = await serviceRef.current.update(id, itemData);
      if (!result.error) {
        await fetchData();
      }
      return result;
    },
    [fetchData]
  );

  const patchItem = useCallback(
    async (id, itemData) => {
      const result = await serviceRef.current.patch(id, itemData);
      if (!result.error) {
        await fetchData();
      }
      return result;
    },
    [fetchData]
  );

  const deleteItem = useCallback(
    async (id) => {
      const result = await serviceRef.current.delete(id);
      if (!result.error) {
        await fetchData();
      }
      return result;
    },
    [fetchData]
  );

  // Only run on mount
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, []); // Remove dependencies to prevent re-renders

  return {
    data: filteredData, // Return filtered data instead of raw data
    allData, // Expose all data if needed
    loading,
    error,
    searchQuery,
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
