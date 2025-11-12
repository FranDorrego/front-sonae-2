import { ReactNode } from "react";
import TopNav from "./TopNav";

interface LayoutProps {
  children: ReactNode;
  stores?: { value: string; label: string }[];
  selectedStore?: string;
  onStoreChange?: (value: string) => void;
  showMockBadge?: boolean;
  currentView?: string;
}

export default function Layout({ children, stores, selectedStore, onStoreChange, showMockBadge, currentView }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-background">
      <TopNav 
        stores={stores}
        selectedStore={selectedStore}
        onStoreChange={onStoreChange}
        showMockBadge={showMockBadge}
        currentView={currentView}
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
