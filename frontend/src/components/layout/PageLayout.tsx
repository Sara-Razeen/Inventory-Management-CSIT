
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 pl-64">
        <Header />
        <main className="container py-6">{children}</main>
      </div>
    </div>
  );
};

export default PageLayout;
