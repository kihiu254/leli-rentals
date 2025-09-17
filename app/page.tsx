"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ArrowRight, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useState } from "react"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/listings?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section
        className="relative h-[70vh] sm:h-[80vh] md:h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center hero-background"
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 md:mb-6 text-balance">
            Find Your Perfect Rental
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-12 text-pretty max-w-2xl mx-auto leading-relaxed">
            Discover amazing rentals for every occasion.
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>From cars to equipment, we've got you covered.
          </p>

          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 max-w-4xl mx-auto shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 items-center">
              <div className="flex-1 relative w-full">
                <Search className="absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="What are you looking for?"
                  className="pl-10 sm:pl-12 h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg border-0 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 md:px-8 h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg font-semibold rounded-lg sm:rounded-xl min-w-[80px] sm:min-w-[100px] md:min-w-[120px] w-full sm:w-auto"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Why Choose Leli Rentals?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the future of rentals with our modern platform
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-4 sm:p-6 md:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Search className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Easy Search</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Find exactly what you need with our powerful search and filtering system.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-4 sm:p-6 md:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <svg className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Verified Listings</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  All our rentals are verified and quality-checked for your peace of mind.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-4 sm:p-6 md:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <svg className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Instant Booking</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Book instantly with our streamlined reservation system.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Popular Categories</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore our most popular rental categories
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {[
              {
                name: "Vehicles",
                count: "1,800+ listings",
                href: "/listings/vehicles",
                image: "/luxury-cars-in-modern-showroom.jpg",
              },
              {
                name: "Equipment",
                count: "3,200+ listings",
                href: "/listings/equipment",
                image: "/professional-construction-and-industrial-equipment.jpg",
              },
              {
                name: "Homes & Apartments",
                count: "2,500+ listings",
                href: "/listings/homes",
                image: "/modern-apartment-city-view.png",
              },
              {
                name: "Event Spaces",
                count: "850+ listings",
                href: "/listings/events",
                image: "/elegant-event-venue-with-chandeliers-and-tables.jpg",
              },
              {
                name: "Electronics",
                count: "950+ listings",
                href: "/listings/tech",
                image: "/modern-electronics-and-tech-gadgets-display.jpg",
              },
              {
                name: "Fashion",
                count: "1,200+ listings",
                href: "/listings/fashion",
                image: "/designer-clothing-and-fashion-accessories.jpg",
              },
              {
                name: "Tools",
                count: "900+ listings",
                href: "/listings/tools",
                image: "/professional-construction-and-industrial-equipment.jpg",
              },
            ].map((category, index) => (
              <Link key={index} href={category.href}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const t = e.target as HTMLImageElement
                        t.src = "/placeholder.svg"
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg sm:text-xl font-bold mb-1">{category.name}</h3>
                      <p className="text-sm opacity-90">{category.count}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-4xl">
          <div className="text-center text-white mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Ready to Join the Sharing Economy?
            </h2>
            <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto mb-8">
              Whether you want to rent items or earn money by listing your own, 
              we'll help you get started with the perfect plan.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Link href="/get-started">
              <Card className="group cursor-pointer border-0 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 sm:p-8 text-center text-white">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <User className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Get Started</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Choose your path and set up your profile in minutes
                  </p>
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                    Start Your Journey
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/categories">
              <Card className="group cursor-pointer border-0 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 sm:p-8 text-center text-white">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Search className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Browse Categories</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Explore thousands of items across all categories
                  </p>
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                    Explore Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
