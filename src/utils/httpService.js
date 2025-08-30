import axios from 'axios';

export const baseURL = process.env.VUE_APP_BASE_URL;

export default function createAxiosService() {
  
  const trimLeadingSlash = (endpoint) => {
    return endpoint.startsWith("/") ? endpoint.substring(1) : endpoint;
  };

  return {
    get: async (endpoint, options = {}) => {
      try {
        const response = await axios.get(`${baseURL}/${trimLeadingSlash(endpoint)}`, {
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
          ...options, 
        });
        return response.data; 
      } catch (error) {
        console.error("GET request error:", error);
        throw error; 
      }
    },

    post: async (endpoint, body, options = {}) => {
      try {
        const response = await axios.post(`${baseURL}/${trimLeadingSlash(endpoint)}`, body, {
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
          ...options, 
        });
        return response.data; 
      } catch (error) {
        console.error("POST request error:", error);
        throw error;
      }
    },

    put: async (endpoint, body, options = {}) => {
      try {
        const response = await axios.put(`${baseURL}/${trimLeadingSlash(endpoint)}`, body, {
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
          ...options,
        });
        return response.data;
      } catch (error) {
        console.error("PUT request error:", error);
        throw error;
      }
    },

    delete: async (endpoint, options = {}) => {
      try {
        const response = await axios.delete(`${baseURL}/${trimLeadingSlash(endpoint)}`, {
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
          ...options,
        });
        return response.data; 
      } catch (error) {
        console.error("DELETE request error:", error);
        throw error;
      }
    }
  };
}