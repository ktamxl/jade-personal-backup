import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_TITLE, getLoginUrl } from "@/const";
import { Watch } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Login() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/catalog");
    }
  }, [isAuthenticated, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-smoky-black">
        <div className="text-luxury-gold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-smoky-black p-4">
      <Card className="w-full max-w-md bg-eerie-black-2 border-jet">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="icon-box w-16 h-16">
              <Watch className="w-8 h-8" />
            </div>
          </div>
          <CardTitle className="h2 text-white-2">{APP_TITLE}</CardTitle>
          <CardDescription className="text-light-gray-70">
            Sign in to access your luxury watch collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => window.location.href = getLoginUrl()}
            className="w-full bg-luxury-gold hover:bg-deep-gold text-smoky-black font-semibold"
          >
            Sign In with Manus
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
