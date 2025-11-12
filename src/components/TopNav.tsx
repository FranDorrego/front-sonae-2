import { Link, useLocation } from "react-router-dom";
import { MapPin, Lightbulb, BarChart3 } from "lucide-react";
import logo from "@/assets/sonae-logo.png";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Loja } from "@/services/backendService";

interface TopNavProps {
  stores?: Loja[];
  selectedStore?: string;
  onStoreChange?: (value: string) => void;
  showMockBadge?: boolean;
}

export default function TopNav({ stores, selectedStore, onStoreChange, showMockBadge }: TopNavProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo */}
        <img src={logo} alt="Sonae" className="h-6 sm:h-8 object-contain flex-shrink-0" />
        
        {/* Navigation - hidden on mobile */}
        <nav className="hidden md:flex gap-2 flex-1 justify-center">
          <Link
            to="/status"
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
            to="/conselhos"
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
            to="/estatisticas"
            className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 ${
              isActive("/estatisticas")
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm font-medium">Estatísticas</span>
          </Link>
        </nav>

        {/* Mobile Navigation - icons only */}
        <nav className="flex md:hidden gap-1 flex-1 justify-center">
          <Link
            to="/status"
            className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 ${
              isActive("/status")
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <MapPin className="w-4 h-4" />
          </Link>
          
          <Link
            to="/conselhos"
            className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 ${
              isActive("/conselhos")
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Lightbulb className="w-4 h-4" />
          </Link>
          
          <Link
            to="/estatisticas"
            className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 ${
              isActive("/estatisticas")
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
          </Link>
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
                <SelectValue placeholder="Loja" />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id.toString()}>
                    {store.nombre}
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
