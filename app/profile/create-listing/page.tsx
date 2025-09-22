"use client"

import React, { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload, 
  Camera, 
  MapPin, 
  DollarSign, 
  Star, 
  CheckCircle, 
  AlertCircle,
  X,
  Home,
  Building,
  Truck,
  Gamepad2,
  Palette,
  Wrench,
  Activity,
  Loader2,
  Phone,
  Mail,
  Settings,
  Image as ImageIcon
} from "lucide-react"
import { useAuthContext } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { listingsService } from "@/lib/listings-service"
import Image from "next/image"

const CATEGORIES = [
  { 
    value: "homes", 
    label: "Homes & Apartments", 
    icon: <Home className="h-5 w-5" />,
    description: "Rent out your home, apartment, or room"
  },
  { 
    value: "vehicles", 
    label: "Vehicles", 
    icon: <Truck className="h-5 w-5" />,
    description: "Cars, motorcycles, bikes, and more"
  },
  { 
    value: "equipment", 
    label: "Equipment & Tools", 
    icon: <Wrench className="h-5 w-5" />,
    description: "Professional equipment and tools"
  },
  { 
    value: "events", 
    label: "Event Spaces", 
    icon: <Building className="h-5 w-5" />,
    description: "Venues, halls, and event spaces"
  },
  { 
    value: "tech", 
    label: "Tech & Gadgets", 
    icon: <Gamepad2 className="h-5 w-5" />,
    description: "Electronics, gaming, and tech"
  },
  { 
    value: "fashion", 
    label: "Fashion & Lifestyle", 
    icon: <Palette className="h-5 w-5" />,
    description: "Clothing, accessories, and style"
  },
  { 
    value: "sports", 
    label: "Sports & Recreation", 
    icon: <Activity className="h-5 w-5" />,
    description: "Sports equipment and activities"
  },
]

interface ListingFormData {
  title: string
  description: string
  fullDescription: string
  category: string
  price: string
  location: string
  contactPhone: string
  contactEmail: string
  available: boolean
  minimumRentalDays: string
  maximumRentalDays: string
  images: string[]
  amenities: string[]
  instantBooking: boolean
  requiresApproval: boolean
  cancellationPolicy: string
}

export default function CreateListingPage() {
  const { user } = useAuthContext()
  const router = useRouter()
  const { toast } = useToast()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  
  const [formData, setFormData] = useState<ListingFormData>({
    title: "",
    description: "",
    fullDescription: "",
    category: "",
    price: "",
    location: "",
    contactPhone: "",
    contactEmail: "",
    available: true,
    minimumRentalDays: "1",
    maximumRentalDays: "30",
    images: [],
    amenities: [],
    instantBooking: false,
    requiresApproval: true,
    cancellationPolicy: "moderate",
  })
  
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Calculate completion percentage
  const getCompletionPercentage = () => {
    const fields = [
      formData.title,
      formData.description,
      formData.fullDescription,
      formData.category,
      formData.price,
      formData.location,
      formData.images.length,
    ]
    const filledFields = fields.filter(field => 
      typeof field === 'string' ? field.trim() !== '' : field > 0
    ).length
    return Math.round((filledFields / fields.length) * 100)
  }
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }
    if (!formData.fullDescription.trim()) {
      newErrors.fullDescription = "Detailed description is required"
    }
    if (!formData.category) {
      newErrors.category = "Category is required"
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required"
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }
    if (formData.images.length === 0) {
      newErrors.images = "At least one image is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || !user) return
    
    setIsUploadingImages(true)
    
    try {
      const validFiles: File[] = []
      const previewUrls: string[] = []
      
      // Validate files
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          toast({
            title: "File too large",
            description: `${file.name} is larger than 10MB`,
            variant: "destructive"
          })
          continue
        }
        
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not an image file`,
            variant: "destructive"
          })
          continue
        }
        
        validFiles.push(file)
        const previewUrl = URL.createObjectURL(file)
        previewUrls.push(previewUrl)
      }
      
      if (validFiles.length === 0) return
      
      // Simulate image upload (replace with actual upload logic)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const uploadedUrls = validFiles.map((_, index) => 
        `https://picsum.photos/800/600?random=${Date.now()}-${index}`
      )
      
      setUploadedImages(prev => [...prev, ...validFiles])
      setImagePreviewUrls(prev => [...prev, ...previewUrls])
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }))
      
      // Clear the input
      event.target.value = ''
      
      toast({
        title: "Images uploaded successfully!",
        description: `${validFiles.length} image(s) uploaded`,
      })
    } catch (error) {
      console.error("Error uploading images:", error)
      toast({
        title: "Upload failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUploadingImages(false)
    }
  }
  
  // Remove image
  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviewUrls(prev => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }
  
  // Handle form submission
  const handleSubmit = async (publish: boolean = true) => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to create a listing",
        variant: "destructive"
      })
      return
    }
    
    if (publish) {
      setIsSubmitting(true)
    } else {
      setIsSavingDraft(true)
    }
    
    try {
      const listingData = {
        title: formData.title,
        description: formData.description,
        fullDescription: formData.fullDescription,
        price: parseFloat(formData.price),
        category: formData.category,
        location: formData.location,
        rating: 0,
        reviews: 0,
        image: formData.images[0] || '/placeholder.svg',
        amenities: formData.amenities,
        available: formData.available,
        images: formData.images,
        owner: {
          id: user.id,
          name: user.name || 'Unknown',
          avatar: user.avatar || '/placeholder.svg',
          rating: 4.5,
          verified: true,
          phone: formData.contactPhone || undefined,
        },
        ownerId: user.id,
      }
      
      // Create listing
      const listingId = await listingsService.createListing(listingData)
      
      toast({
        title: publish ? "Listing Published!" : "Draft Saved!",
        description: publish 
          ? "Your listing is now live and visible to renters." 
          : "Your listing has been saved as a draft.",
      })
      
      // Redirect to listings page
      router.push('/profile/listings')
      
    } catch (error) {
      console.error("Error creating listing:", error)
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
      setIsSavingDraft(false)
    }
  }
  
  // Navigation handlers
  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }
  
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }
  
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
              <p className="text-muted-foreground mb-4">
                Please log in to create a listing
              </p>
              <Button onClick={() => router.push('/login')}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Progress Bar */}
      <div className="border-b bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/profile/listings')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Listings
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Create New Listing</h1>
                <p className="text-sm text-muted-foreground">
                  {getCompletionPercentage()}% complete
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSubmit(false)}
                disabled={isSavingDraft}
                className="flex items-center gap-2"
              >
                {isSavingDraft ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Draft
              </Button>
              <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Listing Preview</DialogTitle>
                    <DialogDescription>
                      This is how your listing will appear to potential renters
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Card>
                      <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <CardContent>
                        <h3 className="font-semibold text-lg mb-2">{formData.title || "Untitled Listing"}</h3>
                        <p className="text-muted-foreground mb-4">{formData.description || "No description provided"}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold">${formData.price || "0"}/day</span>
                          <Badge variant="outline">{formData.category || "Uncategorized"}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <Progress value={getCompletionPercentage()} className="h-2" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Tabs value={currentStep.toString()} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="1" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Basic Info</span>
                </TabsTrigger>
                <TabsTrigger value="2" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  <span className="hidden sm:inline">Photos</span>
                </TabsTrigger>
                <TabsTrigger value="3" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Details</span>
                </TabsTrigger>
                <TabsTrigger value="4" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="hidden sm:inline">Pricing</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Step 1: Basic Information */}
              <TabsContent value="1" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5" />
                      Basic Information
                    </CardTitle>
                    <CardDescription>
                      Tell us about your listing - what makes it special?
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Listing Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Modern Downtown Apartment with City Views"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className={errors.title ? "border-red-500" : ""}
                      />
                      {errors.title && (
                        <p className="text-sm text-red-500">{errors.title}</p>
                      )}
                    </div>
                    
                    {/* Category */}
                    <div className="space-y-2">
                      <Label>Category *</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {CATEGORIES.map((category) => (
                          <div
                            key={category.value}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              formData.category === category.value
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                          >
                            <div className="flex items-center gap-3">
                              {category.icon}
                              <div>
                                <h4 className="font-medium">{category.label}</h4>
                                <p className="text-sm text-muted-foreground">{category.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {errors.category && (
                        <p className="text-sm text-red-500">{errors.category}</p>
                      )}
                    </div>
                    
                    {/* Short Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Short Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description that will appear in search results..."
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className={errors.description ? "border-red-500" : ""}
                        rows={3}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500">{errors.description}</p>
                      )}
                    </div>
                    
                    {/* Detailed Description */}
                    <div className="space-y-2">
                      <Label htmlFor="fullDescription">Detailed Description *</Label>
                      <Textarea
                        id="fullDescription"
                        placeholder="Provide a comprehensive description of your listing, including what makes it unique, what's included, and what renters can expect..."
                        value={formData.fullDescription}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullDescription: e.target.value }))}
                        className={errors.fullDescription ? "border-red-500" : ""}
                        rows={6}
                      />
                      {errors.fullDescription && (
                        <p className="text-sm text-red-500">{errors.fullDescription}</p>
                      )}
                    </div>
                    
                    {/* Location */}
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="location"
                          placeholder="e.g., Downtown, San Francisco, CA"
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          className={errors.location ? "border-red-500" : ""}
                        />
                      </div>
                      {errors.location && (
                        <p className="text-sm text-red-500">{errors.location}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-end">
                  <Button onClick={nextStep} className="flex items-center gap-2">
                    Next: Add Photos
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              {/* Step 2: Photos */}
              <TabsContent value="2" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Photos
                    </CardTitle>
                    <CardDescription>
                      Add high-quality photos to showcase your listing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={isUploadingImages}
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center gap-4"
                      >
                        {isUploadingImages ? (
                          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                        ) : (
                          <Upload className="h-12 w-12 text-muted-foreground" />
                        )}
                        <div>
                          <p className="text-lg font-medium">
                            {isUploadingImages ? "Uploading..." : "Click to upload photos"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            PNG, JPG up to 10MB each
                          </p>
                        </div>
                      </label>
                    </div>
                    
                    {/* Image Preview Grid */}
                    {imagePreviewUrls.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {imagePreviewUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                              <Image
                                src={url}
                                alt={`Preview ${index + 1}`}
                                width={200}
                                height={200}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            {index === 0 && (
                              <Badge className="absolute bottom-2 left-2">
                                Main Photo
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {errors.images && (
                      <p className="text-sm text-red-500">{errors.images}</p>
                    )}
                  </CardContent>
                </Card>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button onClick={nextStep} className="flex items-center gap-2">
                    Next: Add Details
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              {/* Step 3: Details & Amenities */}
              <TabsContent value="3" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Details & Amenities
                    </CardTitle>
                    <CardDescription>
                      What features and amenities does your listing offer?
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Rental Periods */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="minimumRentalDays">Minimum Rental Period (days)</Label>
                        <Input
                          id="minimumRentalDays"
                          type="number"
                          min="1"
                          value={formData.minimumRentalDays}
                          onChange={(e) => setFormData(prev => ({ ...prev, minimumRentalDays: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maximumRentalDays">Maximum Rental Period (days)</Label>
                        <Input
                          id="maximumRentalDays"
                          type="number"
                          min="1"
                          value={formData.maximumRentalDays}
                          onChange={(e) => setFormData(prev => ({ ...prev, maximumRentalDays: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    {/* Contact Information */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Contact Information</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contactPhone">Phone Number</Label>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <Input
                              id="contactPhone"
                              placeholder="+1 (555) 123-4567"
                              value={formData.contactPhone}
                              onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactEmail">Email Address</Label>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <Input
                              id="contactEmail"
                              type="email"
                              placeholder="your@email.com"
                              value={formData.contactEmail}
                              onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button onClick={nextStep} className="flex items-center gap-2">
                    Next: Set Pricing
                    <DollarSign className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              {/* Step 4: Pricing & Availability */}
              <TabsContent value="4" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Pricing & Availability
                    </CardTitle>
                    <CardDescription>
                      Set your rental price and availability preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Price */}
                    <div className="space-y-2">
                      <Label htmlFor="price">Daily Rental Price (USD) *</Label>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={formData.price}
                          onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                          className={errors.price ? "border-red-500" : ""}
                        />
                      </div>
                      {errors.price && (
                        <p className="text-sm text-red-500">{errors.price}</p>
                      )}
                    </div>
                    
                    {/* Availability */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Availability Settings</Label>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="available"
                            checked={formData.available}
                            onCheckedChange={(checked) => 
                              setFormData(prev => ({ ...prev, available: !!checked }))
                            }
                          />
                          <Label htmlFor="available">Make this listing available for rent</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="instantBooking"
                            checked={formData.instantBooking}
                            onCheckedChange={(checked) => 
                              setFormData(prev => ({ ...prev, instantBooking: !!checked }))
                            }
                          />
                          <Label htmlFor="instantBooking">Allow instant booking</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="requiresApproval"
                            checked={formData.requiresApproval}
                            onCheckedChange={(checked) => 
                              setFormData(prev => ({ ...prev, requiresApproval: !!checked }))
                            }
                          />
                          <Label htmlFor="requiresApproval">Require approval for bookings</Label>
                        </div>
                      </div>
                    </div>
                    
                    {/* Cancellation Policy */}
                    <div className="space-y-2">
                      <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
                      <Select
                        value={formData.cancellationPolicy}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, cancellationPolicy: value }))}
                      >
                        <SelectTrigger>
                          <SelectContent>
                            <SelectItem value="flexible">Flexible - Full refund 1 day before</SelectItem>
                            <SelectItem value="moderate">Moderate - Full refund 5 days before</SelectItem>
                            <SelectItem value="strict">Strict - 50% refund 7 days before</SelectItem>
                          </SelectContent>
                        </SelectTrigger>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleSubmit(false)}
                      disabled={isSavingDraft}
                      className="flex items-center gap-2"
                    >
                      {isSavingDraft ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Save Draft
                    </Button>
                    <Button
                      onClick={() => handleSubmit(true)}
                      disabled={isSubmitting}
                      className="flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      Publish Listing
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Completion Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Listing Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completion</span>
                    <span>{getCompletionPercentage()}%</span>
                  </div>
                  <Progress value={getCompletionPercentage()} className="h-2" />
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    {formData.title ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>Basic Information</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {formData.images.length > 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>Photos ({formData.images.length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {formData.amenities.length > 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>Details & Amenities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {formData.price ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>Pricing</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tips for Success</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Camera className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Great Photos</p>
                    <p className="text-muted-foreground">Use high-quality, well-lit photos</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Detailed Descriptions</p>
                    <p className="text-muted-foreground">Be specific about what's included</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <DollarSign className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Competitive Pricing</p>
                    <p className="text-muted-foreground">Research similar listings</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Quick Responses</p>
                    <p className="text-muted-foreground">Respond to inquiries promptly</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
