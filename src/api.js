// Central API helper for all backend calls
const BASE_URL = "http://98.89.166.198:3001";

export const apiFetch = async (endpoint, options = {}) => {
  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };

  if (options.body && typeof options.body === "object") {
    config.body = JSON.stringify(options.body);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, config);
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Network error");
  }
  return res.json();
};
