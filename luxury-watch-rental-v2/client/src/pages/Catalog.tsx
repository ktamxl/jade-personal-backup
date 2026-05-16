import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Watch, Calendar, DollarSign, Star } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Navigation from "@/components/Navigation";

export default function Catalog() {
  const [, setLocation] = useLocation();
  const { data: watches, isLoading } = trpc.watches.list.useQuery();

  const WatchCard = ({ watch }: { watch: any }) => {
    const { data: averageRating } = trpc.reviews.getAverageRating.useQuery({ watchId: watch.id });
    const { data: reviews } = trpc.reviews.getByWatchId.useQuery({ watchId: watch.id });
    const [showBack, setShowBack] = useState(false);

    // Check if watch is new (added within last 30 days)
    const isNewWatch = (createdAt: string) => {
      const created = new Date(createdAt);
      const now = new Date();
      const daysDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 30;
    };

    const renderStars = (rating: number) => {
      return (
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                "w-3 h-3",
                star <= rating ? "fill-luxury-gold text-luxury-gold" : "fill-light-gray-70 text-light-gray-70"
              )}
            />
          ))}
        </div>
      );
    };

    const currentImage = showBack && watch.backImageUrl ? watch.backImageUrl : watch.imageUrl;

    return (
      <Card className="bg-eerie-black-1 border-jet hover-lift">
        <CardHeader>
          <div className="relative bg-jet rounded-lg mb-4 flex items-center justify-center overflow-hidden group" style={{ minHeight: '300px' }}>
            {isNewWatch(watch.createdAt) && (
              <div className="absolute top-2 left-2 z-10">
                <span className="bg-luxury-gold text-smoky-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  NEW
                </span>
              </div>
            )}
            {currentImage ? (
              <>
                <img 
                  src={currentImage} 
                  alt={showBack ? `${watch.name} back` : watch.name} 
                  className="w-full h-auto object-contain rounded-lg transition-opacity duration-300" 
                />
                {watch.backImageUrl && (
                  <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant={!showBack ? 'default' : 'outline'}
                      className={cn(
                        "h-7 px-2 text-xs",
                        !showBack 
                          ? "bg-luxury-gold text-smoky-black hover:bg-deep-gold" 
                          : "border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-smoky-black"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowBack(false);
                      }}
                    >
                      Front
                    </Button>
                    <Button
                      size="sm"
                      variant={showBack ? 'default' : 'outline'}
                      className={cn(
                        "h-7 px-2 text-xs",
                        showBack 
                          ? "bg-luxury-gold text-smoky-black hover:bg-deep-gold" 
                          : "border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-smoky-black"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowBack(true);
                      }}
                    >
                      Back
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Watch className="w-16 h-16 text-luxury-gold" />
            )}
          </div>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="h4 text-white-2">{watch.name}</CardTitle>
            <Badge 
              variant={watch.available ? "default" : "secondary"}
              className={watch.available ? "bg-luxury-gold text-smoky-black" : "bg-jet text-light-gray"}
            >
              {watch.available ? "Available" : "Rented"}
            </Badge>
          </div>
          <CardDescription className="text-light-gray-70">
            {watch.brand} • {watch.model}
          </CardDescription>
          {averageRating !== undefined && averageRating > 0 && (
            <div className="flex items-center gap-2 mt-2">
              {renderStars(Math.round(averageRating))}
              <span className="text-light-gray-70 text-xs">
                ({averageRating.toFixed(1)}) • {reviews?.length || 0}
              </span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-light-gray text-sm mb-4 line-clamp-2">{watch.description}</p>
          <div className="flex items-center gap-2 text-luxury-gold">
            <DollarSign className="w-4 h-4" />
            <span className="font-semibold">${(watch.dailyRate / 100).toFixed(2)}/day</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => setLocation(`/watch/${watch.id}`)}
            className="w-full bg-luxury-gold hover:bg-deep-gold text-smoky-black font-semibold"
            disabled={!watch.available}
          >
            {watch.available ? (
              <>
                <Calendar className="w-4 h-4 mr-2" />
                Reserve Now
              </>
            ) : (
              "Currently Unavailable"
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-smoky-black flex items-center justify-center">
        <div className="text-luxury-gold">Loading watches...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-smoky-black">
      <Navigation />
      <div className="portfolio-container">
        <div className="main-content">
          <header className="mb-8">
            <h1 className="h2 article-title text-white-2">Watch Collection</h1>
            <p className="text-light-gray-70 mt-2">
              Browse our curated selection of luxury timepieces available for rental
            </p>
          </header>

          {!watches || watches.length === 0 ? (
            <Card className="bg-eerie-black-1 border-jet">
              <CardContent className="py-12 text-center">
                <Watch className="w-16 h-16 text-light-gray-70 mx-auto mb-4" />
                <p className="text-light-gray-70">No watches available at the moment</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {watches.map((watch) => (
                <WatchCard key={watch.id} watch={watch} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
