import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { Toaster } from "react-hot-toast";
import OrdersPage from "./pages/orders/ordersPage";
import CategoryPage from "./pages/CategoryPage";
import LanguagePage from "./pages/LanguagePage";
import UserPage from "./pages/UserPage";
import ProductPage from "./pages/ProductPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <>
      <Router>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { zIndex: 9999999 },
          }}
        />
        <ScrollToTop />
        <Routes>
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index path="/" element={<Home />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/language" element={<LanguagePage />} />
            <Route path="/users" element={<UserPage />} />
            <Route path="/blogs" element={<BlogPage />} />
            <Route path="/blogs/add" element={<BlogDetailPage />} />
            <Route path="/blogs/add/:id" element={<BlogDetailPage />} />
          </Route>
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </Router>
    </>
  );
}
