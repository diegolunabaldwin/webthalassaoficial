import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Professionals from "./pages/Professionals";
import Professional from "./pages/Professional";
import ReviewInvite from "./pages/ReviewInvite";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LanguageProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Hub de Profesionales completo, con URL propia para posicionar */}
            <Route path="/profesionales" element={<Professionals />} />
            {/* Ficha individual: cada auditor es una entidad indexable aparte */}
            <Route path="/profesionales/:slug" element={<Professional />} />
            {/* Enlace privado que recibe el cliente para dejar su reseña */}
            <Route path="/resena/:token" element={<ReviewInvite />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
