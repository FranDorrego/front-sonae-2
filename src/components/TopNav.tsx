import { Link, useLocation } from "react-router-dom";
import { MapPin, Lightbulb, BarChart3 } from "lucide-react";
import logo from "@/assets/sonae-logo.png";

export default function TopNav() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <img src={logo} alt="Sonae" className="h-8 object-contain" />
        
        <nav className="flex gap-2">
          <Link
            to="/status"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              isActive("/status")
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Status</span>
          </Link>
          
          <Link
            to="/conselhos"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              isActive("/conselhos")
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span className="text-sm font-medium">Conselhos</span>
          </Link>
          
          <Link
            to="/estatisticas"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              isActive("/estatisticas")
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm font-medium">Estatísticas</span>
          </Link>
        </nav>
        
        <div className="w-8" />
      </div>
    </header>
  );
}
