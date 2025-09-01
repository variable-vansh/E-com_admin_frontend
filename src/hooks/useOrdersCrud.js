import { useState, useEffect, useCallback } from "react";
import { getSearchableOrderFields } from "../utils/orderUtils";

const useOrdersCrud = (service, autoFetch = true) => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchData = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);
      try {
        const result = await service.getAll(params);
        console.log("useOrdersCrud fetchData result:", result);
        console.log("useOrdersCrud result.data:", result.data);
        console.log("Is result.data an array?", Array.isArray(result.data));

        const dataToSet = Array.isArray(result.data) ? result.data : [];
        setAllData(dataToSet);
        setError(result.error);
        setLoading(false);
        return result;
      } catch (error) {
        console.error("useOrdersCrud fetchData error:", error);
        setAllData([]);
        setError("Failed to fetch data");
        setLoading(false);
        return { data: [], error: error.message };
      }
    },
    [service]
  );

  const fetchStats = useCallback(async () => {
    const result = await service.getStats();
    setStats(result.data);
    return result;
  }, [service]);

  // Enhanced filtering for orders
  const performFilter = useCallback(() => {
    console.log("performFilter - allData:", allData);
    console.log("performFilter - allData type:", typeof allData);
    console.log("performFilter - is allData array?", Array.isArray(allData));

    if (!Array.isArray(allData)) {
      console.warn("allData is not an array, setting empty filtered data");
      setFilteredData([]);
      return;
    }

    let filtered = [...allData];

    // Search filter
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((order) => {
        const searchableFields = getSearchableOrderFields(order);
        return searchableFields.some((field) =>
          field?.toLowerCase().includes(searchTerm)
        );
      });
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(
        (order) => (order.orderStatus || order.status) === statusFilter
      );
    }

    // Date range filter
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter((order) => {
        const orderDate = new Date(
          order.createdAt || order.orderDate || order.orderTimestamp
        );
        return orderDate >= fromDate;
      });
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999); // Include the entire day
      filtered = filtered.filter((order) => {
        const orderDate = new Date(
          order.createdAt || order.orderDate || order.orderTimestamp
        );
        return orderDate <= toDate;
      });
    }

    setFilteredData(filtered);
  }, [allData, searchQuery, statusFilter, dateFrom, dateTo]);

  // Apply filters whenever dependencies change
  useEffect(() => {
    performFilter();
  }, [performFilter]);

  const searchItems = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const setStatusFilterValue = useCallback((status) => {
    setStatusFilter(status);
  }, []);

  const setDateRange = useCallback((from, to) => {
    setDateFrom(from);
    setDateTo(to);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("");
    setDateFrom("");
    setDateTo("");
  }, []);

  const createItem = useCallback(
    async (itemData) => {
      const result = await service.create(itemData);
      if (!result.error) {
        await fetchData();
        await fetchStats();
      }
      return result;
    },
    [service, fetchData, fetchStats]
  );

  const updateItem = useCallback(
    async (id, itemData) => {
      const result = await service.update(id, itemData);
      if (!result.error) {
        await fetchData();
        await fetchStats();
      }
      return result;
    },
    [service, fetchData, fetchStats]
  );

  const patchItem = useCallback(
    async (id, itemData) => {
      const result = await service.patch(id, itemData);
      if (!result.error) {
        await fetchData();
        await fetchStats();
      }
      return result;
    },
    [service, fetchData, fetchStats]
  );

  const updateStatus = useCallback(
    async (id, status) => {
      const result = await service.updateStatus(id, status);
      if (!result.error) {
        await fetchData();
        await fetchStats();
      }
      return result;
    },
    [service, fetchData, fetchStats]
  );

  const deleteItem = useCallback(
    async (id) => {
      const result = await service.delete(id);
      if (!result.error) {
        await fetchData();
        await fetchStats();
      }
      return result;
    },
    [service, fetchData, fetchStats]
  );

  const searchByPhone = useCallback(
    async (phone) => {
      return await service.getByPhone(phone);
    },
    [service]
  );

  // Initial fetch
  useEffect(() => {
    if (autoFetch) {
      fetchData();
      fetchStats();
    }
  }, [autoFetch, fetchData, fetchStats]);

  return {
    data: filteredData,
    allData,
    stats,
    loading,
    error,
    searchQuery,
    statusFilter,
    dateFrom,
    dateTo,
    fetchData,
    fetchStats,
    createItem,
    updateItem,
    patchItem,
    updateStatus,
    deleteItem,
    searchItems,
    searchByPhone,
    setStatusFilter: setStatusFilterValue,
    setDateRange,
    clearFilters,
    refetch: fetchData,
  };
};

export default useOrdersCrud;
