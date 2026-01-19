import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
const UserContext = createContext(); 

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  async function loginUser(email, password, navigate, fetchPins) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post("/api/user/login", { email, password });
      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      
      // Navigate based on role
      if (data.user.role === 'pharmacist') {
        navigate("/pharmacist/dashboard");
      } else {
        navigate("/");
      }
      
      if (fetchPins) fetchPins();
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  }



  async function forgotUser(email,navigate) {
    setBtnLoading(true);
    try {
      const {data} = await axios.post("/api/user/forget", {email});
      toast.success(data.message);
      setBtnLoading(false);
      const token =data.token;
      navigate("/reset-password/"+token);
    
  } catch (error) {
    toast.error(error.response.data.message);
    setBtnLoading(false);
  }
  }

  async function resetUser(token,otp,password,navigate) {
    setBtnLoading(true);
    try {
      const {data} = await axios.post("/api/user/reset-password/"+token, {otp,password});
      toast.success(data.message);
      setBtnLoading(false);
      navigate("/login");
    
  } catch (error) {
    toast.error(error.response.data.message);
    setBtnLoading(false);
  }
  }

  async function registerUser(name, email, mobile, password, role, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post("/api/user/register", { name, email, mobile, password, role });
      toast.success(data.message);
      const token=data.token
      setBtnLoading(false);
      navigate("/verify/"+token);
      
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  }

  async function verify(token, otp,navigate, fetchPins) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post("/api/user/verifyOtp/"+token, {otp });
      toast.success(data.message);
      
      // Don't set auth for pharmacists awaiting verification
      if (data.user.role === 'pharmacist') {
        toast.info("Your account is pending admin verification. You will be able to login once approved.");
        setIsAuth(false);
        setBtnLoading(false);
        navigate("/login");
      } else {
        setUser(data.user);
        setIsAuth(true);
        setBtnLoading(false);
        navigate("/");
        if (fetchPins) fetchPins();
      }
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
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
    <UserContext.Provider
      value={{
        loginUser,
        btnLoading,
        isAuth,
        user,
        loading,
        registerUser,
        setIsAuth,
        setUser,
        forgotUser, 
        resetUser,
        verify,
        fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access the context
export const UserData = () => useContext(UserContext);