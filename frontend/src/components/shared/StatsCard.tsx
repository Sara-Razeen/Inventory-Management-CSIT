
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isUpward: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

const StatsCard = ({ title, value, trend, icon, className }: StatsCardProps) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
            {trend && (
              <div className={cn(
                "flex items-center mt-1 text-xs font-medium",
                trend.isUpward ? "text-green-500" : "text-red-500"
              )}>
                {trend.isUpward ? (
                  <ArrowUp className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDown className="mr-1 h-3 w-3" />
                )}
                <span>{Math.abs(trend.value)}%</span>
                <span className="ml-1 text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
          {icon && (
            <div className="rounded-full p-2 bg-primary/10 text-primary">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
