import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-2 text-7xl font-heading font-black text-gradient">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">Oops! This page doesn't exist</p>
        <Button asChild className="bg-gradient-brand text-primary-foreground font-heading font-semibold rounded-full px-6">
          <Link to="/"><Home className="w-4 h-4 mr-2" /> Back to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
