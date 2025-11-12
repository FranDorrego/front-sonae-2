import { ReactNode } from "react";
import TopNav from "./TopNav";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Loja } from "@/services/backendService";

interface LayoutProps {
  children: ReactNode;
  stores?: Loja[];
  selectedStore?: string;
  onStoreChange?: (value: string) => void;
}

export default function Layout({ children, stores, selectedStore, onStoreChange }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-background">
      <TopNav />
      {stores && stores.length > 0 && (
        <div className="border-b border-border/30 bg-muted/5 px-4 py-2 flex justify-end items-center gap-3">
          <label className="text-sm font-medium text-foreground">Loja:</label>
          <Select value={selectedStore} onValueChange={onStoreChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecione uma loja" />
            </SelectTrigger>
            <SelectContent>
              {stores.map((store) => (
                <SelectItem key={store.id} value={store.id.toString()}>
                  {store.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
