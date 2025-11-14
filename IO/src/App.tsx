import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import NotFound from "./pages/NotFound";
import ReemplazoEquipos from "./pages/ReemplazoEquipos";
import ArbolesBinarios from "./pages/ArbolesBinarios";
import SeriesDeportivas from "./pages/SeriesDeportivas";
import MultiplicacionMatrices from "./pages/MultiplicacionMatrices";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/reemplazo-equipos" element={<ReemplazoEquipos />} />
          <Route path="/arboles-binarios" element={<ArbolesBinarios />} />
          <Route path="/series-deportivas" element={<SeriesDeportivas />} />
          <Route path="/multiplicacion-matrices" element={<MultiplicacionMatrices />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
