import { Link, useLocation } from "react-router-dom";
import { MapPin, Lightbulb, BarChart3 } from "lucide-react";
import logo from "@/assets/sonae-logo.png";

export default function TopNav() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-primary border-b border-primary/20 px-4 py-3 flex items-center justify-between">
      <img src={logo} alt="Sonae" className="h-8 object-contain" />
      
      <nav className="flex gap-6">
        <Link
          to="/status"
          className={`flex flex-col items-center gap-1 transition-colors ${
            isActive("/status")
              ? "text-secondary"
              : "text-primary-foreground/70 hover:text-primary-foreground"
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-xs font-medium">Status</span>
        </Link>
        
        <Link
          to="/conselhos"
          className={`flex flex-col items-center gap-1 transition-colors ${
            isActive("/conselhos")
              ? "text-secondary"
              : "text-primary-foreground/70 hover:text-primary-foreground"
          }`}
        >
          <Lightbulb className="w-5 h-5" />
          <span className="text-xs font-medium">Conselhos</span>
        </Link>
        
        <Link
          to="/estatisticas"
          className={`flex flex-col items-center gap-1 transition-colors ${
            isActive("/estatisticas")
              ? "text-secondary"
              : "text-primary-foreground/70 hover:text-primary-foreground"
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-xs font-medium">Estatísticas</span>
        </Link>
      </nav>
      
      <div className="w-8" />
    </header>
  );
}
