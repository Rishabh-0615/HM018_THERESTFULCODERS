import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { UserData } from "./context/UserContext";
import { UserDataDhruv } from "./context/UserContext.dhruv";
import { Loading } from "./components/Loading";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import OtpVerify from "./pages/OtpVerify";

// Dhruv's pages
import HomeDhruv from "./pages/Home.dhruv";
import LoginDhruv from "./pages/Login.dhruv";
import RegisterDhruv from "./pages/Register.dhruv";
import PrescriptionListDhruv from "./pages/PrescriptionList.dhruv";
import PrescriptionOrderDhruv from "./pages/PrescriptionOrder.dhruv";
import CheckoutDhruv from "./pages/Checkout.Dhruv";
import OrdersDhruv from "./pages/Orders.dhruv";
import PharmacistDashboardPratik from "./pages/PharmacistDashboard.pratik";
import MedicinesListPratik from "./pages/MedicinesList.pratik";
import AddMedicinePratik from "./pages/AddMedicine.pratik";
import EditMedicinePratik from "./pages/EditMedicine.pratik";
import MedicineDetailPratik from "./pages/MedicineDetail.pratik";
import InventoryPratik from "./pages/Inventory.pratik";
import OrdersPratik from "./pages/Orders.pratik";
import OrderDetailPratik from "./pages/OrderDetail.pratik";
import MyPrescriptions from "./pages/MyPrescriptions";
import UploadPrescription from "./pages/UploadPrescription";
import PharmacistDashboard from "./pages/PharmacistDashboard";
//import { UserData } from "./context/UserContext";
//import { Loading } from "./components/Loading";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuth, user } = UserData();

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  // Original context for team routes
  const { loading, isAuth, user } = UserData();

  // Dhruv's context for customer portal routes
  const { loading: loadingDhruv, isAuth: isAuthDhruv } = UserDataDhruv();

  // Redirect authenticated users based on role
  const getHomeRedirect = () => {
    if (!isAuth) return <Login />;

    if (user.role === "pharmacist") {
      return <Navigate to="/pharmacist/dashboard" />;
    }

    return <Home />;
  };

  return (
    <>
      {loading || loadingDhruv ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Routes>
            {/* Main Routes */}
            <Route path="/" element={getHomeRedirect()} />

            <Route
              path="/login"
              element={!isAuth ? <Login /> : getHomeRedirect()}
            />
            <Route
              path="/verify/:token"
              element={!isAuth ? <OtpVerify /> : getHomeRedirect()}
            />
            <Route
              path="/register"
              element={!isAuth ? <Register /> : getHomeRedirect()}
            />
            <Route
              path="/forgot"
              element={!isAuth ? <Forgot /> : getHomeRedirect()}
            />
            <Route path="/reset-password/:token" element={<Reset />} />
            {/* Medicine Detail Route - accessible to authenticated users */}
            <Route
              path="/medicine.pratik/:id"
              element={
                <ProtectedRoute allowedRoles={["pharmacist", "customer"]}>
                  <MedicineDetailPratik />
                </ProtectedRoute>
              }
            />

            {/* Pharmacist Routes */}
            <Route
              path="/pharmacist/dashboard"
              element={
                <ProtectedRoute allowedRoles={["pharmacist"]}>
                  <PharmacistDashboardPratik />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pharmacist/medicines.pratik"
              element={
                <ProtectedRoute allowedRoles={["pharmacist"]}>
                  <MedicinesListPratik />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pharmacist/add-medicine.pratik"
              element={
                <ProtectedRoute allowedRoles={["pharmacist"]}>
                  <AddMedicinePratik />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pharmacist/dashboard"
              element={
                <ProtectedRoute allowedRoles={["pharmacist"]}>
                  <PharmacistDashboard /> {/* Use the new component */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-prescriptions"
              element={
                <ProtectedRoute allowedRoles={["customer", "pharmacist"]}>
                  <MyPrescriptions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload-prescription"
              element={
                <ProtectedRoute allowedRoles={["customer", "pharmacist"]}>
                  <UploadPrescription />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pharmacist/edit-medicine.pratik/:id"
              element={
                <ProtectedRoute allowedRoles={["pharmacist"]}>
                  <EditMedicinePratik />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pharmacist/inventory.pratik"
              element={
                <ProtectedRoute allowedRoles={["pharmacist"]}>
                  <InventoryPratik />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pharmacist/orders.pratik"
              element={
                <ProtectedRoute allowedRoles={["pharmacist"]}>
                  <OrdersPratik />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pharmacist/order.pratik/:id"
              element={
                <ProtectedRoute allowedRoles={["pharmacist"]}>
                  <OrderDetailPratik />
                </ProtectedRoute>
              }
            />

            {/* Dhruv's Customer Portal Routes */}
            <Route
              path="/dhruv/login"
              element={
                !isAuthDhruv ? <LoginDhruv /> : <Navigate to="/dhruv/home" />
              }
            />
            <Route
              path="/dhruv/register"
              element={
                !isAuthDhruv ? <RegisterDhruv /> : <Navigate to="/dhruv/home" />
              }
            />
            <Route
              path="/dhruv/home"
              element={
                isAuthDhruv ? <HomeDhruv /> : <Navigate to="/dhruv/login" />
              }
            />
            <Route
              path="/dhruv/prescriptions"
              element={
                isAuthDhruv ? (
                  <PrescriptionListDhruv />
                ) : (
                  <Navigate to="/dhruv/login" />
                )
              }
            />
            <Route
              path="/dhruv/prescription/:prescriptionId"
              element={
                isAuthDhruv ? (
                  <PrescriptionOrderDhruv />
                ) : (
                  <Navigate to="/dhruv/login" />
                )
              }
            />
            <Route
              path="/dhruv/checkout"
              element={
                isAuthDhruv ? <CheckoutDhruv /> : <Navigate to="/dhruv/login" />
              }
            />
            <Route
              path="/dhruv/orders"
              element={
                isAuthDhruv ? <OrdersDhruv /> : <Navigate to="/dhruv/login" />
              }
            />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
