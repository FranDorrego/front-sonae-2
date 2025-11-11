import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, MapPin, Lightbulb } from "lucide-react";
import logo from "@/assets/sonae-logo.png";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-20 md:w-24 bg-primary flex flex-col items-center py-6 gap-8">
        <img src={logo} alt="Sonae" className="w-14 md:w-16 object-contain" />
        
        <nav className="flex flex-col gap-6 mt-8">
          <Link
            to="/status"
            className={`p-3 rounded-lg transition-colors ${
              isActive("/status")
                ? "bg-secondary text-secondary-foreground"
                : "text-primary-foreground hover:bg-sidebar-accent"
            }`}
            title="Status"
          >
            <MapPin className="w-6 h-6" />
          </Link>
          
          <Link
            to="/conselhos"
            className={`p-3 rounded-lg transition-colors ${
              isActive("/conselhos")
                ? "bg-secondary text-secondary-foreground"
                : "text-primary-foreground hover:bg-sidebar-accent"
            }`}
            title="Conselhos"
          >
            <Lightbulb className="w-6 h-6" />
          </Link>
          
          <Link
            to="/estatisticas"
            className={`p-3 rounded-lg transition-colors ${
              isActive("/estatisticas")
                ? "bg-secondary text-secondary-foreground"
                : "text-primary-foreground hover:bg-sidebar-accent"
            }`}
            title="Estatísticas"
          >
            <BarChart3 className="w-6 h-6" />
          </Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
