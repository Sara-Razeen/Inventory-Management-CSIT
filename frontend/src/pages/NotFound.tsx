
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileWarning } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md p-6">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-amber-100 p-4">
            <FileWarning className="h-12 w-12 text-amber-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Sorry, we couldn't find the page you were looking for. It might have been moved or deleted.
        </p>
        <Button asChild size="lg" className="px-8">
          <a href="/">Return to Dashboard</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
