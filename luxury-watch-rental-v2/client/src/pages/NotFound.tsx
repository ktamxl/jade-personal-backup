import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-smoky-black">
      <Card className="w-full max-w-lg mx-4 bg-eerie-black-2 border-jet">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="icon-box w-16 h-16">
              <AlertCircle className="w-8 h-8" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-luxury-gold mb-2">404</h1>

          <h2 className="h3 text-white-2 mb-4">
            Page Not Found
          </h2>

          <p className="text-light-gray-70 mb-8 leading-relaxed">
            Sorry, the page you are looking for doesn't exist.
            <br />
            It may have been moved or deleted.
          </p>

          <div
            id="not-found-button-group"
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              onClick={handleGoHome}
              className="bg-luxury-gold hover:bg-deep-gold text-smoky-black font-semibold"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
