import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users, UserCog, TrendingUp } from "lucide-react";

type Rol = "operador" | "gerente" | "estrategico";

const Index = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleSeleccionRol = (rol: Rol) => {
    // Guardar el rol seleccionado en localStorage
    localStorage.setItem("rol_usuario", rol);
    setOpen(false);
    
    // Redirigir según el rol
    if (rol === "operador") {
      navigate("/task");
    } else {
      navigate("/status");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Selecione sua Vista</DialogTitle>
            <DialogDescription>
              Escolha o perfil que melhor se adequa à sua função
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-3 mt-4">
            <Button
              variant="outline"
              className="h-auto py-4 px-6 flex items-center justify-start gap-4 hover:bg-primary hover:text-primary-foreground transition-all"
              onClick={() => handleSeleccionRol("operador")}
            >
              <Users className="h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold text-base">Operador</div>
                <div className="text-xs opacity-70">Gestão de tarefas e status por zona</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 px-6 flex items-center justify-start gap-4 hover:bg-primary hover:text-primary-foreground transition-all"
              onClick={() => handleSeleccionRol("gerente")}
            >
              <UserCog className="h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold text-base">Gerente</div>
                <div className="text-xs opacity-70">Status, conselhos e estatísticas da loja</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 px-6 flex items-center justify-start gap-4 hover:bg-primary hover:text-primary-foreground transition-all"
              onClick={() => handleSeleccionRol("estrategico")}
            >
              <TrendingUp className="h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold text-base">Estratégico/Gerência</div>
                <div className="text-xs opacity-70">Visão estratégica e análise completa</div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
