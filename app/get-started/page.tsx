"use client"

import type React from "react"
import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  User, Building2, Users, ArrowRight, CheckCircle, Star, 
  Shield, Zap, TrendingUp, Award, Sparkles, Heart,
  Car, Home, Wrench, Camera, Laptop, Shirt, Music
} from "lucide-react"
import Link from "next/link"
import { useAuthContext } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

// User journey options
const userJourneys = [
  {
    id: "renter",
    title: "I want to rent items",
    subtitle: "Find and rent items from other users",
    icon: User,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    borderColor: "border-blue-200",
    popular: true,
    stats: "10,000+ items available",
    features: [
      "Browse thousands of items",
      "Secure payment processing", 
      "24/7 customer support",
      "Insurance protection",
      "Flexible rental periods",
      "Easy booking process"
    ],
    benefits: [
      "Save money on purchases",
      "Try before you buy",
      "Access to premium items",
      "No maintenance costs"
    ],
    categories: [
      { name: "Vehicles", icon: Car, count: "1,200+" },
      { name: "Homes", icon: Home, count: "800+" },
      { name: "Equipment", icon: Wrench, count: "2,500+" },
      { name: "Electronics", icon: Laptop, count: "1,800+" }
    ]
  },
  {
    id: "owner",
    title: "I want to list items",
    subtitle: "Earn money by renting out your items",
    icon: Building2,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    borderColor: "border-green-200",
    popular: true,
    stats: "Average $500/month earnings",
    features: [
      "Easy listing creation",
      "Flexible pricing control",
      "Secure payment collection",
      "Marketing support",
      "Damage protection",
      "Analytics dashboard"
    ],
    benefits: [
      "Generate passive income",
      "Monetize unused items",
      "Flexible schedule",
      "Low startup costs"
    ],
    categories: [
      { name: "Fashion", icon: Shirt, count: "1,100+" },
      { name: "Photography", icon: Camera, count: "400+" },
      { name: "Entertainment", icon: Music, count: "600+" },
      { name: "Sports", icon: Wrench, count: "900+" }
    ]
  },
  {
    id: "both",
    title: "I want to do both",
    subtitle: "Rent items and list your own",
    icon: Users,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
    borderColor: "border-purple-200",
    popular: false,
    stats: "Full platform access",
    features: [
      "Complete platform access",
      "Maximum earning potential",
      "Flexible rental options",
      "Advanced analytics",
      "Priority support",
      "Exclusive features"
    ],
    benefits: [
      "Best of both worlds",
      "Maximum flexibility",
      "Higher earning potential",
      "Complete control"
    ],
    categories: [
      { name: "All Categories", icon: Star, count: "8,000+" },
      { name: "Premium Items", icon: Award, count: "500+" },
      { name: "Exclusive Access", icon: Sparkles, count: "100+" },
      { name: "Priority Support", icon: Shield, count: "24/7" }
    ]
  }
]

// Success stories
const successStories = [
  {
    name: "Sarah M.",
    role: "Fashion Designer",
    story: "I've earned over $2,000 renting out my designer dresses and accessories. It's amazing how much my unused wardrobe is worth!",
    earnings: "$2,000+",
    type: "owner"
  },
  {
    name: "John K.",
    role: "Photographer",
    story: "Renting professional camera equipment has saved me thousands. I can access the latest gear without the huge upfront cost.",
    savings: "$5,000+",
    type: "renter"
  },
  {
    name: "Maria L.",
    role: "Entrepreneur",
    story: "I both rent and list items. My car rental business brings in $1,500/month while I rent equipment for my events.",
    earnings: "$1,500/month",
    type: "both"
  }
]

export default function GetStartedPage() {
  const { user } = useAuthContext()
  const router = useRouter()
  const [selectedJourney, setSelectedJourney] = useState<string>("")

  const handleJourneySelect = (journeyId: string) => {
    setSelectedJourney(journeyId)
  }

  const handleContinue = () => {
    if (user) {
      router.push('/onboarding')
    } else {
      router.push('/signup')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Join the Sharing Economy Revolution
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              How do you want to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                get started?
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Whether you want to rent items or earn money by listing your own, 
              we'll help you get started with the perfect plan for your needs.
            </p>
          </div>
        </div>
      </section>

      {/* User Journey Selection */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {userJourneys.map((journey) => {
              const IconComponent = journey.icon
              return (
                <Card 
                  key={journey.id}
                  className={`group cursor-pointer border-2 transition-all duration-300 hover:shadow-xl ${
                    selectedJourney === journey.id 
                      ? 'border-blue-500 ring-2 ring-blue-500/20 scale-105' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleJourneySelect(journey.id)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className={`w-20 h-20 ${journey.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`h-10 w-10 ${journey.textColor}`} />
                    </div>
                    <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      {journey.title}
                    </CardTitle>
                    <CardDescription className="text-base text-gray-600 mb-4">
                      {journey.subtitle}
                    </CardDescription>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Badge variant="secondary" className="text-sm">
                        {journey.stats}
                      </Badge>
                      {journey.popular && (
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Features */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">What you get:</h4>
                      <div className="space-y-2">
                        {journey.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Key benefits:</h4>
                      <div className="space-y-2">
                        {journey.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <Zap className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Categories */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Available categories:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {journey.categories.map((category, index) => {
                          const CategoryIcon = category.icon
                          return (
                            <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                              <CategoryIcon className="h-3 w-3 text-gray-400" />
                              <span className="truncate">{category.name}</span>
                              <span className="text-gray-400">({category.count})</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button 
                      className={`w-full bg-gradient-to-r ${journey.color} hover:opacity-90 text-white`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleJourneySelect(journey.id)
                      }}
                    >
                      Choose This Path
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how our users are making the most of the sharing economy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900">{story.name}</h3>
                    <p className="text-sm text-gray-600">{story.role}</p>
                  </div>
                  <p className="text-sm text-gray-700 mb-4 italic">"{story.story}"</p>
                  <div className="text-center">
                    <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {story.earnings || story.savings}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-4xl">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="mb-6">
                <Award className="h-16 w-16 mx-auto mb-4 opacity-90" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto mb-6">
                  {selectedJourney 
                    ? `Perfect! You've chosen to ${userJourneys.find(j => j.id === selectedJourney)?.title.toLowerCase()}. Let's set up your profile.`
                    : "Join thousands of users who trust Leli Rentals for their rental needs."
                  }
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
                  onClick={handleContinue}
                  disabled={!selectedJourney}
                >
                  <Zap className="h-5 w-5 mr-2" />
                  {selectedJourney ? 'Continue Setup' : 'Choose Your Path First'}
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-6"
                  onClick={() => router.push('/categories')}
                >
                  Browse Categories
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
