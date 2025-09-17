"use client"

import type React from "react"

import { Search, Moon, Sun, User, Bell, ChevronDown } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth"
import { useNotifications } from "@/lib/notification-context"
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
  const auth = useAuth()
  const { unreadCount } = useNotifications()

  useEffect(() => {
    setMounted(true)
  }, [])

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
    <header className="w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/90 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 md:px-6 max-w-7xl">
        <Link href="/" className="flex items-center">
          <Image
            src={mounted && theme === "dark" ? "/logo-white.svg" : "/logo-black.svg"}
            alt="Leli Rentals"
            width={96}
            height={24}
            className="h-5 w-auto sm:h-6 transition-all duration-200"
            priority
          />
        </Link>

        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          <Link href="/" className="text-orange-500 hover:text-orange-600 font-medium transition-colors text-sm xl:text-base">
            Home
          </Link>
          <Link
            href="/categories"
            className="text-gray-700 dark:text-gray-300 hover:text-orange-500 font-medium transition-colors text-sm xl:text-base"
          >
            Categories
          </Link>
          <Link
            href="/get-started"
            className="text-gray-700 dark:text-gray-300 hover:text-orange-500 font-medium transition-colors text-sm xl:text-base"
          >
            Get Started
          </Link>
          <Link
            href="/about"
            className="text-gray-700 dark:text-gray-300 hover:text-orange-500 font-medium transition-colors text-sm xl:text-base"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-gray-700 dark:text-gray-300 hover:text-orange-500 font-medium transition-colors text-sm xl:text-base"
          >
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9 text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors lg:hidden"
            onClick={() => {
              // Toggle mobile search - you can implement a mobile search modal here
              const searchInput = document.querySelector('input[placeholder="Search Rentals"]') as HTMLInputElement
              if (searchInput) {
                searchInput.focus()
              }
            }}
          >
            <Search className="h-4 w-4" />
          </Button>
          
          <div className="hidden lg:flex relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search Rentals"
              className="pl-10 w-48 xl:w-64 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            {searchQuery && (
              <Button
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2 bg-orange-500 hover:bg-orange-600"
                onClick={handleSearch}
              >
                <Search className="h-3 w-3" />
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="h-8 w-8 sm:h-9 sm:w-9 text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {auth.user ? (
            // Authenticated user section - matches the image design
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notification Bell */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9 text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors"
                  onClick={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
                >
                  <Bell className="h-4 w-4" />
                </Button>
                {/* Notification badge */}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center text-[10px] sm:text-xs">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                      <AvatarImage src={auth.user.avatar || ""} />
                      <AvatarFallback className="bg-purple-500 text-white text-xs sm:text-sm font-medium">
                        {auth.user.name?.charAt(0) || auth.user.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {auth.user.name || auth.user.email?.split("@")[0] || "User"}
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
            </>
          )}
        </div>
      </div>
      
      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
      />
    </header>
  )
}
