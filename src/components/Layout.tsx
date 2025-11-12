import { ReactNode } from "react";
import TopNav from "./TopNav";
import { Loja } from "@/services/backendService";

interface LayoutProps {
  children: ReactNode;
  stores?: Loja[];
  selectedStore?: string;
  onStoreChange?: (value: string) => void;
  showMockBadge?: boolean;
}

export default function Layout({ children, stores, selectedStore, onStoreChange, showMockBadge }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-background">
      <TopNav 
        stores={stores}
        selectedStore={selectedStore}
        onStoreChange={onStoreChange}
        showMockBadge={showMockBadge}
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
