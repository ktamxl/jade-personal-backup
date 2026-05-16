import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User } from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";
import { getFirstName } from "@/lib/nameUtils";

export default function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <nav className="bg-eerie-black-1 border-b border-jet sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            {APP_LOGO && (
              <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />
            )}
            <span className="text-xl font-bold text-luxury-gold">{APP_TITLE}</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link 
              href="/catalog"
              className={`text-sm font-medium transition-colors ${
                location === "/catalog" 
                  ? "text-luxury-gold" 
                  : "text-silver hover:text-luxury-gold"
              }`}
            >
              Collection
            </Link>

            <Link 
              href="/brands"
              className={`text-sm font-medium transition-colors ${
                location === "/brands" 
                  ? "text-luxury-gold" 
                  : "text-silver hover:text-luxury-gold"
              }`}
            >
              Brands
            </Link>

            <Link 
              href="/blog"
              className={`text-sm font-medium transition-colors ${
                location === "/blog" 
                  ? "text-luxury-gold" 
                  : "text-silver hover:text-luxury-gold"
              }`}
            >
              Blog
            </Link>

            {user ? (
              <>
                <Link 
                  href="/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    location === "/dashboard" 
                      ? "text-luxury-gold" 
                      : "text-silver hover:text-luxury-gold"
                  }`}
                >
                  Dashboard
                </Link>

                {user.role === 'admin' && (
                  <Link 
                    href="/admin"
                    className={`text-sm font-medium transition-colors ${
                      location === "/admin" 
                        ? "text-luxury-gold" 
                        : "text-silver hover:text-luxury-gold"
                    }`}
                  >
                    Admin
                  </Link>
                )}

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-silver">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{getFirstName(user.name, user.email)}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => logout()}
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <Link href="/login">
                <Button variant="default" size="sm" className="bg-luxury-gold text-smoky-black hover:bg-luxury-gold/90">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
