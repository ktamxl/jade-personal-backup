import { Button } from "@/components/ui/button";
import { Watch, Calendar, Shield, Clock } from "lucide-react";
import { APP_TITLE } from "@/const";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-smoky-black">
      <Navigation />
      
      {/* Compact Hero + Key Info Section - All Above the Fold */}
      <section className="relative overflow-hidden py-12">
        <div className="portfolio-container">
          {/* Hero */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="flex justify-center mb-6">
              <div className="icon-box w-20 h-20">
                <Watch className="w-10 h-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white-2 mb-4">
              {APP_TITLE}
            </h1>
            <p className="text-lg text-light-gray-70 mb-6 max-w-2xl mx-auto">
              Experience the finest luxury timepieces. Exclusive rental service for friends and family.
            </p>
            <Button
              onClick={() => setLocation(isAuthenticated ? "/catalog" : "/login")}
              className="bg-luxury-gold hover:bg-deep-gold text-smoky-black font-semibold text-lg px-8 py-4"
            >
              {isAuthenticated ? "Browse Collection" : "Browse Collection"}
            </Button>
          </div>

          {/* How It Works - Compact Cards */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white-2 text-center mb-6">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-eerie-black-1 border border-jet rounded-xl p-6 text-center">
                <div className="icon-box w-14 h-14 mx-auto mb-3">
                  <Watch className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-white-2 mb-2">Choose Your Watch</h3>
                <p className="text-sm text-light-gray-70">
                  Browse our curated collection of luxury timepieces from prestigious brands
                </p>
              </div>
              <div className="bg-eerie-black-1 border border-jet rounded-xl p-6 text-center">
                <div className="icon-box w-14 h-14 mx-auto mb-3">
                  <Calendar className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-white-2 mb-2">Reserve Your Dates</h3>
                <p className="text-sm text-light-gray-70">
                  Select your rental period with our easy calendar system (up to 14 days)
                </p>
              </div>
              <div className="bg-eerie-black-1 border border-jet rounded-xl p-6 text-center">
                <div className="icon-box w-14 h-14 mx-auto mb-3">
                  <Shield className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-white-2 mb-2">Enjoy & Return</h3>
                <p className="text-sm text-light-gray-70">
                  Wear your luxury timepiece with confidence and return it on time
                </p>
              </div>
            </div>
          </div>

          {/* Pricing - Compact Card */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white-2 text-center mb-6">
              Simple Pricing
            </h2>
            <div className="bg-eerie-black-1 border border-jet rounded-xl p-8">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Clock className="w-8 h-8 text-luxury-gold" />
              </div>
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-luxury-gold mb-1">$2.00</div>
                <div className="text-light-gray-70">per day</div>
              </div>
              <div className="separator mb-6" />
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-light-gray text-sm">
                <li>✓ All watches same rate</li>
                <li>✓ Maximum 14 days per rental</li>
                <li>✓ Easy calendar booking</li>
                <li>✓ Return notifications</li>
                <li>✓ Billing tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-eerie-black-2">
        <div className="portfolio-container">
          <div className="main-content text-center">
            <h2 className="h2 text-white-2 mb-4">Ready to Get Started?</h2>
            <p className="text-light-gray-70 mb-8 max-w-2xl mx-auto">
              {isAuthenticated 
                ? "Explore our exclusive collection and make your first reservation"
                : "Explore our exclusive collection and make your first reservation"}
            </p>
            <Button
              onClick={() => setLocation(isAuthenticated ? "/catalog" : "/catalog")}
              className="bg-luxury-gold hover:bg-deep-gold text-smoky-black font-semibold text-lg px-8 py-6"
            >
              Browse Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
