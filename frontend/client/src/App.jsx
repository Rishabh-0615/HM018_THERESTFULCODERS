import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { UserData } from "./context/UserContext";
import { Loading } from "./components/Loading";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import OtpVerify from "./pages/OtpVerify";
import PharmacistDashboardPratik from "./pages/PharmacistDashboard.pratik";
import MedicinesListPratik from "./pages/MedicinesList.pratik";
import AddMedicinePratik from "./pages/AddMedicine.pratik";
import EditMedicinePratik from "./pages/EditMedicine.pratik";
import MedicineDetailPratik from "./pages/MedicineDetail.pratik";
import InventoryPratik from "./pages/Inventory.pratik";
import OrdersPratik from "./pages/Orders.pratik";
import OrderDetailPratik from "./pages/OrderDetail.pratik";

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
  
  // Redirect authenticated users based on role
  const getHomeRedirect = () => {
    if (!isAuth) return <Login />;
    
    if (user.role === 'pharmacist') {
      return <Navigate to="/pharmacist/dashboard" />;
    }
    
    return <Home />;
  };
  
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={getHomeRedirect()} />          
            
            <Route path="/login" element={!isAuth ? <Login /> : getHomeRedirect()} />
            <Route path="/verify/:token" element={!isAuth ? <OtpVerify /> : getHomeRedirect()} />
            <Route path="/register" element={!isAuth ? <Register /> : getHomeRedirect()} />
            <Route path="/forgot" element={!isAuth ? <Forgot /> : getHomeRedirect()} />
            <Route path="/reset-password/:token" element={<Reset />} />
            
            {/* Medicine Detail Route - accessible to authenticated users */}
            <Route 
              path="/medicine.pratik/:id" 
              element={
                <ProtectedRoute allowedRoles={['pharmacist', 'customer']}>
                  <MedicineDetailPratik />
                </ProtectedRoute>
              } 
            />
            
            {/* Pharmacist Routes */}
            <Route 
              path="/pharmacist/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['pharmacist']}>
                  <PharmacistDashboardPratik />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pharmacist/medicines.pratik" 
              element={
                <ProtectedRoute allowedRoles={['pharmacist']}>
                  <MedicinesListPratik />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pharmacist/add-medicine.pratik" 
              element={
                <ProtectedRoute allowedRoles={['pharmacist']}>
                  <AddMedicinePratik />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pharmacist/edit-medicine.pratik/:id" 
              element={
                <ProtectedRoute allowedRoles={['pharmacist']}>
                  <EditMedicinePratik />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pharmacist/inventory.pratik" 
              element={
                <ProtectedRoute allowedRoles={['pharmacist']}>
                  <InventoryPratik />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pharmacist/orders.pratik" 
              element={
                <ProtectedRoute allowedRoles={['pharmacist']}>
                  <OrdersPratik />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pharmacist/order.pratik/:id" 
              element={
                <ProtectedRoute allowedRoles={['pharmacist']}>
                  <OrderDetailPratik />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;