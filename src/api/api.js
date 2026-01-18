import axios from "axios";
import { toast } from "react-toastify";

const BaseUrl = import.meta.env.VITE_BACKEND_URL;

// 🔥 IMPORTANT: always send cookies
axios.defaults.withCredentials = true;

/* ===== Fetch Logged-in User ===== */
export const HandlefetchUser = async () => {
  try {
    const response = await axios.get(`${BaseUrl}/api/user`);
    return response.data.user;
  } catch (error) {
    console.error(
      "Error fetching logged-in user:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

/* ===== Logout ===== */
export const HandleLogout = async () => {
  try {
    const response = await axios.post(`${BaseUrl}/auth/logout`);
    window.location.reload();
    toast.success(response.data.message || "Logout successful");
    return response.data;
  } catch (error) {
    console.error("Logout API failed:", error.response?.data || error.message);
    throw error;
  }
};

/* ===== Fetch All Users (Admin) ===== */
export const HandleFetchAllUsers = async () => {
  try {
    const response = await axios.get(`${BaseUrl}/api/all-user`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching all users:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

/* ===== Update User ===== */
export const HandleUpdateUser = async ({ id, data }) => {
  try {
    if (!id) throw new Error("User ID is required");

    const response = await axios.put(`${BaseUrl}/api/user-update/${id}`, data, {
      headers: { "Content-Type": "application/json" },

      withCredentials: true,
    });
    toast.success(response.data.message || "User updated successfully");
    return response.data;
  } catch (error) {
    console.error(
      "Failed to update user:",
      error.response?.data || error.message,
    );
    toast.error(
      error.response?.data?.message ||
        "Failed to update user. Please try again.",
    );
    throw error;
  }
};

/* ===== Create User ===== */
export const HandleCreateUser = async (formData) => {
  try {
    const response = await axios.post(`${BaseUrl}/api/create`, formData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
    toast.success(response.data.message || "User created successfully");
  } catch (error) {
    console.error(
      "Failed to create user:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

/* ===== Delete User ===== */
export const HandleDeleteUser = async (id) => {
  try {
    const { data } = await axios.delete(`${BaseUrl}/api/user-delete/${id}`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return data;
  } catch (error) {
    console.error(
      "Failed to delete user:",
      error.response?.data || error.message,
    );
    toast.error(
      error.response?.data?.message ||
        "Failed to delete user. Please try again.",
    );
    throw error;
  }
};

export const HandleBulkUserUpload = async (formData) => {
  try {
    const response = await axios.post(`${BaseUrl}/api/bulk-user`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    toast.success(response.data.message || "Bulk user upload successful");
    return response.data;
  } catch (error) {
    console.error(
      "Failed to upload users in bulk:",
      error.response?.data || error.message,
    );
    toast.error(
      error.response?.data?.message ||
        "Bulk user upload failed. Please try again.",
    );
    throw error;
  }
};
