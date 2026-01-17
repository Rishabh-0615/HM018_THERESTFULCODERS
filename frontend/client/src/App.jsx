import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import OtpVerify from "./pages/OtpVerify";
import UploadPrescription from "./pages/UploadPrescription";
import PharmacistDashboard from "./pages/PharmacistDashboard";
import MyPrescriptions from "./pages/MyPrescriptions";
import { UserData } from "./context/UserContext";
import { Loading } from "./components/Loading";

const App = () => {
  const { loading, isAuth, user } = UserData();
  console.log(isAuth);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={isAuth ? <Home /> : <Login />} />

            <Route
              path="/login"
              element={isAuth ? <Navigate to="/" /> : <Login />}
            />

            <Route
              path="/register"
              element={isAuth ? <Navigate to="/" /> : <Register />}
            />

            <Route
              path="/verify/:token"
              element={isAuth ? <Navigate to="/" /> : <OtpVerify />}
            />

            <Route
              path="/forgot"
              element={isAuth ? <Navigate to="/" /> : <Forgot />}
            />

            <Route path="/reset-password/:token" element={<Reset />} />

            {/* Protected Customer Routes */}
            <Route
              path="/upload-prescription"
              element={
                isAuth && user?.role === "customer" ? (
                  <UploadPrescription />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/my-prescriptions"
              element={
                isAuth && user?.role === "customer" ? (
                  <MyPrescriptions />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Protected Pharmacist Routes */}
            <Route
              path="/pharmacist-dashboard"
              element={
                isAuth &&
                (user?.role === "pharmacist" || user?.role === "admin") ? (
                  <PharmacistDashboard />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Catch-all route for 404 */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
