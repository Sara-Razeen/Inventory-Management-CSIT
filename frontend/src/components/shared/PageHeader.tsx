
import React from "react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

const PageHeader = ({ title, subtitle, actionLabel, onAction, icon }: PageHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6">
      <div className="flex items-center">
        {icon && <div className="mr-2">{icon}</div>}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      {actionLabel && onAction && (
        <Button className="mt-4 sm:mt-0" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default PageHeader;
