import { Link, useLocation } from "react-router-dom";
import { MapPin, Lightbulb, BarChart3 } from "lucide-react";
import logo from "@/assets/sonae-logo.png";

export default function TopNav() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-gradient-to-r from-primary via-primary to-primary/95 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <img src={logo} alt="Sonae" className="h-10 object-contain" />
        
        <nav className="flex gap-1 bg-background/10 backdrop-blur-sm rounded-full p-1">
          <Link
            to="/status"
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all duration-300 ${
              isActive("/status")
                ? "bg-background text-primary shadow-lg"
                : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-background/20"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-semibold">Status</span>
          </Link>
          
          <Link
            to="/conselhos"
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all duration-300 ${
              isActive("/conselhos")
                ? "bg-background text-primary shadow-lg"
                : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-background/20"
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span className="text-sm font-semibold">Conselhos</span>
          </Link>
          
          <Link
            to="/estatisticas"
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all duration-300 ${
              isActive("/estatisticas")
                ? "bg-background text-primary shadow-lg"
                : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-background/20"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm font-semibold">Estatísticas</span>
          </Link>
        </nav>
        
        <div className="w-10" />
      </div>
    </header>
  );
}
