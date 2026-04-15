import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { OrderModeProvider } from "@/context/OrderModeContext";
import BottomNav from "@/components/BottomNav";
import FloatingCart from "@/components/FloatingCart";
import Preloader from "@/components/Preloader";
import Index from "./pages/Index";
import MenuPage from "./pages/Menu";
import DealsPage from "./pages/Deals";
import CustomDealPage from "./pages/CustomDeal";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import OrderHistory from "./pages/OrderHistory";
import Favorites from "./pages/Favorites";
import SavedAddresses from "./pages/SavedAddresses";
import AdminPage from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <OrderModeProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Preloader />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/deals" element={<DealsPage />} />
                <Route path="/custom-deal" element={<CustomDealPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/addresses" element={<SavedAddresses />} />
                <Route path="/admin-panel" element={<AdminPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <BottomNav />
              <FloatingCart />
            </BrowserRouter>
          </OrderModeProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
