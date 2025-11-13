import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users, UserCog, TrendingUp, Camera } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type Rol = "operador" | "gerente" | "estrategico";

const Index = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleSeleccionRol = (rol: Rol) => {
    setOpen(false);
    
    // Redirigir según el rol con parámetro view en URL
    if (rol === "operador") {
      navigate("/task?view=operador");
    } else {
      navigate(`/status?view=${rol}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md w-full max-w-[95vw]">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">Selecione sua Vista</DialogTitle>
            <DialogDescription className="text-sm">
              Escolha o perfil que melhor se adequa à sua função
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-2 sm:gap-3 mt-4">
            <Button
              variant="outline"
              className="h-auto py-3 sm:py-4 px-4 sm:px-6 flex items-center justify-start gap-3 sm:gap-4 hover:bg-primary hover:text-primary-foreground transition-all"
              onClick={() => handleSeleccionRol("operador")}
            >
              <Users className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
              <div className="text-left">
                <div className="font-semibold text-sm sm:text-base">Operador</div>
                <div className="text-xs opacity-70">Gestão de tarefas e status por zona</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-3 sm:py-4 px-4 sm:px-6 flex items-center justify-start gap-3 sm:gap-4 hover:bg-primary hover:text-primary-foreground transition-all"
              onClick={() => handleSeleccionRol("gerente")}
            >
              <UserCog className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
              <div className="text-left">
                <div className="font-semibold text-sm sm:text-base">Gerente</div>
                <div className="text-xs opacity-70">Status, conselhos e tarefas da loja</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-3 sm:py-4 px-4 sm:px-6 flex items-center justify-start gap-3 sm:gap-4 hover:bg-primary hover:text-primary-foreground transition-all"
              onClick={() => handleSeleccionRol("estrategico")}
            >
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
              <div className="text-left">
                <div className="font-semibold text-sm sm:text-base">Estratégico/Gerência</div>
                <div className="text-xs opacity-70">Visão estratégica e análise completa</div>
              </div>
            </Button>

            <Separator className="my-3" />

            <Button
              variant="outline"
              className="h-auto py-3 sm:py-4 px-4 sm:px-6 flex items-center justify-start gap-3 sm:gap-4 hover:bg-secondary hover:text-secondary-foreground transition-all border-2"
              onClick={() => {
                setOpen(false);
                navigate("/testing-cv");
              }}
            >
              <Camera className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
              <div className="text-left">
                <div className="font-semibold text-sm sm:text-base">Visualizar CV / Testing CV</div>
                <div className="text-xs opacity-70">Teste o processo de análise de imagens</div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
