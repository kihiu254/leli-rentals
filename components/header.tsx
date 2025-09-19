"use client"

import type React from "react"

import { Search, Moon, Sun, User, Bell, ChevronDown, Menu, X } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useAuthContext } from "@/components/auth-provider"
import { useNotificationContext } from "@/lib/notification-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationPanel } from "@/components/notification-panel"

export function Header() {
  const { theme, setTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user } = useAuthContext()
  const { unreadCount, refreshNotifications } = useNotificationContext()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Refresh notifications when user changes or panel opens
  useEffect(() => {
    if (user?.id) {
      refreshNotifications()
    }
  }, [user?.id, refreshNotifications])

  // Refresh notifications when panel opens/closes
  useEffect(() => {
    if (isNotificationPanelOpen && user?.id) {
      refreshNotifications()
    }
  }, [isNotificationPanelOpen, user?.id, refreshNotifications])

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

  const handleNotificationPanelClose = () => {
    setIsNotificationPanelOpen(false)
    // Refresh notifications when panel closes to update unread count
    if (user?.id) {
      refreshNotifications()
    }
  }

  return (
    <header className="w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/90 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-all duration-300 shadow-theme">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 md:px-6 max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center group mr-8 lg:mr-12">
          <img 
            src="/default-monochrome-black.svg" 
            alt="Leli Rentals Logo" 
            className="logo-mobile sm:logo-desktop object-contain dark:hidden hover:opacity-80 transition-opacity duration-200"
          />
          <img 
            src="/default-monochrome-white.svg" 
            alt="Leli Rentals Logo" 
            className="logo-mobile sm:logo-desktop object-contain hidden dark:block hover:opacity-80 transition-opacity duration-200"
          />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          <Link 
            href="/" 
            className="text-sm xl:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors duration-200"
          >
            Home
          </Link>
          <Link 
            href="/categories" 
            className="text-sm xl:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors duration-200"
          >
            Categories
          </Link>
          <Link 
            href="/get-started" 
            className="text-sm xl:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors duration-200"
          >
            Get Started
          </Link>
          <Link 
            href="/about" 
            className="text-sm xl:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors duration-200"
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className="text-sm xl:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors duration-200"
          >
            Contact
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden h-8 w-8 sm:h-9 sm:w-9 text-gray-800 dark:text-gray-200 hover:text-orange-500 transition-all duration-200"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
        </Button>

        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3 flex-1 max-w-sm mx-2">
          <div className="relative flex-1 group">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 group-focus-within:text-orange-500 transition-colors duration-200" />
            <Input
              placeholder="Search Rentals"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-8 h-8 sm:h-9 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500 transition-all duration-200 focus-enhanced text-sm"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="h-8 sm:h-9 px-2 sm:px-3 bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 btn-animate"
          >
            <Search className="h-3 w-3" />
          </Button>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="h-8 w-8 sm:h-9 sm:w-9 text-gray-800 dark:text-gray-200 hover:text-orange-500 transition-all duration-200 btn-animate"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-yellow-500" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-blue-400" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}

          {user ? (
            // Authenticated user section
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notification Bell */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsNotificationPanelOpen(true)}
                  className={`h-8 w-8 sm:h-9 sm:w-9 transition-colors relative ${
                    unreadCount > 0 
                      ? 'text-orange-500 hover:text-orange-600' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-orange-500'
                  }`}
                >
                  <Bell className={`h-4 w-4 ${unreadCount > 0 ? 'animate-pulse' : ''}`} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-bounce">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Button>
              </div>

              {/* User Profile Dropdown */}
              {mounted && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                        <AvatarImage src={user.avatar || ""} />
                        <AvatarFallback className="bg-purple-500 text-white text-xs sm:text-sm font-medium">
                          {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {user.name || user.email?.split("@")[0] || "User"}
                      </span>
                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile/bookings" className="cursor-pointer">
                        My Bookings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile/listings" className="cursor-pointer">
                        My Listings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile/favorites" className="cursor-pointer">
                        Favorites
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile/settings" className="cursor-pointer">
                        Account Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile/billing" className="cursor-pointer">
                        Billing & Payments
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/help" className="cursor-pointer">
                        Help & Support
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => auth.signOut()}
                      className="cursor-pointer text-red-600 hover:text-red-700"
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ) : (
            // Non-authenticated user section
            <>
              <div className="hidden md:flex items-center gap-2 lg:gap-3">
                <Button
                  variant="ghost"
                  asChild
                  className="text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors text-sm lg:text-base"
                >
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button
                  asChild
                  className="bg-orange-500 hover:bg-orange-600 text-white transition-all rounded-lg text-sm lg:text-base px-3 lg:px-4"
                >
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>

              {mounted && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 sm:h-9 sm:w-9 text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors md:hidden"
                    >
                      <User className="h-4 w-4" />
                      <span className="sr-only">Profile menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="cursor-pointer">
                        Sign in
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/signup" className="cursor-pointer">
                        Sign up
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="container mx-auto px-4 py-4 max-w-7xl">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/categories" 
                className="text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                href="/get-started" 
                className="text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
              <Link 
                href="/about" 
                className="text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
            
            {/* Mobile Search */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search Rentals"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 h-10 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500 transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={isNotificationPanelOpen}
        onClose={handleNotificationPanelClose}
      />
    </header>
  )
}