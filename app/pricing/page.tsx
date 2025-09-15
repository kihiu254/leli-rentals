import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, Star, Zap, Crown, Building2, ArrowRight, Shield, Headphones, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "Forever",
      description: "Perfect for occasional renters",
      icon: Star,
      popular: false,
      features: [
        { name: "Browse all listings", included: true },
        { name: "Basic search filters", included: true },
        { name: "Contact property owners", included: true },
        { name: "Up to 3 bookings per month", included: true },
        { name: "Email support", included: true },
        { name: "Advanced filters", included: false },
        { name: "Priority booking", included: false },
        { name: "24/7 phone support", included: false },
        { name: "Booking protection", included: false },
        { name: "Host dashboard", included: false },
      ],
      cta: "Get Started Free",
      href: "/signup",
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      description: "For frequent renters and casual hosts",
      icon: Zap,
      popular: true,
      features: [
        { name: "Browse all listings", included: true },
        { name: "Basic search filters", included: true },
        { name: "Contact property owners", included: true },
        { name: "Unlimited bookings", included: true },
        { name: "Email support", included: true },
        { name: "Advanced filters", included: true },
        { name: "Priority booking", included: true },
        { name: "24/7 phone support", included: true },
        { name: "Booking protection", included: true },
        { name: "Host dashboard", included: false },
      ],
      cta: "Start Pro Trial",
      href: "/signup?plan=pro",
    },
    {
      name: "Business",
      price: "$49",
      period: "per month",
      description: "For professional hosts and property managers",
      icon: Crown,
      popular: false,
      features: [
        { name: "Browse all listings", included: true },
        { name: "Basic search filters", included: true },
        { name: "Contact property owners", included: true },
        { name: "Unlimited bookings", included: true },
        { name: "Email support", included: true },
        { name: "Advanced filters", included: true },
        { name: "Priority booking", included: true },
        { name: "24/7 phone support", included: true },
        { name: "Booking protection", included: true },
        { name: "Host dashboard", included: true },
      ],
      cta: "Start Business Trial",
      href: "/signup?plan=business",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "Contact us",
      description: "For large organizations and property management companies",
      icon: Building2,
      popular: false,
      features: [
        { name: "Browse all listings", included: true },
        { name: "Basic search filters", included: true },
        { name: "Contact property owners", included: true },
        { name: "Unlimited bookings", included: true },
        { name: "Email support", included: true },
        { name: "Advanced filters", included: true },
        { name: "Priority booking", included: true },
        { name: "24/7 phone support", included: true },
        { name: "Booking protection", included: true },
        { name: "Host dashboard", included: true },
      ],
      cta: "Contact Sales",
      href: "/contact?subject=enterprise",
    },
  ]

  const faqs = [
    {
      question: "Can I change my plan at any time?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges or credits.",
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes! Pro and Business plans come with a 14-day free trial. No credit card required to start your trial.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for Enterprise plans.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll refund your payment in full.",
    },
    {
      question: "How does booking protection work?",
      answer:
        "Our booking protection covers you against property damage, cancellations, and other issues. Claims are processed within 24-48 hours.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Absolutely. You can cancel your subscription at any time from your account settings. Your plan will remain active until the end of your billing period.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-muted/20">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 px-4 py-2 bg-primary/10 text-primary border-primary/20">
              <TrendingUp className="w-4 h-4 mr-2" />
              Transparent Pricing
            </Badge>
            <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-8 text-balance">
              Choose Your Perfect
              <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {" "}
                Plan
              </span>
            </h1>
            <p className="text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
              From casual renters to professional hosts, we have a plan that fits your needs. Start free and upgrade as
              you grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg font-semibold rounded-xl bg-transparent">
                Compare Plans
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => {
              const IconComponent = plan.icon
              return (
                <Card
                  key={index}
                  className={`relative border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                    plan.popular
                      ? "border-primary bg-gradient-to-br from-primary/5 to-background scale-105"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1 font-semibold">Most Popular</Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-card-foreground">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      {plan.price !== "Free" && plan.price !== "Custom" && (
                        <span className="text-muted-foreground ml-1">/{plan.period.split(" ")[1]}</span>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">{plan.period}</p>
                    </div>
                    <p className="text-muted-foreground mt-4">{plan.description}</p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          )}
                          <span className={`text-sm ${feature.included ? "text-foreground" : "text-muted-foreground"}`}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-6">
                      <Button
                        asChild
                        className={`w-full py-3 font-semibold rounded-xl transition-all ${
                          plan.popular
                            ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                            : "bg-muted hover:bg-muted/80 text-foreground hover:bg-primary hover:text-primary-foreground"
                        }`}
                      >
                        <Link href={plan.href}>{plan.cta}</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose Leli Rentals?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform offers industry-leading features to make your rental experience seamless and secure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-border bg-card hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-4">Secure Payments</h3>
                <p className="text-muted-foreground">
                  All transactions are protected with bank-level encryption and fraud detection.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Headphones className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-4">24/7 Support</h3>
                <p className="text-muted-foreground">
                  Our dedicated support team is available around the clock to help you.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-4">Smart Analytics</h3>
                <p className="text-muted-foreground">
                  Get insights into your rental performance with detailed analytics and reporting.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Got questions? We've got answers. If you can't find what you're looking for, contact our support team.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-border bg-card">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-card-foreground mb-4">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users who trust Leli Rentals for all their rental needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="px-8 py-4 text-lg font-semibold rounded-xl bg-transparent"
            >
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
