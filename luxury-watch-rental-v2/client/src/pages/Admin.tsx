import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Watch, Users, DollarSign, Calendar } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import RentalTimeline from "@/components/RentalTimeline";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { getFirstName } from "@/lib/nameUtils";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  
  const { data: allRentals } = trpc.rentals.getAllRentals.useQuery(undefined, {
    enabled: user?.role === 'admin',
  });
  const { data: allUsers } = trpc.users.list.useQuery(undefined, {
    enabled: user?.role === 'admin',
  });
  const { data: watches } = trpc.watches.list.useQuery();
  const { data: allInvoices } = trpc.invoices.getAllInvoices.useQuery(undefined, {
    enabled: user?.role === 'admin',
  });

  const utils = trpc.useUtils();
  const completeRental = trpc.rentals.complete.useMutation({
    onSuccess: () => {
      utils.rentals.getAllRentals.invalidate();
      utils.watches.list.invalidate();
    },
  });

  const togglePayment = trpc.rentals.togglePayment.useMutation({
    onSuccess: () => {
      utils.rentals.getAllRentals.invalidate();
    },
  });

  const cancelRental = trpc.rentals.cancel.useMutation({
    onSuccess: () => {
      utils.rentals.getAllRentals.invalidate();
      utils.watches.list.invalidate();
    },
  });

  const updateNotes = trpc.rentals.updateNotes.useMutation({
    onSuccess: () => {
      utils.rentals.getAllRentals.invalidate();
      toast.success("Notes saved successfully");
    },
  });

  const activateRental = trpc.rentals.activate.useMutation({
    onSuccess: () => {
      utils.rentals.getAllRentals.invalidate();
      utils.watches.list.invalidate();
      toast.success("Rental activated successfully");
    },
  });

  const [editingNotes, setEditingNotes] = useState<{ [key: number]: string }>({});
  const [showAllRentals, setShowAllRentals] = useState(false);

  // Filter rentals: show only pending and active by default
  const filteredRentals = showAllRentals 
    ? allRentals 
    : allRentals?.filter(r => r.status === 'pending' || r.status === 'active');

  const handleReturnWatch = async (rentalId: number) => {
    if (confirm('Mark this watch as returned?')) {
      try {
        await completeRental.mutateAsync({ id: rentalId });
      } catch (error) {
        alert('Failed to return watch: ' + (error as Error).message);
      }
    }
  };

  const handleCancelRental = async (rentalId: number) => {
    if (confirm('Cancel this rental?')) {
      try {
        await cancelRental.mutateAsync({ id: rentalId });
      } catch (error) {
        alert('Failed to cancel rental: ' + (error as Error).message);
      }
    }
  };

  const handleActivateRental = async (rentalId: number) => {
    if (confirm('Activate this rental? The watch will become unavailable.')) {
      try {
        await activateRental.mutateAsync({ id: rentalId });
      } catch (error) {
        alert('Failed to activate rental: ' + (error as Error).message);
      }
    }
  };

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      setLocation("/");
    }
  }, [isLoading, user, setLocation]);

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

  if (!user || user.role !== 'admin') {
    return null;
  }

  const getWatchName = (watchId: number) => {
    const watch = watches?.find(w => w.id === watchId);
    return watch ? `${watch.brand} ${watch.name}` : `Watch #${watchId}`;
  };

  const getUserName = (userId: number) => {
    const user = allUsers?.find(u => u.id === userId);
    return getFirstName(user?.name, user?.email, `User #${userId}`);
  };

  const activeRentals = allRentals?.filter(r => r.status === 'active') || [];
  const completedRentals = allRentals?.filter(r => r.status === 'completed') || [];
  // Use invoices if available, otherwise fall back to completed rentals totalCost
  const invoiceRevenue = allInvoices?.reduce((sum, inv) => sum + inv.amount, 0) || 0;
  const rentalRevenue = completedRentals.reduce((sum, r) => sum + r.totalCost, 0);
  const totalRevenue = invoiceRevenue > 0 ? invoiceRevenue : rentalRevenue;

  return (
    <div className="min-h-screen bg-smoky-black">
      <Navigation />
      <div className="portfolio-container">
        <div className="main-content">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white-2 mb-2">Admin Dashboard</h1>
              <p className="text-light-gray">Manage your luxury watch rental business</p>
            </div>
            <Link href="/watches/manage">
              <Button className="bg-luxury-gold text-smoky-black hover:bg-luxury-gold/90">
                Manage Watches
              </Button>
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-eerie-black-1 border-jet">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-light-gray-70">Total Watches</CardTitle>
                <Watch className="h-4 w-4 text-luxury-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white-2">{watches?.length || 0}</div>
              </CardContent>
            </Card>

            <Card className="bg-eerie-black-1 border-jet">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-light-gray-70">Active Rentals</CardTitle>
                <Calendar className="h-4 w-4 text-luxury-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white-2">{activeRentals.length}</div>
              </CardContent>
            </Card>

            <Card className="bg-eerie-black-1 border-jet">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-light-gray-70">Total Users</CardTitle>
                <Users className="h-4 w-4 text-luxury-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white-2">{allUsers?.length || 0}</div>
              </CardContent>
            </Card>

            <Card className="bg-eerie-black-1 border-jet">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-light-gray-70">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-luxury-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white-2">${(totalRevenue / 100).toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for different views */}
          <Tabs defaultValue="rentals" className="w-full">
            <TabsList className="bg-eerie-black-1 border border-jet">
              <TabsTrigger value="rentals" className="data-[state=active]:bg-luxury-gold data-[state=active]:text-smoky-black">
                Rentals
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-luxury-gold data-[state=active]:text-smoky-black">
                Users
              </TabsTrigger>
              <TabsTrigger value="invoices" className="data-[state=active]:bg-luxury-gold data-[state=active]:text-smoky-black">
                Invoices
              </TabsTrigger>
            </TabsList>

            <TabsContent value="rentals" className="mt-6">
              <Card className="bg-eerie-black-1 border-jet">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white-2">All Rentals</CardTitle>
                      <CardDescription className="text-light-gray-70">
                        View and manage all watch rentals
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-smoky-black"
                      onClick={() => setShowAllRentals(!showAllRentals)}
                    >
                      {showAllRentals ? 'Show Active Only' : 'Show All Rentals'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {!filteredRentals || filteredRentals.length === 0 ? (
                    <p className="text-light-gray-70 text-center py-8">{showAllRentals ? 'No rentals yet' : 'No active rentals'}</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-jet hover:bg-jet/50">
                            <TableHead className="text-light-gray-70 min-w-[160px]">Watch</TableHead>
                            <TableHead className="text-light-gray-70 min-w-[100px]">Renter</TableHead>
                            <TableHead className="text-light-gray-70 min-w-[90px]">Start</TableHead>
                            <TableHead className="text-light-gray-70 min-w-[90px]">End</TableHead>
                            <TableHead className="text-light-gray-70 min-w-[80px]">Status</TableHead>
                            <TableHead className="text-light-gray-70 min-w-[100px]">Timeline</TableHead>
                            <TableHead className="text-light-gray-70 min-w-[100px]">Payment</TableHead>
                            <TableHead className="text-light-gray-70 min-w-[200px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRentals.map((rental) => (
                            <TableRow key={rental.id} className="border-jet hover:bg-jet/50">
                              <TableCell className="text-white-2 text-sm max-w-[160px] truncate">{getWatchName(rental.watchId)}</TableCell>
                              <TableCell className="text-light-gray text-sm">{getUserName(rental.userId)}</TableCell>
                              <TableCell className="text-light-gray text-sm">{format(new Date(rental.startDate), 'MMM d, yy')}</TableCell>
                              <TableCell className="text-light-gray text-sm">{format(new Date(rental.endDate), 'MMM d, yy')}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={rental.status === 'active' ? 'default' : rental.status === 'pending' ? 'outline' : 'secondary'}
                                  className={
                                    rental.status === 'active' 
                                      ? 'bg-luxury-gold text-smoky-black' 
                                      : rental.status === 'pending'
                                      ? 'border-luxury-gold text-luxury-gold'
                                      : 'bg-jet text-light-gray'
                                  }
                                >
                                  {rental.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-luxury-gold hover:text-luxury-gold/80"
                                    >
                                      View Timeline
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="bg-eerie-black-1 border-jet max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle className="text-white-2">Rental Timeline</DialogTitle>
                                    </DialogHeader>
                                    <div className="mt-4">
                                      <div className="mb-4 p-4 bg-smoky-black rounded-lg">
                                        <p className="text-light-gray text-sm"><span className="text-white-2 font-medium">Watch:</span> {getWatchName(rental.watchId)}</p>
                                        <p className="text-light-gray text-sm mt-1"><span className="text-white-2 font-medium">Renter:</span> {getUserName(rental.userId)}</p>
                                      </div>
                                      <RentalTimeline rental={rental} />
                                      
                                      <div className="mt-6 p-4 bg-smoky-black rounded-lg border border-jet">
                                        <label className="text-white-2 font-medium text-sm block mb-2">Private Notes</label>
                                        <Textarea
                                          value={editingNotes[rental.id] ?? rental.notes ?? ""}
                                          onChange={(e) => setEditingNotes({ ...editingNotes, [rental.id]: e.target.value })}
                                          placeholder="Add notes about this rental (damages, special conditions, communication history, etc.)"
                                          className="bg-eerie-black-1 border-jet text-light-gray placeholder:text-light-gray-70 min-h-[100px]"
                                        />
                                        <Button
                                          size="sm"
                                          className="mt-2 bg-luxury-gold text-smoky-black hover:bg-luxury-gold/90"
                                          onClick={() => {
                                            updateNotes.mutate({
                                              id: rental.id,
                                              notes: editingNotes[rental.id] ?? rental.notes ?? "",
                                            });
                                          }}
                                        >
                                          Save Notes
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    checked={rental.paymentReceived}
                                    onCheckedChange={(checked) => {
                                      togglePayment.mutate({ 
                                        id: rental.id, 
                                        paymentReceived: checked as boolean 
                                      });
                                    }}
                                    className="border-luxury-gold data-[state=checked]:bg-luxury-gold data-[state=checked]:text-smoky-black"
                                  />
                                  <span className="text-light-gray text-sm">
                                    {rental.paymentReceived ? 'Received' : 'Pending'}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  {rental.status === 'pending' && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-smoky-black"
                                        onClick={() => handleActivateRental(rental.id)}
                                      >
                                        Activate Rental
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                        onClick={() => handleCancelRental(rental.id)}
                                      >
                                        Cancel
                                      </Button>
                                    </>
                                  )}
                                  {rental.status === 'active' && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-smoky-black"
                                        onClick={() => handleReturnWatch(rental.id)}
                                      >
                                        Return Watch
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                        onClick={() => handleCancelRental(rental.id)}
                                      >
                                        Cancel Rental
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <Card className="bg-eerie-black-1 border-jet">
                <CardHeader>
                  <CardTitle className="text-white-2">All Users</CardTitle>
                  <CardDescription className="text-light-gray-70">
                    View all registered users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!allUsers || allUsers.length === 0 ? (
                    <p className="text-light-gray-70 text-center py-8">No users yet</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-jet hover:bg-jet/50">
                            <TableHead className="text-light-gray-70">Name</TableHead>
                            <TableHead className="text-light-gray-70">Email</TableHead>
                            <TableHead className="text-light-gray-70">Role</TableHead>
                            <TableHead className="text-light-gray-70">Last Sign In</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allUsers.map((user) => (
                            <TableRow key={user.id} className="border-jet hover:bg-jet/50">
                              <TableCell className="text-white-2">{getFirstName(user.name, user.email, 'N/A')}</TableCell>
                              <TableCell className="text-light-gray">{user.email || 'N/A'}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={user.role === 'admin' ? 'default' : 'secondary'}
                                  className={user.role === 'admin' ? 'bg-luxury-gold text-smoky-black' : 'bg-jet text-light-gray'}
                                >
                                  {user.role}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-light-gray">
                                {user.lastSignedIn ? format(new Date(user.lastSignedIn), 'MMM d, yyyy') : 'Never'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invoices" className="mt-6">
              <Card className="bg-eerie-black-1 border-jet">
                <CardHeader>
                  <CardTitle className="text-white-2">All Invoices</CardTitle>
                  <CardDescription className="text-light-gray-70">
                    View billing history and revenue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!allInvoices || allInvoices.length === 0 ? (
                    <p className="text-light-gray-70 text-center py-8">No invoices yet</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-jet hover:bg-jet/50">
                            <TableHead className="text-light-gray-70">User</TableHead>
                            <TableHead className="text-light-gray-70">Watch</TableHead>
                            <TableHead className="text-light-gray-70">Amount</TableHead>
                            <TableHead className="text-light-gray-70">Days</TableHead>
                            <TableHead className="text-light-gray-70">Status</TableHead>
                            <TableHead className="text-light-gray-70">Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allInvoices.map((invoice) => {
                            const rental = allRentals?.find(r => r.id === invoice.rentalId);
                            return (
                            <TableRow key={invoice.id} className="border-jet hover:bg-jet/50">
                              <TableCell className="text-white-2">{getUserName(invoice.userId)}</TableCell>
                              <TableCell className="text-light-gray">{rental ? getWatchName(rental.watchId) : 'N/A'}</TableCell>
                              <TableCell className="text-luxury-gold font-semibold">${(invoice.amount / 100).toFixed(2)}</TableCell>
                              <TableCell className="text-light-gray">{rental ? Math.ceil((new Date(rental.endDate).getTime() - new Date(rental.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1 : 'N/A'}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={invoice.status === 'paid' ? 'default' : 'secondary'}
                                  className={invoice.status === 'paid' ? 'bg-luxury-gold text-smoky-black' : 'bg-jet text-light-gray'}
                                >
                                  {invoice.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-light-gray">{format(new Date(invoice.createdAt), 'MMM d, yyyy')}</TableCell>
                            </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
