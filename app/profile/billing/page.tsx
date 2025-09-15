"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, Download, Plus, Calendar } from "lucide-react"
import Link from "next/link"

// Mock billing data
const mockPaymentMethods = [
  {
    id: "pm-1",
    type: "card",
    brand: "visa",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
  },
  {
    id: "pm-2",
    type: "card",
    brand: "mastercard",
    last4: "8888",
    expiryMonth: 8,
    expiryYear: 2026,
    isDefault: false,
  },
]

const mockTransactions = [
  {
    id: "txn-1",
    date: "2024-12-15",
    description: "Tesla Model 3 Rental",
    amount: 340,
    status: "completed",
    type: "payment",
  },
  {
    id: "txn-2",
    date: "2024-12-10",
    description: "Payout - Camera Equipment",
    amount: 105,
    status: "completed",
    type: "payout",
  },
  {
    id: "txn-3",
    date: "2024-11-28",
    description: "Downtown Apartment Rental",
    amount: 720,
    status: "completed",
    type: "payment",
  },
  {
    id: "txn-4",
    date: "2024-11-20",
    description: "Payout - Mountain Bike",
    amount: 75,
    status: "completed",
    type: "payout",
  },
]

const getCardBrandIcon = (brand: string) => {
  switch (brand) {
    case "visa":
      return "💳"
    case "mastercard":
      return "💳"
    case "amex":
      return "💳"
    default:
      return "💳"
  }
}

const getTransactionColor = (type: string) => {
  return type === "payment" ? "text-red-600" : "text-green-600"
}

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/profile">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Billing & Payments</h1>
        </div>

        <div className="space-y-8">
          {/* Payment Methods */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Methods
                  </CardTitle>
                  <CardDescription>Manage your saved payment methods</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Card
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockPaymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getCardBrandIcon(method.brand)}</div>
                    <div>
                      <div className="font-medium">
                        {method.brand.toUpperCase()} •••• {method.last4}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {method.isDefault && <Badge variant="secondary">Default</Badge>}
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Account Balance */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Account Balance</CardTitle>
              <CardDescription>Your current balance and earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">$1,247.50</div>
                  <div className="text-sm text-muted-foreground">Available Balance</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">$340.00</div>
                  <div className="text-sm text-muted-foreground">Pending Payouts</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">$2,890.75</div>
                  <div className="text-sm text-muted-foreground">Total Earnings</div>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button>Withdraw Funds</Button>
                <Button variant="outline">Set Auto-Payout</Button>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>Your recent payments and payouts</CardDescription>
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-muted-foreground">{transaction.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === "payment" ? "-" : "+"}${transaction.amount}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tax Information */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Tax Information</CardTitle>
              <CardDescription>Manage your tax documents and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Download 2024 Tax Summary
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Update Tax Information
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                View Tax Documents
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
