import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Watch, ArrowLeft, Calendar as CalendarIcon, DollarSign, Clock, Star } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { useState, useMemo } from "react";
import { format, differenceInDays, addDays } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { getLoginUrl } from "@/const";

export default function WatchDetail() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const { isAuthenticated, user } = useAuth();
  const watchId = useMemo(() => parseInt(params.id || "0"), [params.id]);
  
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [showBack, setShowBack] = useState(false);

  // Check if watch is new (added within last 30 days)
  const isNewWatch = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const daysDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 30;
  };

  const { data: watch, isLoading } = trpc.watches.getById.useQuery({ id: watchId });
  const { data: reviews } = trpc.reviews.getByWatchId.useQuery({ watchId });
  const { data: averageRating } = trpc.reviews.getAverageRating.useQuery({ watchId });
  
  const createRental = trpc.rentals.create.useMutation({
    onSuccess: () => {
      toast.success("Reservation confirmed!");
      setTimeout(() => setLocation("/dashboard"), 1500);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const calculateRentalCost = () => {
    if (!startDate || !endDate || !watch) return 0;
    const days = differenceInDays(endDate, startDate) + 1;
    return Math.min(days, 14) * (watch.dailyRate / 100);
  };

  const handleReservation = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to make a reservation");
      setTimeout(() => setLocation("/login"), 1500);
      return;
    }

    if (!watch?.available) {
      toast.error("This watch is currently unavailable");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Please select rental dates");
      return;
    }

    const days = differenceInDays(endDate, startDate) + 1;
    if (days > 14) {
      toast.error("Maximum rental period is 14 days");
      return;
    }

    if (days < 1) {
      toast.error("End date must be after start date");
      return;
    }

    createRental.mutate({
      watchId,
      startDate,
      endDate,
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "w-4 h-4",
              star <= rating ? "fill-luxury-gold text-luxury-gold" : "fill-light-gray-70 text-light-gray-70"
            )}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-smoky-black">
        <Navigation />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <div className="text-luxury-gold">Loading...</div>
        </div>
      </div>
    );
  }

  if (!watch) {
    return (
      <div className="min-h-screen bg-smoky-black">
        <Navigation />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <div className="text-light-gray-70">Watch not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-smoky-black">
      <Navigation />
      <div className="portfolio-container">
        <div className="main-content">
          <Button
            variant="ghost"
            onClick={() => setLocation("/catalog")}
            className="mb-6 text-light-gray hover:text-luxury-gold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Collection
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Watch Image and Details */}
            <div>
              <Card className="bg-eerie-black-1 border-jet mb-6">
                <CardContent className="p-8">
                  <div className="relative bg-jet rounded-lg flex items-center justify-center mb-6 overflow-hidden group" style={{ minHeight: '400px' }}>
                    {watch && typeof watch.createdAt === 'string' && isNewWatch(watch.createdAt) && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-luxury-gold text-smoky-black px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
                          NEW
                        </span>
                      </div>
                    )}
                    {watch.imageUrl || watch.backImageUrl ? (
                      <>
                        <img 
                          src={showBack && watch.backImageUrl ? watch.backImageUrl : (watch.imageUrl || watch.backImageUrl || '')} 
                          alt={showBack ? `${watch.name} back` : watch.name} 
                          className="w-full h-auto object-contain rounded-lg transition-opacity duration-300" 
                        />
                        {watch.backImageUrl && (
                          <div className="absolute bottom-4 right-4 flex gap-2">
                            <Button
                              size="default"
                              variant={!showBack ? 'default' : 'outline'}
                              className={cn(
                                "h-10 px-4",
                                !showBack 
                                  ? "bg-luxury-gold text-smoky-black hover:bg-deep-gold" 
                                  : "border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-smoky-black"
                              )}
                              onClick={() => setShowBack(false)}
                            >
                              Front View
                            </Button>
                            <Button
                              size="default"
                              variant={showBack ? 'default' : 'outline'}
                              className={cn(
                                "h-10 px-4",
                                showBack 
                                  ? "bg-luxury-gold text-smoky-black hover:bg-deep-gold" 
                                  : "border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-smoky-black"
                              )}
                              onClick={() => setShowBack(true)}
                            >
                              Back View
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <Watch className="w-32 h-32 text-luxury-gold" />
                    )}
                  </div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="h2 text-white-2 mb-2">{watch.name}</h1>
                      <p className="text-light-gray">{watch.brand} • {watch.model}</p>
                      {averageRating !== undefined && averageRating > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          {renderStars(Math.round(averageRating))}
                          <span className="text-light-gray text-sm">
                            ({averageRating.toFixed(1)}) • {reviews?.length || 0} reviews
                          </span>
                        </div>
                      )}
                    </div>
                    <Badge className={watch.available ? "bg-luxury-gold text-smoky-black" : "bg-jet text-light-gray"}>
                      {watch.available ? "Available" : "Rented"}
                    </Badge>
                  </div>
                  <p className="text-light-gray-70 mb-6">{watch.description}</p>

                  <div className="separator mb-6" />

                  <h3 className="h4 text-white-2 mb-4">Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {watch.caseSize && (
                      <div>
                        <p className="text-light-gray-70 text-sm">Case Size</p>
                        <p className="text-white-2 font-medium">{watch.caseSize}</p>
                      </div>
                    )}
                    {watch.movement && (
                      <div>
                        <p className="text-light-gray-70 text-sm">Movement</p>
                        <p className="text-white-2 font-medium">{watch.movement}</p>
                      </div>
                    )}
                    {watch.waterResistance && (
                      <div>
                        <p className="text-light-gray-70 text-sm">Water Resistance</p>
                        <p className="text-white-2 font-medium">{watch.waterResistance}</p>
                      </div>
                    )}
                    {watch.material && (
                      <div>
                        <p className="text-light-gray-70 text-sm">Material</p>
                        <p className="text-white-2 font-medium">{watch.material}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Reviews Section */}
              {reviews && reviews.length > 0 && (
                <Card className="bg-eerie-black-1 border-jet">
                  <CardHeader>
                    <CardTitle className="h4 text-white-2">Customer Reviews</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-jet pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-3">
                          {renderStars(review.rating)}
                          <span className="text-light-gray-70 text-sm">
                            {review.createdAt ? format(new Date(review.createdAt), "MMM d, yyyy") : ""}
                          </span>
                        </div>
                        {review.photoUrl && (
                          <div className="mb-3">
                            <img
                              src={review.photoUrl}
                              alt="Review photo"
                              className="w-full max-w-md h-48 object-cover rounded-lg border border-jet"
                            />
                          </div>
                        )}
                        {review.comment && (
                          <p className="text-light-gray text-sm">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Reservation Form */}
            <div>
              <Card className="bg-eerie-black-1 border-jet sticky top-4">
                <CardHeader>
                  <CardTitle className="h3 text-white-2">Reserve This Watch</CardTitle>
                  <CardDescription className="text-light-gray-70">
                    Select your rental dates (maximum 14 days)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white-2">Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-eerie-black-2 border-jet text-white-1",
                              !startDate && "text-light-gray-70"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-eerie-black-2 border-jet">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={(date) => {
                              setStartDate(date);
                              if (endDate && date && date > endDate) {
                                setEndDate(undefined);
                              }
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white-2">End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-eerie-black-2 border-jet text-white-1",
                              !endDate && "text-light-gray-70"
                            )}
                            disabled={!startDate}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-eerie-black-2 border-jet">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            disabled={(date) => 
                              !startDate || 
                              date < startDate || 
                              date > addDays(startDate, 13)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="separator" />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-light-gray">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>Daily Rate</span>
                      </div>
                      <span className="font-semibold">${(watch.dailyRate / 100).toFixed(2)}</span>
                    </div>
                    {startDate && endDate && (
                      <>
                        <div className="flex items-center justify-between text-light-gray">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Rental Days</span>
                          </div>
                          <span className="font-semibold">
                            {differenceInDays(endDate, startDate) + 1} days
                          </span>
                        </div>
                        <div className="separator" />
                        <div className="flex items-center justify-between text-luxury-gold text-lg">
                          <span className="font-semibold">Total Cost</span>
                          <span className="font-bold">${calculateRentalCost().toFixed(2)}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <Button
                    onClick={handleReservation}
                    className="w-full bg-luxury-gold hover:bg-deep-gold text-smoky-black font-semibold"
                    disabled={!startDate || !endDate || !watch.available || createRental.isPending}
                  >
                    {createRental.isPending ? "Processing..." : !watch.available ? "Currently Unavailable" : "Confirm Reservation"}
                  </Button>
                  {!watch.available && (
                    <p className="text-sm text-light-gray-70 text-center mt-2">
                      This watch is currently rented and unavailable for reservation.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
