"use client"

import type React from "react"
import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  CreditCard, Plus, Trash2, Edit, Download, Eye, Calendar, DollarSign, 
  CheckCircle, AlertCircle, Clock, CreditCard as CardIcon, Banknote, 
  Receipt, TrendingUp, Shield, Zap, Star, Crown, Users, Check
} from "lucide-react"
import { useAuthContext } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import PaymentModal from "@/components/payment-modal"

// Mock payment methods
const mockPaymentMethods = [
  {
    id: "pm_1",
    type: "card",
    last4: "4242",
    brand: "visa",
    expiryMonth: "12",
    expiryYear: "2025",
    isDefault: true,
  },
  {
    id: "pm_2", 
    type: "card",
    last4: "5555",
    brand: "mastercard",
    expiryMonth: "08",
    expiryYear: "2026",
    isDefault: false,
  },
]

// Mock transactions
const mockTransactions = [
  {
    id: "tx_1",
    amount: 340.00,
    description: "Tesla Model 3 Rental - Dec 15-18, 2024",
    date: "2024-12-15",
    status: "completed",
    type: "payment",
    method: "visa_4242",
  },
  {
    id: "tx_2",
    amount: 720.00,
    description: "Modern Downtown Apartment - Nov 20-25, 2024",
    date: "2024-11-20",
    status: "completed",
    type: "payment",
    method: "mastercard_5555",
  },
  {
    id: "tx_3",
    amount: 135.00,
    description: "Professional Camera Kit - Jan 10-12, 2025",
    date: "2025-01-10",
    status: "pending",
    type: "payment",
    method: "visa_4242",
  },
  {
    id: "tx_4",
    amount: 25.00,
    description: "Service Fee",
    date: "2024-12-01",
    status: "completed",
    type: "fee",
    method: "visa_4242",
  },
]

// Mock subscription
const mockSubscription = {
  plan: "Pro",
  status: "active",
  nextBilling: "2025-01-15",
  amount: 29.99,
  features: [
    "Unlimited listings",
    "Priority support",
    "Advanced analytics",
    "Custom branding",
  ],
}

// Pricing plans
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
      monthly: 2900,
      yearly: 29000,
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
      monthly: 9900,
      yearly: 99000,
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

export default function BillingPage() {
  const { user } = useAuthContext()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [isAddingPayment, setIsAddingPayment] = useState(false)
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
    zipCode: "",
  })
  const [isYearly, setIsYearly] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<any>(null)

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAddingPayment(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Payment method added!",
        description: "Your new payment method has been added successfully.",
      })
      
      setIsAddingPayment(false)
      setNewPaymentMethod({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        name: "",
        zipCode: "",
      })
    } catch (error) {
      toast({
        title: "Error adding payment method",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
      setIsAddingPayment(false)
    }
  }

  const handleSetDefault = async (paymentMethodId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Default payment method updated",
        description: "Your default payment method has been changed.",
      })
    } catch (error) {
      toast({
        title: "Error updating payment method",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Payment method deleted",
        description: "The payment method has been removed from your account.",
      })
    } catch (error) {
      toast({
        title: "Error deleting payment method",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSelectPlan = async (planId: string) => {
    const plan = pricingPlans.find(p => p.id === planId)
    if (!plan) return

    // If it's a free plan, activate it directly
    if (plan.price.monthly === 0) {
      try {
        // Simulate API call for free plan activation
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        toast({
          title: "Free plan activated!",
          description: "Your free subscription has been activated. You can upgrade anytime.",
        })
      } catch (error) {
        toast({
          title: "Error activating plan",
          description: "Please try again or contact support.",
          variant: "destructive",
        })
      }
    } else {
      // For paid plans, show payment modal
      setSelectedPlanForPayment({
        ...plan,
        price: isYearly ? plan.price.yearly : plan.price.monthly,
        currency: 'KSh',
        description: `${plan.description} - ${isYearly ? 'Annual' : 'Monthly'} billing`
      })
      setShowPaymentModal(true)
    }
  }

  const formatPrice = (price: number, isYearly: boolean) => {
    if (price === 0) return "Free"
    const displayPrice = isYearly ? price : Math.round(price / 12)
    return `KSh ${displayPrice.toLocaleString()}/${isYearly ? 'year' : 'month'}`
  }

  const calculateSavings = (monthlyPrice: number, yearlyPrice: number) => {
    const monthlyTotal = monthlyPrice * 12
    const savings = monthlyTotal - yearlyPrice
    const percentage = Math.round((savings / monthlyTotal) * 100)
    return { savings, percentage }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Billing & Payments
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your payment methods, view transactions, and subscription details
              </p>
            </div>
            <Button 
              onClick={() => router.back()}
              variant="outline"
            >
              Back to Profile
            </Button>
          </div>
        </div>

        {/* Subscription Overview */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-white to-blue-50/30 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Zap className="h-5 w-5 text-purple-600" />
              Current Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                    {mockSubscription.plan} Plan
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  ${mockSubscription.amount}/month
                </div>
                <div className="text-sm text-muted-foreground">
                  Next billing: {new Date(mockSubscription.nextBilling).toLocaleDateString()}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Plan Features:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {mockSubscription.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg border-0 rounded-xl p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg">
              <TrendingUp className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg">
              <CreditCard className="h-4 w-4 mr-2" />
              Payment Methods
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg">
              <Receipt className="h-4 w-4 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="pricing" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg">
              <Star className="h-4 w-4 mr-2" />
              Plans & Pricing
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">$1,195.00</div>
                      <div className="text-sm text-muted-foreground">Total Spent</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    This month: $340.00
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">2</div>
                      <div className="text-sm text-muted-foreground">Payment Methods</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    1 default method
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Receipt className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">4</div>
                      <div className="text-sm text-muted-foreground">Transactions</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    This month: 1
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Recent Activity</CardTitle>
                <CardDescription>Your latest billing activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTransactions.slice(0, 3).map((transaction) => (
                    <div key={transaction.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      {getStatusIcon(transaction.status)}
                      <div className="flex-1">
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${transaction.amount.toFixed(2)}</div>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payments" className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Payment Methods</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Payment Method</DialogTitle>
                    <DialogDescription>
                      Add a new credit or debit card to your account
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleAddPaymentMethod} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={newPaymentMethod.cardNumber}
                          onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, cardNumber: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={newPaymentMethod.expiryDate}
                          onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, expiryDate: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={newPaymentMethod.cvv}
                          onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, cvv: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="name">Cardholder Name</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={newPaymentMethod.name}
                          onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          placeholder="12345"
                          value={newPaymentMethod.zipCode}
                          onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, zipCode: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="outline" onClick={() => setIsAddingPayment(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isAddingPayment} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        {isAddingPayment ? "Adding..." : "Add Payment Method"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockPaymentMethods.map((method) => (
                <Card key={method.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <CardIcon className="h-8 w-8 text-blue-600" />
                        <div>
                          <div className="font-semibold capitalize">{method.brand} •••• {method.last4}</div>
                          <div className="text-sm text-muted-foreground">
                            Expires {method.expiryMonth}/{method.expiryYear}
                          </div>
                        </div>
                      </div>
                      {method.isDefault && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Default
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {!method.isDefault && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSetDefault(method.id)}
                        >
                          Set Default
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Payment Method</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this payment method? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeletePaymentMethod(method.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Transaction History</h2>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="space-y-0">
                  {mockTransactions.map((transaction, index) => (
                    <div key={transaction.id}>
                      <div className="flex items-center gap-4 p-6 hover:bg-gray-50 transition-colors">
                        {getStatusIcon(transaction.status)}
                        <div className="flex-1">
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()} • {transaction.method}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {transaction.type === 'fee' ? '-' : ''}${transaction.amount.toFixed(2)}
                          </div>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                      {index < mockTransactions.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6 mt-6">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Choose Your Plan
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Upgrade or downgrade your plan anytime. All plans include secure payments and customer support.
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                            Save KSh {savings.savings.toLocaleString()}/year ({savings.percentage}% off)
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

            {/* FAQ Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">Can I change plans anytime?</h4>
                    <p className="text-muted-foreground text-sm">
                      Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
                    <p className="text-muted-foreground text-sm">
                      We accept M-Pesa, Airtel Money, all major credit/debit cards, and bank transfers. All payments are processed securely with real-time confirmation.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">Is there a free trial?</h4>
                    <p className="text-muted-foreground text-sm">
                      Our Free plan is always free with no time limits. For Pro and Enterprise plans, we offer a 14-day free trial with full access to all features.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">What happens if I exceed my plan limits?</h4>
                    <p className="text-muted-foreground text-sm">
                      We'll notify you when you're approaching your limits. You can upgrade your plan or purchase additional capacity as needed.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Payment Modal */}
        {selectedPlanForPayment && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => {
              setShowPaymentModal(false)
              setSelectedPlanForPayment(null)
            }}
            plan={selectedPlanForPayment}
          />
        )}
      </div>
    </div>
  )
}