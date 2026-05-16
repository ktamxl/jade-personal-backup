import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Watch, Calendar, DollarSign, Bell, ArrowLeft, Star, Upload, X } from "lucide-react";
import { useLocation } from "wouter";
import { format, differenceInDays } from "date-fns";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { getLoginUrl } from "@/const";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: loading } = useAuth();
  
  const { data: rentals, isLoading: rentalsLoading, refetch: refetchRentals } = trpc.rentals.myRentals.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: invoices, isLoading: invoicesLoading } = trpc.invoices.myInvoices.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: watches } = trpc.watches.list.useQuery();

  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadPhoto = trpc.reviews.uploadPhoto.useMutation();
  const createReview = trpc.reviews.create.useMutation({
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      setReviewDialogOpen(false);
      setRating(0);
      setComment("");
      setPhotoFile(null);
      setPhotoPreview(null);
      refetchRentals();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [loading, isAuthenticated]);

  if (loading || rentalsLoading || invoicesLoading) {
    return (
      <div className="min-h-screen bg-smoky-black">
        <Navigation />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <div className="text-luxury-gold">Loading...</div>
        </div>
      </div>
    );
  }

  const activeRentals = rentals?.filter(r => r.status === "active") || [];
  const completedRentals = rentals?.filter(r => r.status === "completed") || [];
  const upcomingReturns = activeRentals.map(rental => ({
    id: rental.id,
    watchId: rental.watchId,
    returnDate: new Date(rental.endDate),
    daysRemaining: differenceInDays(new Date(rental.endDate), new Date()),
  })).filter(r => r.daysRemaining >= 0);

  const getWatchName = (watchId: number) => {
    const watch = watches?.find(w => w.id === watchId);
    return watch ? `${watch.brand} ${watch.name}` : `Watch #${watchId}`;
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setPhotoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedRental) return;
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    let photoUrl: string | undefined;

    // Upload photo if selected
    if (photoFile && photoPreview) {
      try {
        toast.info("Uploading photo...");
        const result = await uploadPhoto.mutateAsync({
          file: photoPreview,
          fileName: photoFile.name,
          contentType: photoFile.type,
        });
        photoUrl = result.url;
      } catch (error) {
        toast.error("Failed to upload photo");
        return;
      }
    }

    createReview.mutate({
      watchId: selectedRental.watchId,
      rentalId: selectedRental.id,
      rating,
      comment: comment || undefined,
      photoUrl,
    });
  };

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

          <header className="mb-8">
            <h1 className="h2 article-title text-white-2">My Dashboard</h1>
            <p className="text-light-gray-70 mt-2">
              Manage your rentals, returns, and billing
            </p>
          </header>

          <div className="space-y-8">
            {/* Active Rentals */}
            <section>
              <h2 className="h3 text-white-2 mb-4 flex items-center gap-2">
                <Watch className="w-5 h-5 text-luxury-gold" />
                Active Rentals
              </h2>
              {activeRentals.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {activeRentals.map((rental) => (
                    <Card key={rental.id} className="bg-eerie-black-1 border-jet">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="h4 text-white-2">{getWatchName(rental.watchId)}</CardTitle>
                            <CardDescription className="text-light-gray-70">
                              Rental #{rental.id}
                            </CardDescription>
                          </div>
                          <Badge className="bg-luxury-gold text-smoky-black">
                            {rental.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-light-gray-70 text-sm mb-1">Rental Period</p>
                            <p className="text-white-2 font-medium">
                              {format(new Date(rental.startDate), "MMM d")} - {format(new Date(rental.endDate), "MMM d, yyyy")}
                            </p>
                          </div>
                          <div>
                            <p className="text-light-gray-70 text-sm mb-1">Daily Rate</p>
                            <p className="text-white-2 font-medium">${(200 / 100).toFixed(2)}/day</p>
                          </div>
                          <div>
                            <p className="text-light-gray-70 text-sm mb-1">Total Cost</p>
                            <p className="text-luxury-gold font-semibold">${(rental.totalCost / 100).toFixed(2)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-eerie-black-1 border-jet">
                  <CardContent className="py-8 text-center">
                    <Watch className="w-12 h-12 text-light-gray-70 mx-auto mb-3" />
                    <p className="text-light-gray-70">No active rentals</p>
                  </CardContent>
                </Card>
              )}
            </section>

            {/* Completed Rentals - Ready for Review */}
            {completedRentals.length > 0 && (
              <section>
                <h2 className="h3 text-white-2 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-luxury-gold" />
                  Completed Rentals
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {completedRentals.map((rental) => (
                    <Card key={rental.id} className="bg-eerie-black-1 border-jet">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="h4 text-white-2">{getWatchName(rental.watchId)}</CardTitle>
                            <CardDescription className="text-light-gray-70">
                              Completed on {format(new Date(rental.endDate), "MMM d, yyyy")}
                            </CardDescription>
                          </div>
                          <Dialog open={reviewDialogOpen && selectedRental?.id === rental.id} onOpenChange={(open) => {
                            setReviewDialogOpen(open);
                            if (open) {
                              setSelectedRental(rental);
                            } else {
                              setSelectedRental(null);
                              setRating(0);
                              setComment("");
                              handleRemovePhoto();
                            }
                          }}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-smoky-black"
                              >
                                <Star className="w-4 h-4 mr-2" />
                                Write Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-eerie-black-2 border-jet text-white-2 max-w-lg">
                              <DialogHeader>
                                <DialogTitle className="text-white-2">Rate Your Experience</DialogTitle>
                                <DialogDescription className="text-light-gray-70">
                                  Share your thoughts about {getWatchName(rental.watchId)}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label className="text-white-2">Rating</Label>
                                  <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="transition-transform hover:scale-110"
                                      >
                                        <Star
                                          className={cn(
                                            "w-8 h-8 cursor-pointer",
                                            star <= rating ? "fill-luxury-gold text-luxury-gold" : "fill-light-gray-70 text-light-gray-70"
                                          )}
                                        />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label className="text-white-2">Photo (Optional)</Label>
                                  <div className="space-y-3">
                                    {photoPreview ? (
                                      <div className="relative">
                                        <img
                                          src={photoPreview}
                                          alt="Review preview"
                                          className="w-full h-48 object-cover rounded-lg border border-jet"
                                        />
                                        <Button
                                          type="button"
                                          variant="destructive"
                                          size="icon"
                                          className="absolute top-2 right-2"
                                          onClick={handleRemovePhoto}
                                        >
                                          <X className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    ) : (
                                      <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-jet rounded-lg p-8 text-center cursor-pointer hover:border-luxury-gold transition-colors"
                                      >
                                        <Upload className="w-8 h-8 text-light-gray-70 mx-auto mb-2" />
                                        <p className="text-light-gray-70 text-sm">
                                          Click to upload a photo
                                        </p>
                                        <p className="text-light-gray-70 text-xs mt-1">
                                          JPG, PNG or WEBP (max 5MB)
                                        </p>
                                      </div>
                                    )}
                                    <Input
                                      ref={fileInputRef}
                                      type="file"
                                      accept="image/*"
                                      onChange={handlePhotoSelect}
                                      className="hidden"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-white-2">Review (Optional)</Label>
                                  <Textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Share your experience with this watch..."
                                    className="bg-eerie-black-1 border-jet text-white-1 min-h-[100px]"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button
                                  onClick={handleSubmitReview}
                                  className="bg-luxury-gold hover:bg-deep-gold text-smoky-black font-semibold"
                                  disabled={createReview.isPending || uploadPhoto.isPending}
                                >
                                  {createReview.isPending || uploadPhoto.isPending ? "Submitting..." : "Submit Review"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Upcoming Returns */}
            <section>
              <h2 className="h3 text-white-2 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-luxury-gold" />
                Upcoming Returns
              </h2>
              {upcomingReturns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingReturns.map((item) => (
                    <Card key={item.id} className="bg-eerie-black-1 border-jet">
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white-2 font-medium mb-1">{getWatchName(item.watchId)}</p>
                            <p className="text-light-gray-70 text-sm">
                              Due: {format(item.returnDate, "MMM d, yyyy")}
                            </p>
                          </div>
                          <Badge variant="outline" className="border-luxury-gold text-luxury-gold">
                            {item.daysRemaining} days
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-eerie-black-1 border-jet">
                  <CardContent className="py-8 text-center">
                    <Calendar className="w-12 h-12 text-light-gray-70 mx-auto mb-3" />
                    <p className="text-light-gray-70">No upcoming returns</p>
                  </CardContent>
                </Card>
              )}
            </section>

            {/* Billing History */}
            <section>
              <h2 className="h3 text-white-2 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-luxury-gold" />
                Billing History
              </h2>
              {invoices && invoices.length > 0 ? (
                <Card className="bg-eerie-black-1 border-jet">
                  <CardContent className="p-0">
                    <div className="divide-y divide-jet">
                      {invoices.map((invoice) => (
                        <div key={invoice.id} className="p-4 flex items-center justify-between">
                          <div>
                            <p className="text-white-2 font-medium">{getWatchName(rentals?.find(r => r.id === invoice.rentalId)?.watchId || 0)}</p>
                            <p className="text-light-gray-70 text-sm">
                              {invoice.createdAt ? format(new Date(invoice.createdAt), "MMM d, yyyy") : "N/A"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-white-2 font-semibold">${(invoice.amount / 100).toFixed(2)}</p>
                            <Badge 
                              variant="outline" 
                              className="border-luxury-gold text-luxury-gold mt-1"
                            >
                              {invoice.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : completedRentals.length > 0 ? (
                <Card className="bg-eerie-black-1 border-jet">
                  <CardContent className="p-0">
                    <div className="divide-y divide-jet">
                      {completedRentals.map((rental) => (
                        <div key={rental.id} className="p-4 flex items-center justify-between">
                          <div>
                            <p className="text-white-2 font-medium">{getWatchName(rental.watchId)}</p>
                            <p className="text-light-gray-70 text-sm">
                              {rental.completedAt ? format(new Date(rental.completedAt), "MMM d, yyyy") : format(new Date(rental.endDate), "MMM d, yyyy")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-white-2 font-semibold">${(rental.totalCost / 100).toFixed(2)}</p>
                            <Badge 
                              variant="outline" 
                              className="border-luxury-gold text-luxury-gold mt-1"
                            >
                              completed
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-eerie-black-1 border-jet">
                  <CardContent className="py-8 text-center">
                    <DollarSign className="w-12 h-12 text-light-gray-70 mx-auto mb-3" />
                    <p className="text-light-gray-70">No billing history</p>
                  </CardContent>
                </Card>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
