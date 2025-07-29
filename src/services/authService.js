// Token management and authentication utilities
export const authService = {
  // Store token
  setToken: (token) => {
    localStorage.setItem("adminToken", token);
  },

  // Get token
  getToken: () => {
    return localStorage.getItem("adminToken");
  },

  // Remove token
  removeToken: () => {
    localStorage.removeItem("adminToken");
  },

  // Check if admin is logged in
  isLoggedIn: () => {
    const token = localStorage.getItem("adminToken");
    return !!token;
  },
  // Logout function
  logout: () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  },

  // Make protected requests with token
  makeProtectedRequest: async (url, options = {}) => {
    const token = authService.getToken();

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  },
};

export default authService;
