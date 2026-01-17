import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const UserContextDhruv = createContext(); 

export const UserProviderDhruv = ({ children }) => {
  const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  async function loginUser(email, password, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post("/api/user/login", { email, password });
      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/dhruv/home");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      setBtnLoading(false);
    }
  }

  async function registerUser(name, email, mobile, password, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post("/api/user/register", { 
        name, 
        email, 
        mobile, 
        password,
        role: "customer"  // Customer portal always registers as customer
      });
      toast.success(data.message);
      const token = data.token;
      setBtnLoading(false);
      navigate("/verify/" + token);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      setBtnLoading(false);
    }
  }

  async function logoutUser(navigate) {
    try {
      const { data } = await axios.get("/api/user/logout");
      toast.success(data.message);
      setUser([]);
      setIsAuth(false);
      navigate("/dhruv/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  }

  const [loading, setLoading] = useState(true);
  
  async function fetchUser() {
    try {
      const { data } = await axios.get("/api/user/me");
      setUser(data);
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
    return () => {};
  }, []);

  return (
    <UserContextDhruv.Provider
      value={{
        loginUser,
        registerUser,
        logoutUser,
        btnLoading,
        isAuth,
        user,
        loading,
        setIsAuth,
        setUser,
        fetchUser,
      }}
    >
      {children}
    </UserContextDhruv.Provider>
  );
};

// Custom hook to access the context
export const UserDataDhruv = () => useContext(UserContextDhruv);
