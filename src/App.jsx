import React from "react";
import { Toaster } from "react-hot-toast";

// Components
import Navbar from "./Component/Navbar";
import Home from "./Component/Home";
import About from "./Component/About";
import Contact from "./Component/Contact";
import Floatingbutton from "./Component/Floatingbutton";
import Login from "./Component/login";
import Signup from "./Component/Signup";
import Product from "./Component/Product";
import AllBlogs from "./Component/Blogs";
import BlogDetails from "./Component/BlogDetails";
import BuyNow from "./Component/BuyNow";
import Ordersuccessful from "./Component/Ordersuccessful";
import CancelPayment from "./Cancelpayment";
import Consultation from "./Component/Consultation";
import MyConsultations from "./Component/MyConsultations";

// Router
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AllProducts from "./Component/AllProducts";
import MyOrders from "./Component/MyOrders";

import UserProtectedRoute from "./Component/Protected/UserProtectedRoute";
import AdminProtectedRoute from "./Component/Protected/AdminProtectedRoute";
import Cart from "./Component/Cart";
import ForgotPassword from "./Component/Forgetpassword";
import ResetPassword from "./Component/ResetPassword";
import DashboardLayout from "./Component/DashboardLayout";
import ProductForm from "./Component/ProductForm";
import BlogForm from "./Component/BlogForm";
import AllOrders from "./Component/AllOrders";
import Footer from "./Component/Footer";
import RouteTracker from "./Component/RouteTracker";

const App = () => {
  return (
    <BrowserRouter>
    <RouteTracker/>
      <Toaster position="top-center" />
      <div className="w-full min-h-screen bg-white overflow-x-hidden">
        <Navbar />

        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgetpassword" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/all_products" element={<AllProducts isAdmin={false} />} />
          <Route path="/product_details/:id" element={<Product />} />
          {/* <Route path="/product" element={<Product />} /> */}

          <Route path="/all_blogs" element={<AllBlogs isAdmin={false} />} />
          <Route path="/blog_details/:id" element={<BlogDetails />} />

          <Route
            path="/buynow"
            element={
              <UserProtectedRoute>
                <BuyNow />
              </UserProtectedRoute>
            }
          />

          <Route path="/order_successful" element={<Ordersuccessful />} />
          <Route path="/cancelpayment" element={<CancelPayment />} />

          <Route
            path="/my_consultations"
            element={
              <UserProtectedRoute>
                <MyConsultations />
              </UserProtectedRoute>
            }
          />

          <Route
            path="/my_order"
            element={
              <UserProtectedRoute>
                <MyOrders />
              </UserProtectedRoute>
            }
          />

          <Route path="/my_cart" element={<Cart />} />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <DashboardLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<Navigate to="all-products" replace />} />
            <Route path="all-products" element={<AllProducts isAdmin={true} />} />
            <Route path="add-product" element={<ProductForm />} />
            <Route path="all-blogs" element={<AllBlogs isAdmin={true} />} />
            <Route path="add-blogs" element={<BlogForm />} />
            <Route path="all-orders" element={<AllOrders />} />
          </Route>

          {/* Optional fallback */}
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Routes>
            <Footer/>
        <Floatingbutton />

      </div>
    </BrowserRouter>
  );
};

export default App;