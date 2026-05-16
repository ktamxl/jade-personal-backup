import { useState } from "react";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function WatchManagement() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingWatch, setEditingWatch] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    referenceNumber: "",
    description: "",
    caseSize: "",
    movement: "",
    waterResistance: "",
    material: "",
    dailyRate: "200", // $2.00 in cents
  });
  
  const [frontPhoto, setFrontPhoto] = useState<File | null>(null);
  const [backPhoto, setBackPhoto] = useState<File | null>(null);
  const [frontPhotoPreview, setFrontPhotoPreview] = useState<string>("");
  const [backPhotoPreview, setBackPhotoPreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  // All hooks must be called before any conditional returns (React rules of hooks)
  const { data: watches, refetch } = trpc.watches.list.useQuery(undefined, {
    enabled: !isLoading && !!user && user.role === 'admin',
  });
  const createWatch = trpc.watches.create.useMutation({
    onSuccess: () => {
      toast.success("Watch added successfully!");
      refetch();
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to add watch: " + error.message);
    },
  });

  const updateWatch = trpc.watches.update.useMutation({
    onSuccess: () => {
      toast.success("Watch updated successfully!");
      refetch();
      setIsEditDialogOpen(false);
      setEditingWatch(null);
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to update watch: " + error.message);
    },
  });

  const deleteWatch = trpc.watches.delete.useMutation({
    onSuccess: () => {
      toast.success("Watch deleted successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to delete watch: " + error.message);
    },
  });

  const uploadPhoto = trpc.reviews.uploadPhoto.useMutation();

  // Redirect if not admin - after all hooks
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      setLocation('/');
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

  const resetForm = () => {
    setFormData({
      name: "",
      brand: "",
      model: "",
      referenceNumber: "",
      description: "",
      caseSize: "",
      movement: "",
      waterResistance: "",
      material: "",
      dailyRate: "200",
    });
    setFrontPhoto(null);
    setBackPhoto(null);
    setFrontPhotoPreview("");
    setBackPhotoPreview("");
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    if (type === 'front') {
      setFrontPhoto(file);
      setFrontPhotoPreview(URL.createObjectURL(file));
    } else {
      setBackPhoto(file);
      setBackPhotoPreview(URL.createObjectURL(file));
    }
  };

  const uploadPhotos = async () => {
    const urls: { front?: string; back?: string } = {};
    
    if (frontPhoto) {
      const reader = new FileReader();
      const frontUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = async () => {
          try {
            const base64 = reader.result as string;
            const result = await uploadPhoto.mutateAsync({ 
              file: base64,
              fileName: frontPhoto.name,
              contentType: frontPhoto.type
            });
            resolve(result.url);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(frontPhoto);
      });
      urls.front = frontUrl;
    }

    if (backPhoto) {
      const reader = new FileReader();
      const backUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = async () => {
          try {
            const base64 = reader.result as string;
            const result = await uploadPhoto.mutateAsync({ 
              file: base64,
              fileName: backPhoto.name,
              contentType: backPhoto.type
            });
            resolve(result.url);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(backPhoto);
      });
      urls.back = backUrl;
    }

    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const photoUrls = await uploadPhotos();

      const watchData = {
        name: formData.name,
        brand: formData.brand,
        model: formData.model,
        description: formData.description,
        imageUrl: photoUrls.front || (editingWatch?.imageUrl || ""),
        backImageUrl: photoUrls.back || (editingWatch?.backImageUrl || ""),
        caseSize: formData.caseSize,
        movement: formData.movement,
        waterResistance: formData.waterResistance,
        material: formData.material,
        dailyRate: Math.round(parseFloat(formData.dailyRate) * 100), // convert to cents
        available: editingWatch?.available ?? true,
      };

      if (editingWatch) {
        await updateWatch.mutateAsync({
          id: editingWatch.id,
          data: watchData,
        });
      } else {
        await createWatch.mutateAsync(watchData);
      }
    } catch (error) {
      toast.error("Failed to upload photos");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (watch: any) => {
    if (!watch) {
      toast.error("Watch data not found");
      return;
    }
    
    setEditingWatch(watch);
    
    setFormData({
      name: watch.name || "",
      brand: watch.brand || "",
      model: watch.model || "",
      referenceNumber: watch.referenceNumber || "",
      description: watch.description || "",
      caseSize: watch.caseSize || "",
      movement: watch.movement || "",
      waterResistance: watch.waterResistance || "",
      material: watch.material || "",
      dailyRate: watch.dailyRate ? (watch.dailyRate / 100).toString() : "2.00",
    });
    setFrontPhotoPreview(watch.imageUrl || "");
    setBackPhotoPreview(watch.backImageUrl || "");
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this watch?")) {
      await deleteWatch.mutateAsync({ id });
    }
  };

  const toggleAvailability = async (watch: any) => {
    await updateWatch.mutateAsync({
      id: watch.id,
      data: {
        available: !watch.available,
      },
    });
  };

  return (
    <div className="min-h-screen bg-smoky-black">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white-2 mb-2">Watch Management</h1>
            <p className="text-light-gray">Add, edit, and manage your watch collection</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-luxury-gold text-smoky-black hover:bg-luxury-gold/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Watch
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-eerie-black-1 border-jet max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white-2">Add New Watch</DialogTitle>
                <DialogDescription className="text-light-gray">
                  Fill in the details to add a new watch to your collection
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brand" className="text-white-2">Brand</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      required
                      className="bg-jet border-light-gray-70 text-white-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="model" className="text-white-2">Model</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      required
                      className="bg-jet border-light-gray-70 text-white-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="name" className="text-white-2">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-jet border-light-gray-70 text-white-2"
                  />
                </div>

                <div>
                  <Label htmlFor="referenceNumber" className="text-white-2">Reference Number</Label>
                  <Input
                    id="referenceNumber"
                    value={formData.referenceNumber}
                    onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                    className="bg-jet border-light-gray-70 text-white-2"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white-2">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                    className="bg-jet border-light-gray-70 text-white-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="caseSize" className="text-white-2">Case Size</Label>
                    <Input
                      id="caseSize"
                      value={formData.caseSize}
                      onChange={(e) => setFormData({ ...formData, caseSize: e.target.value })}
                      placeholder="e.g., 41mm"
                      className="bg-jet border-light-gray-70 text-white-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="movement" className="text-white-2">Movement</Label>
                    <Input
                      id="movement"
                      value={formData.movement}
                      onChange={(e) => setFormData({ ...formData, movement: e.target.value })}
                      placeholder="e.g., Automatic"
                      className="bg-jet border-light-gray-70 text-white-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="waterResistance" className="text-white-2">Water Resistance</Label>
                    <Input
                      id="waterResistance"
                      value={formData.waterResistance}
                      onChange={(e) => setFormData({ ...formData, waterResistance: e.target.value })}
                      placeholder="e.g., 50m"
                      className="bg-jet border-light-gray-70 text-white-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="material" className="text-white-2">Material</Label>
                    <Input
                      id="material"
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      placeholder="e.g., Stainless Steel"
                      className="bg-jet border-light-gray-70 text-white-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="dailyRate" className="text-white-2">Daily Rate (in cents)</Label>
                  <Input
                    id="dailyRate"
                    type="number"
                    value={formData.dailyRate}
                    onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                    required
                    className="bg-jet border-light-gray-70 text-white-2"
                  />
                  <p className="text-xs text-light-gray-70 mt-1">
                    Current: ${(parseInt(formData.dailyRate) / 100).toFixed(2)} per day
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-white-2">Front Photo</Label>
                    <div className="mt-2">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-light-gray-70 rounded-lg cursor-pointer hover:border-luxury-gold transition-colors">
                        {frontPhotoPreview ? (
                          <img src={frontPhotoPreview} alt="Front preview" className="h-full object-contain" />
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="h-8 w-8 text-light-gray-70 mb-2" />
                            <span className="text-sm text-light-gray-70">Click to upload front photo</span>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoChange(e, 'front')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white-2">Back Photo</Label>
                    <div className="mt-2">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-light-gray-70 rounded-lg cursor-pointer hover:border-luxury-gold transition-colors">
                        {backPhotoPreview ? (
                          <img src={backPhotoPreview} alt="Back preview" className="h-full object-contain" />
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="h-8 w-8 text-light-gray-70 mb-2" />
                            <span className="text-sm text-light-gray-70">Click to upload back photo</span>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoChange(e, 'back')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isUploading || createWatch.isPending}
                  className="w-full bg-luxury-gold text-smoky-black hover:bg-luxury-gold/90"
                >
                  {isUploading || createWatch.isPending ? "Adding Watch..." : "Add Watch"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="bg-eerie-black-1 border-jet">
          <CardHeader>
            <CardTitle className="text-white-2">Your Watch Collection</CardTitle>
            <CardDescription className="text-light-gray">
              Manage your luxury watch inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-jet hover:bg-transparent">
                  <TableHead className="text-light-gray-70">Photo</TableHead>
                  <TableHead className="text-light-gray-70">Brand & Model</TableHead>
                  <TableHead className="text-light-gray-70">Reference</TableHead>
                  <TableHead className="text-light-gray-70">Daily Rate</TableHead>
                  <TableHead className="text-light-gray-70">Status</TableHead>
                  <TableHead className="text-light-gray-70">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {watches?.map((watch: any) => (
                  <TableRow key={watch.id} className="border-jet hover:bg-jet/50">
                    <TableCell>
                      <img src={watch.imageUrl} alt={watch.name} className="h-16 w-16 object-cover rounded" />
                    </TableCell>
                    <TableCell className="text-white-2">
                      <div className="font-semibold">{watch.brand}</div>
                      <div className="text-sm text-light-gray">{watch.model}</div>
                    </TableCell>
                    <TableCell className="text-light-gray">{watch.referenceNumber}</TableCell>
                    <TableCell className="text-luxury-gold font-semibold">
                      ${(watch.dailyRate / 100).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={watch.available ? "default" : "secondary"}
                        className={watch.available ? "bg-luxury-gold text-smoky-black" : "bg-jet text-light-gray"}
                      >
                        {watch.available ? "Available" : "Rented"}
                      </Badge>
                      <p className="text-xs text-light-gray-70 mt-1">Auto-managed by rentals</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(watch)}
                          className="border-light-gray-70 text-light-gray hover:text-luxury-gold"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(watch.id)}
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Dialog - Similar structure to Add Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-eerie-black-1 border-jet max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white-2">Edit Watch</DialogTitle>
              <DialogDescription className="text-light-gray">
                Update watch details
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Same form fields as Add Dialog */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-brand" className="text-white-2">Brand</Label>
                  <Input
                    id="edit-brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    required
                    className="bg-jet border-light-gray-70 text-white-2"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-model" className="text-white-2">Model</Label>
                  <Input
                    id="edit-model"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    required
                    className="bg-jet border-light-gray-70 text-white-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-name" className="text-white-2">Full Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-jet border-light-gray-70 text-white-2"
                />
              </div>

              <div>
                <Label htmlFor="edit-referenceNumber" className="text-white-2">Reference Number</Label>
                <Input
                  id="edit-referenceNumber"
                  value={formData.referenceNumber}
                  onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                  className="bg-jet border-light-gray-70 text-white-2"
                />
              </div>

              <div>
                <Label htmlFor="edit-description" className="text-white-2">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  className="bg-jet border-light-gray-70 text-white-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-caseSize" className="text-white-2">Case Size</Label>
                  <Input
                    id="edit-caseSize"
                    value={formData.caseSize}
                    onChange={(e) => setFormData({ ...formData, caseSize: e.target.value })}
                    placeholder="e.g., 41mm"
                    className="bg-jet border-light-gray-70 text-white-2"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-movement" className="text-white-2">Movement</Label>
                  <Input
                    id="edit-movement"
                    value={formData.movement}
                    onChange={(e) => setFormData({ ...formData, movement: e.target.value })}
                    placeholder="e.g., Automatic"
                    className="bg-jet border-light-gray-70 text-white-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-waterResistance" className="text-white-2">Water Resistance</Label>
                  <Input
                    id="edit-waterResistance"
                    value={formData.waterResistance}
                    onChange={(e) => setFormData({ ...formData, waterResistance: e.target.value })}
                    placeholder="e.g., 50m"
                    className="bg-jet border-light-gray-70 text-white-2"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-material" className="text-white-2">Material</Label>
                  <Input
                    id="edit-material"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="e.g., Stainless Steel"
                    className="bg-jet border-light-gray-70 text-white-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-dailyRate" className="text-white-2">Daily Rate (in cents)</Label>
                <Input
                  id="edit-dailyRate"
                  type="number"
                  value={formData.dailyRate}
                  onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                  required
                  className="bg-jet border-light-gray-70 text-white-2"
                />
                <p className="text-xs text-light-gray-70 mt-1">
                  Current: ${(parseInt(formData.dailyRate) / 100).toFixed(2)} per day
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-white-2">Front Photo</Label>
                  <div className="mt-2">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-light-gray-70 rounded-lg cursor-pointer hover:border-luxury-gold transition-colors">
                      {frontPhotoPreview ? (
                        <img src={frontPhotoPreview} alt="Front preview" className="h-full object-contain" />
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="h-8 w-8 text-light-gray-70 mb-2" />
                          <span className="text-sm text-light-gray-70">Click to upload front photo</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoChange(e, 'front')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <Label className="text-white-2">Back Photo</Label>
                  <div className="mt-2">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-light-gray-70 rounded-lg cursor-pointer hover:border-luxury-gold transition-colors">
                      {backPhotoPreview ? (
                        <img src={backPhotoPreview} alt="Back preview" className="h-full object-contain" />
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="h-8 w-8 text-light-gray-70 mb-2" />
                          <span className="text-sm text-light-gray-70">Click to upload back photo</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoChange(e, 'back')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isUploading || updateWatch.isPending}
                className="w-full bg-luxury-gold text-smoky-black hover:bg-luxury-gold/90"
              >
                {isUploading || updateWatch.isPending ? "Updating Watch..." : "Update Watch"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
