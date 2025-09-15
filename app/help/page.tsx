"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, MessageCircle, Phone, Mail, Book, Shield, CreditCard, Home, Car } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

// Mock FAQ data
const faqCategories = [
  {
    title: "Getting Started",
    icon: <Book className="h-5 w-5" />,
    questions: [
      {
        question: "How do I create an account?",
        answer:
          "Click the 'Sign up' button in the top right corner and fill out the registration form with your email, password, and basic information.",
      },
      {
        question: "How do I list my first item?",
        answer:
          "After creating your account, go to your profile and click 'Add New Listing'. Fill out the item details, upload photos, set your price, and publish your listing.",
      },
      {
        question: "How do I book a rental?",
        answer:
          "Browse our listings, select the item you want, choose your rental dates, and click 'Book Now'. You'll need to provide payment information to complete the booking.",
      },
    ],
  },
  {
    title: "Payments & Billing",
    icon: <CreditCard className="h-5 w-5" />,
    questions: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. Payments are processed securely through our platform.",
      },
      {
        question: "When do I get paid as a host?",
        answer:
          "Payments are released to hosts 24 hours after the rental period begins, provided there are no issues reported by the renter.",
      },
      {
        question: "What are the fees?",
        answer:
          "We charge a 3% service fee to hosts and a 5% booking fee to renters. These fees help us maintain the platform and provide customer support.",
      },
    ],
  },
  {
    title: "Safety & Security",
    icon: <Shield className="h-5 w-5" />,
    questions: [
      {
        question: "How do you verify users?",
        answer:
          "All users must verify their email address and phone number. We also offer optional ID verification for additional trust and security.",
      },
      {
        question: "What if something goes wrong with my rental?",
        answer:
          "Contact our support team immediately. We have a resolution center to help mediate disputes and our Host Guarantee covers eligible damages up to $1,000,000.",
      },
      {
        question: "How do I report a problem?",
        answer:
          "You can report issues through your booking page, contact our support team directly, or use the 'Report' button on any listing or user profile.",
      },
    ],
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [helpForm, setHelpForm] = useState({ subject: "", message: "" })
  const { toast } = useToast()

  const handleSupportContact = (method: string) => {
    switch (method) {
      case "chat":
        toast({
          title: "Opening Live Chat",
          description: "Connecting you with our support team...",
        })
        // In a real app, this would open a chat widget
        break
      case "email":
        window.location.href = "mailto:info@lelirentals.com?subject=Support Request"
        break
      case "phone":
        window.location.href = "tel:+254112081866"
        break
      default:
        break
    }
  }

  const handleQuickLink = (topic: string) => {
    const links = {
      vehicles: "/help/vehicles",
      hosting: "/help/hosting",
      safety: "/help/safety",
      payments: "/help/payments",
    }

    // For now, show toast since we don't have these pages yet
    toast({
      title: `Opening ${topic} guide`,
      description: "Loading help article...",
    })

    // In a real app, you would navigate to the specific help page
    // window.location.href = links[topic as keyof typeof links]
  }

  const handleHelpFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!helpForm.subject || !helpForm.message) {
      toast({
        title: "Please fill in all fields",
        description: "Both subject and message are required.",
        variant: "destructive",
      })
      return
    }

    // Simulate form submission
    toast({
      title: "Message sent!",
      description: "Our support team will get back to you within 24 hours.",
    })

    setHelpForm({ subject: "", message: "" })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Help & Support</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions or get in touch with our support team
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search for help articles..."
              className="pl-12 h-12 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>

            <div className="space-y-6">
              {faqCategories.map((category, categoryIndex) => (
                <Card key={categoryIndex} className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {category.icon}
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      {category.questions.map((faq, faqIndex) => (
                        <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                          <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact & Quick Links */}
          <div className="space-y-6">
            {/* Contact Support */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>Get personalized help from our team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                  onClick={() => handleSupportContact("chat")}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Live Chat
                </Button>
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                  onClick={() => handleSupportContact("email")}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </Button>
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                  onClick={() => handleSupportContact("phone")}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Us
                </Button>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
                <CardDescription>Common help topics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="ghost" onClick={() => handleQuickLink("vehicles")}>
                  <Car className="h-4 w-4 mr-2" />
                  Vehicle Rentals Guide
                </Button>
                <Button className="w-full justify-start" variant="ghost" onClick={() => handleQuickLink("hosting")}>
                  <Home className="h-4 w-4 mr-2" />
                  Property Hosting Tips
                </Button>
                <Button className="w-full justify-start" variant="ghost" onClick={() => handleQuickLink("safety")}>
                  <Shield className="h-4 w-4 mr-2" />
                  Safety Guidelines
                </Button>
                <Button className="w-full justify-start" variant="ghost" onClick={() => handleQuickLink("payments")}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Issues
                </Button>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>Can't find what you're looking for?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleHelpFormSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="What can we help you with?"
                      value={helpForm.subject}
                      onChange={(e) => setHelpForm((prev) => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Describe your issue or question..."
                      rows={4}
                      value={helpForm.message}
                      onChange={(e) => setHelpForm((prev) => ({ ...prev, message: e.target.value }))}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
