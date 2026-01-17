import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import OtpVerify from "./pages/OtpVerify";

import UploadPrescription from "./pages/UploadPrescription";
import PharmacistPrescriptions from "./pages/PharmacistPrescriptions";

import { UserData } from "./context/UserContext";
import { Loading } from "./components/Loading";

const App = () => {
  const { loading, isAuth, user } = UserData();

  if (loading) return <Loading />;

  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC / AUTH ROUTES ================= */}
        <Route path="/" element={isAuth ? <Home /> : <Login />} />

        <Route path="/login" element={isAuth ? <Home /> : <Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/verify/:token"
          element={isAuth ? <Home /> : <OtpVerify />}
        />

        <Route path="/forgot" element={!isAuth ? <Forgot /> : <Home />} />

        <Route path="/reset-password/:token" element={<Reset />} />

        {/* ================= CUSTOMER ROUTES ================= */}
        <Route
          path="/upload-prescription"
          element={
            isAuth && user?.role === "customer" ? (
              <UploadPrescription />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* ================= PHARMACIST ROUTES ================= */}
        <Route
          path="/pharmacist/prescriptions"
          element={
            isAuth && user?.role === "pharmacist" ? (
              <PharmacistPrescriptions />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
