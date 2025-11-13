import { Link, useLocation } from "react-router-dom";
import { MapPin, Lightbulb, BarChart3 } from "lucide-react";
import logo from "@/assets/sonae-logo.png";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";

interface TopNavProps {
  stores?: { value: string; label: string }[];
  selectedStore?: string;
  onStoreChange?: (value: string) => void;
  showMockBadge?: boolean;
  currentView?: string;
}

export default function TopNav({ stores, selectedStore, onStoreChange, showMockBadge, currentView }: TopNavProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const isOperador = currentView === "operador";
  const isGerente = currentView === "gerente";
  const isEstrategico = currentView === "estrategico";

  const getHomeUrl = () => {
    window.location.href = "/";
  }
  
  // Construir URLs con el parámetro view
  const buildUrl = (path: string) => {
    return currentView ? `${path}?view=${currentView}` : path;
  };

  return (
    <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo */}
        <img src={logo} alt="Sonae" className="h-6 sm:h-8 object-contain flex-shrink-0 cursor-pointer" onClick={getHomeUrl}  />
        
        {/* Navigation - hidden on mobile */}
        <nav className="hidden md:flex gap-2 flex-1 justify-center">
          {isOperador ? (
            <>
              <Link
                to={buildUrl("/task")}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive("/task")
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                <span className="text-sm font-medium">Tarefas</span>
              </Link>
              
              <Link
                to={buildUrl("/status")}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive("/status")
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Status</span>
              </Link>
            </>
          ) : isGerente ? (
            <>
              <Link
                to={buildUrl("/status")}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive("/status")
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Status</span>
              </Link>
              
              <Link
                to={buildUrl("/conselhos")}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive("/conselhos")
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                <span className="text-sm font-medium">Conselhos</span>
              </Link>

              <Link
                to={buildUrl("/tarefas-gerente")}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive("/tarefas-gerente")
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                <span className="text-sm font-medium">Tarefas</span>
              </Link>
            </>
          ) : isEstrategico ? (
            <>
              <Link
                to={buildUrl("/status")}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive("/status")
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Status</span>
              </Link>
              
              <Link
                to={buildUrl("/estatisticas")}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive("/estatisticas")
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">Estatísticas</span>
              </Link>
              
              <Link
                to={buildUrl("/conselhos-estrategico")}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive("/conselhos-estrategico")
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                <span className="text-sm font-medium">Conselhos</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to={buildUrl("/status")}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive("/status")
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Status</span>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Navigation - icons only */}
        <nav className="flex md:hidden gap-1 flex-1 justify-center">
          {isOperador ? (
            <>
              <Link
                to={buildUrl("/task")}
                className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 ${
                  isActive("/task")
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Lightbulb className="w-4 h-4" />
              </Link>
              
              <Link
                to={buildUrl("/status")}
                className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 ${
                  isActive("/status")
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <MapPin className="w-4 h-4" />
              </Link>
            </>
          ) : isGerente ? (
            <>
              <Link
                to={buildUrl("/status")}
                className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 ${
                  isActive("/status")
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <MapPin className="w-4 h-4" />
              </Link>
              
              <Link
                to={buildUrl("/conselhos")}
                className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 ${
                  isActive("/conselhos")
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Lightbulb className="w-4 h-4" />
              </Link>
              
              <Link
                to={buildUrl("/tarefas-gerente")}
                className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 ${
                  isActive("/tarefas-gerente")
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Lightbulb className="w-4 h-4" />
              </Link>
            </>
          ) : isEstrategico ? (
            <>
              <Link
                to={buildUrl("/status")}
                className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 ${
                  isActive("/status")
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <MapPin className="w-4 h-4" />
              </Link>
              
              <Link
                to={buildUrl("/estatisticas")}
                className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 ${
                  isActive("/estatisticas")
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
              </Link>
              
              <Link
                to={buildUrl("/conselhos-estrategico")}
                className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 ${
                  isActive("/conselhos-estrategico")
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Lightbulb className="w-4 h-4" />
              </Link>
            </>
          ) : (
            <>
              <Link
                to={buildUrl("/status")}
                className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 ${
                  isActive("/status")
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <MapPin className="w-4 h-4" />
              </Link>
            </>
          )}
        </nav>
        
        {/* Right Side - Store selector and Mock badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {showMockBadge && (
            <Badge variant="outline" className="text-[10px] sm:text-xs text-muted-foreground border-muted-foreground/30 whitespace-nowrap">
              Mock
            </Badge>
          )}
          
          {stores && stores.length > 0 && onStoreChange && (
            <Select value={selectedStore} onValueChange={onStoreChange}>
              <SelectTrigger className="w-[100px] sm:w-[140px] h-8 text-xs sm:text-sm">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store) => (
                  <SelectItem key={store.value} value={store.value}>
                    {store.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </header>
  );
}
