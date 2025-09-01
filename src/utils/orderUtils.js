/**
 * Utility functions for order management
 */

/**
 * Generates a 6-digit random order ID
 * @returns {string} 6-digit order ID
 */
export const generateOrderId = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generates a more unique order ID using timestamp and random number
 * @returns {string} 6-digit order ID
 */
export const generateUniqueOrderId = () => {
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(10 + Math.random() * 90).toString();
  return timestamp + random;
};

/**
 * Validates if a string is a valid 6-digit order ID
 * @param {string} orderId - Order ID to validate
 * @returns {boolean} True if valid 6-digit order ID
 */
export const isValidOrderId = (orderId) => {
  return /^\d{6}$/.test(orderId);
};

/**
 * Creates order with retry logic for handling duplicate order IDs
 * @param {Object} orderData - Order data object
 * @param {Function} createOrderFn - Function to create order
 * @param {number} maxRetries - Maximum number of retry attempts
 * @returns {Promise<Object>} Order creation result
 */
export const createOrderWithRetry = async (
  orderData,
  createOrderFn,
  maxRetries = 3
) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await createOrderFn(orderData);

      if (result.success || !result.error) {
        return result;
      }

      // Handle duplicate order ID (409 Conflict)
      if (
        result.error?.includes("already exists") ||
        result.error?.includes("duplicate")
      ) {
        if (attempt < maxRetries) {
          orderData.orderId = generateOrderId();
          console.log(
            `Order ID collision, retrying with: ${orderData.orderId}`
          );
          continue;
        }
      }

      throw new Error(result.error || "Order creation failed");
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
    }
  }
};

/**
 * Formats order display ID with prefix
 * @param {string} orderId - Order ID
 * @returns {string} Formatted order ID
 */
export const formatOrderId = (orderId) => {
  return orderId ? `#${orderId}` : "N/A";
};

/**
 * Gets searchable order fields for filtering
 * @param {Object} order - Order object
 * @returns {string[]} Array of searchable field values
 */
export const getSearchableOrderFields = (order) => {
  return [
    order.customerName,
    order.customerEmail,
    order.customerPhone,
    order.orderId,
    order.orderNumber?.toString(),
    order.id?.toString(),
  ].filter(Boolean);
};

/**
 * Extracts order ID from various possible formats
 * @param {Object} order - Order object
 * @returns {string} Best available order ID
 */
export const extractOrderId = (order) => {
  return order.orderId || order.orderNumber || order.id || "Unknown";
};

/**
 * Gets customer-friendly order ID (6-digit custom ID)
 * @param {Object} order - Order object
 * @returns {string} Customer-friendly order ID
 */
export const getCustomerOrderId = (order) => {
  return order.orderId || "Not assigned";
};

/**
 * Gets system order ID (database ID)
 * @param {Object} order - Order object
 * @returns {string} System order ID
 */
export const getSystemOrderId = (order) => {
  return order.orderNumber || order.id || "Unknown";
};
