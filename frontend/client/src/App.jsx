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
import { AdminData } from "./context/AdminContext";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";


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
import DeliveryBoys from "./pages/DeliveryBoys";
import DeliveryBoyLogin from "./pages/DeliveryBoyLogin";
import DeliveryBoyForgotPassword from "./pages/DeliveryBoyForgotPassword";
import DeliveryBoyResetPassword from "./pages/DeliveryBoyResetPassword";
import DeliveryBoyChangePassword from "./pages/DeliveryBoyChangePassword";
import DeliveryBoyDashboard from "./DeliveryBoyDashboard";
import PharmaCare from "./pages/HeroSection";
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
  const { loading, isAuth, user} = UserData(); 
  const { loading: adminLoading, isAdminAuth, admin } = AdminData();
  console.log(isAuth);
  
  // Original context for team routes
  // const { loading, isAuth, user } = UserData();

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
            <Route path="/" element={<PharmaCare />} />          
            
            <Route path="/login" element={!isAuth ? <Login /> : getHomeRedirect()} />
            <Route path="/verify/:token" element={!isAuth ? <OtpVerify /> : getHomeRedirect()} />
            <Route path="/register" element={!isAuth ? <Register /> : getHomeRedirect()} />
            <Route path="/forgot" element={!isAuth ? <Forgot /> : getHomeRedirect()} />
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
              path="/pharmacist/delivery-boys" 
              element={
                <ProtectedRoute allowedRoles={['pharmacist']}>
                  <DeliveryBoys />
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
              path="/reset-password/:token"
              element={<Reset />}
            />
            <Route 
              path="/admin/login" 
              element={isAdminAuth ? <AdminDashboard /> : <AdminLogin />} 
            />
            <Route 
              path="/admin/dashboard" 
              element={isAdminAuth ? <AdminDashboard /> : <AdminLogin />} 
            />  

            
           
            <Route 
              path="/pharmacist/order.pratik/:id" 
          
              element={
                <ProtectedRoute allowedRoles={["pharmacist"]}>
                  <OrderDetailPratik />
                </ProtectedRoute>
              } 
            />
              <Route
                path="/delivery-boy/login"
                element={<DeliveryBoyLogin />}
              />
              <Route
                path="/delivery-boy/forgot-password"
                element={<DeliveryBoyForgotPassword />}
              />
              <Route
                path="/delivery-boy/reset-password/:token"
                element={<DeliveryBoyResetPassword />}
              />

              {/* Delivery Boy Routes - Protected */}
              <Route
                path="/delivery-boy/change-password"
                element={<DeliveryBoyChangePassword />}
              />
              <Route
                path="/delivery-boy/dashboard"
                element={<DeliveryBoyDashboard />}
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
