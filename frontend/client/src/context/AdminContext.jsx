import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState([]);
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loginAdmin(email, password, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post("/api/admin/admin-login", {
        email,
        password
      });
      toast.success(data.message);
      setAdmin(data.user);
      setIsAdminAuth(true);
      setBtnLoading(false);
      navigate("/admin/dashboard"); // or your admin dashboard route
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      setBtnLoading(false);
    }
  }

  async function fetchAdmin() {
    try {
      const { data } = await axios.get("/api/admin/meadmin");
      setAdmin(data);
      setIsAdminAuth(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function logoutAdmin(navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post("/api/admin/logoutAdmin");
      toast.success(data.message);
      setAdmin([]);
      setIsAdminAuth(false);
      setBtnLoading(false);
      navigate("/admin/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
      setBtnLoading(false);
    }
  }
  async function fetchUnverifiedPharmacists() {
    setBtnLoading(true);
    try {
      const { data } = await axios.get("/api/admin/unverified-pharmacists");
      setBtnLoading(false);
      return data.pharmacists;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch pharmacists");
      setBtnLoading(false);
      return [];
    }
  }

  async function verifyPharmacist(userId) {
    setBtnLoading(true);
    try {
      const { data } = await axios.put("/api/admin/verify-pharmacist", { userId });
      toast.success(data.message);
      setBtnLoading(false);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
      setBtnLoading(false);
      return false;
    }
  }

  async function rejectPharmacist(userId) {
    setBtnLoading(true);
    try {
      const { data } = await axios.delete("/api/admin/reject-pharmacist", {
        data: { userId }
      });
      toast.success(data.message);
      setBtnLoading(false);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Rejection failed");
      setBtnLoading(false);
      return false;
    }
  }

  useEffect(() => {
    fetchAdmin();
    return () => { };
  }, []);

  return (
    <AdminContext.Provider
      value={{
        loginAdmin,
        logoutAdmin,
        btnLoading,
        isAdminAuth,
        admin,
        loading,
        setIsAdminAuth,
        setAdmin,
        fetchAdmin,
        fetchUnverifiedPharmacists,
        verifyPharmacist,
        rejectPharmacist
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

// Custom hook to access the context
export const AdminData = () => useContext(AdminContext);