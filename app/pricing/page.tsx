"use client"

import type React from "react"
import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Check, Star, Zap, Crown, Users, Shield, TrendingUp, 
  Award, Clock, MessageCircle, BarChart3, Palette, 
  Globe, Smartphone, CreditCard, Truck, Headphones
} from "lucide-react"
import { useAuthContext } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const pricingPlans = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for getting started",
    price: {
      monthly: 0,
      yearly: 0,
    },
    popular: false,
    features: [
      "Up to 3 listings",
      "Basic search and filters",
      "Standard customer support",
      "Basic analytics",
      "Mobile app access",
      "Secure payments",
    ],
    limitations: [
      "Limited to 3 active listings",
      "Basic support only",
      "Standard listing visibility",
    ],
    icon: <Users className="h-6 w-6" />,
    color: "border-gray-200",
    buttonColor: "bg-gray-600 hover:bg-gray-700",
  },
  {
    id: "pro",
    name: "Pro",
    description: "Best for active renters",
    price: {
      monthly: 29,
      yearly: 290,
    },
    popular: true,
    features: [
      "Unlimited listings",
      "Advanced search and filters",
      "Priority customer support",
      "Advanced analytics & insights",
      "Mobile app access",
      "Secure payments",
      "Custom branding",
      "Booking management tools",
      "Automated messaging",
      "Performance optimization",
    ],
    limitations: [],
    icon: <Zap className="h-6 w-6" />,
    color: "border-blue-200",
    buttonColor: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For businesses and agencies",
    price: {
      monthly: 99,
      yearly: 990,
    },
    popular: false,
    features: [
      "Everything in Pro",
      "White-label solution",
      "Dedicated account manager",
      "Custom integrations",
      "Advanced reporting",
      "Multi-user accounts",
      "API access",
      "Custom domain",
      "Priority feature requests",
      "24/7 phone support",
      "Advanced security features",
      "Bulk operations",
    ],
    limitations: [],
    icon: <Crown className="h-6 w-6" />,
    color: "border-purple-200",
    buttonColor: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
  },
]

const features = [
  {
    category: "Listing Management",
    items: [
      { name: "Number of listings", free: "3", pro: "Unlimited", enterprise: "Unlimited" },
      { name: "Photo uploads per listing", free: "5", pro: "20", enterprise: "50" },
      { name: "Video uploads", free: "❌", pro: "✅", enterprise: "✅" },
      { name: "Custom branding", free: "❌", pro: "✅", enterprise: "✅" },
    ],
  },
  {
    category: "Analytics & Insights",
    items: [
      { name: "Basic analytics", free: "✅", pro: "✅", enterprise: "✅" },
      { name: "Advanced insights", free: "❌", pro: "✅", enterprise: "✅" },
      { name: "Revenue tracking", free: "❌", pro: "✅", enterprise: "✅" },
      { name: "Custom reports", free: "❌", pro: "❌", enterprise: "✅" },
    ],
  },
  {
    category: "Support & Features",
    items: [
      { name: "Email support", free: "✅", pro: "✅", enterprise: "✅" },
      { name: "Priority support", free: "❌", pro: "✅", enterprise: "✅" },
      { name: "Phone support", free: "❌", pro: "❌", enterprise: "✅" },
      { name: "Dedicated manager", free: "❌", pro: "❌", enterprise: "✅" },
    ],
  },
]

export default function PricingPage() {
  const { user } = useAuthContext()
  const router = useRouter()
  const { toast } = useToast()
  
  const [isYearly, setIsYearly] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to select a plan.",
        variant: "destructive",
      })
      router.push('/login')
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Plan selected successfully!",
        description: "Your subscription has been activated. You can manage it in your profile settings.",
      })
      
      setSelectedPlan(planId)
      router.push('/profile/billing')
    } catch (error) {
      toast({
        title: "Error selecting plan",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    }
  }

  const formatPrice = (price: number, isYearly: boolean) => {
    if (price === 0) return "Free"
    const displayPrice = isYearly ? price : Math.round(price / 12)
    return `$${displayPrice}/${isYearly ? 'year' : 'month'}`
  }

  const calculateSavings = (monthlyPrice: number, yearlyPrice: number) => {
    const monthlyTotal = monthlyPrice * 12
    const savings = monthlyTotal - yearlyPrice
    const percentage = Math.round((savings / monthlyTotal) * 100)
    return { savings, percentage }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start free and upgrade as you grow. All plans include secure payments, mobile access, and customer support.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-medium ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <span className={`text-sm font-medium ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Yearly
            </span>
            {isYearly && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Save up to 17%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan) => {
            const savings = calculateSavings(plan.price.monthly, plan.price.yearly)
            
            return (
              <Card 
                key={plan.id} 
                className={`border-2 ${plan.popular ? 'border-blue-500 shadow-xl scale-105' : plan.color} shadow-lg relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`p-3 rounded-full w-fit mx-auto mb-4 ${
                    plan.id === 'free' ? 'bg-gray-100' : 
                    plan.id === 'pro' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    <div className={`${
                      plan.id === 'free' ? 'text-gray-600' : 
                      plan.id === 'pro' ? 'text-blue-600' : 'text-purple-600'
                    }`}>
                      {plan.icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="text-center">
                  <div className="mb-6">
                    <div className="text-4xl font-bold mb-2">
                      {formatPrice(plan.price.monthly, isYearly)}
                    </div>
                    {isYearly && plan.price.yearly > 0 && (
                      <div className="text-sm text-green-600">
                        Save ${savings.savings}/year ({savings.percentage}% off)
                      </div>
                    )}
                    {plan.price.monthly > 0 && (
                      <div className="text-sm text-muted-foreground">
                        {isYearly ? 'Billed annually' : 'Billed monthly'}
                      </div>
                    )}
                  </div>

                  <Button 
                    className={`w-full mb-6 ${plan.buttonColor} text-white`}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {plan.price.monthly === 0 ? 'Get Started Free' : 'Choose Plan'}
                  </Button>

                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.limitations.length > 0 && (
                    <div className="mt-6 pt-4 border-t">
                      <div className="text-sm text-muted-foreground mb-2">Limitations:</div>
                      <div className="space-y-1">
                        {plan.limitations.map((limitation, index) => (
                          <div key={index} className="text-xs text-muted-foreground">
                            • {limitation}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Feature Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Compare Features</h2>
          
          <div className="space-y-8">
            {features.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Feature</th>
                          <th className="text-center py-3 px-4 font-medium">Free</th>
                          <th className="text-center py-3 px-4 font-medium">Pro</th>
                          <th className="text-center py-3 px-4 font-medium">Enterprise</th>
                        </tr>
                      </thead>
                      <tbody>
                        {category.items.map((item, itemIndex) => (
                          <tr key={itemIndex} className="border-b last:border-b-0">
                            <td className="py-3 px-4 font-medium">{item.name}</td>
                            <td className="py-3 px-4 text-center">{item.free}</td>
                            <td className="py-3 px-4 text-center">{item.pro}</td>
                            <td className="py-3 px-4 text-center">{item.enterprise}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-muted-foreground text-sm">
                  We accept all major credit cards, debit cards, and digital wallets. Enterprise customers can also pay via bank transfer or invoice.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Is there a free trial?</h3>
                <p className="text-muted-foreground text-sm">
                  Our Free plan is always free with no time limits. For Pro and Enterprise plans, we offer a 14-day free trial with full access to all features.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What happens if I exceed my plan limits?</h3>
                <p className="text-muted-foreground text-sm">
                  We'll notify you when you're approaching your limits. You can upgrade your plan or purchase additional capacity as needed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of renters who trust Leli Rentals for their rental needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => router.push('/signup')}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Start Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => router.push('/contact')}
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                Contact Sales
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}