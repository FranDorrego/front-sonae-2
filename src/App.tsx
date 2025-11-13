import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Status from "./pages/Status";
import Task from "./pages/Task";
import TarefasGerente from "./pages/TarefasGerente";
import Conselhos from "./pages/Conselhos";
import ConselhosEstrategico from "./pages/ConselhosEstrategico";
import Estatisticas from "./pages/Estatisticas";
import TestingCV from "./pages/TestingCV";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/status" element={<Status />} />
          <Route path="/task" element={<Task />} />
          <Route path="/tarefas-gerente" element={<TarefasGerente />} />
          <Route path="/conselhos" element={<Conselhos />} />
          <Route path="/conselhos-estrategico" element={<ConselhosEstrategico />} />
          <Route path="/estatisticas" element={<Estatisticas />} />
          <Route path="/testing-cv" element={<TestingCV />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
