import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Shield, Users, AlertTriangle } from "lucide-react"

export default function TermsPage() {
  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      content: `By accessing and using Leli Rentals, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`
    },
    {
      icon: Users,
      title: "User Accounts",
      content: `You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.`
    },
    {
      icon: Shield,
      title: "Platform Usage",
      content: `You agree to use the platform only for lawful purposes and in accordance with these terms. You may not use the platform to transmit any harmful or illegal content, or to violate any laws or regulations.`
    },
    {
      icon: AlertTriangle,
      title: "Liability & Disclaimers",
      content: `Leli Rentals acts as a marketplace connecting renters and owners. We are not responsible for the quality, safety, or legality of items rented through our platform. Users are responsible for their own interactions and transactions.`
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <FileText className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
              Please read these terms carefully before using Leli Rentals platform.
            </p>
            <p className="text-sm text-muted-foreground">Last updated: January 2025</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none text-muted-foreground mb-12">
              <p className="text-lg leading-relaxed mb-8">
                Welcome to Leli Rentals. These Terms of Service ("Terms") govern your use of our website, mobile application,
                and related services (collectively, the "Service"). By accessing or using our Service, you agree to be bound
                by these Terms. If you disagree with any part of these terms, then you may not access the Service.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-4">1. Definitions</h2>
              <ul className="list-disc pl-6 mb-8 space-y-2">
                <li><strong>"Platform"</strong> refers to the Leli Rentals website and mobile application.</li>
                <li><strong>"User"</strong> refers to any individual who accesses or uses our Service.</li>
                <li><strong>"Owner"</strong> refers to users who list items for rent on the platform.</li>
                <li><strong>"Renter"</strong> refers to users who rent items through the platform.</li>
                <li><strong>"Content"</strong> refers to text, images, videos, and other materials posted by users.</li>
              </ul>

              <h2 className="text-2xl font-bold text-foreground mb-4">2. User Eligibility</h2>
              <p className="mb-8">
                To use our Service, you must be at least 18 years old and have the legal capacity to enter into binding agreements.
                By using our Service, you represent and warrant that you meet these requirements.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-4">3. Account Registration</h2>
              <p className="mb-8">
                You must register for an account to access certain features of our Service. When you register, you agree to:
              </p>
              <ul className="list-disc pl-6 mb-8 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your password</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>

              <h2 className="text-2xl font-bold text-foreground mb-4">4. Rental Transactions</h2>
              <p className="mb-8">
                Leli Rentals facilitates rental transactions between Owners and Renters. We are not a party to these transactions
                and do not guarantee the quality, safety, or condition of rented items. Users are responsible for:
              </p>
              <ul className="list-disc pl-6 mb-8 space-y-2">
                <li>Complying with all applicable laws and regulations</li>
                <li>Inspecting items before and after rental</li>
                <li>Resolving disputes directly with other users</li>
                <li>Maintaining appropriate insurance coverage</li>
              </ul>

              <h2 className="text-2xl font-bold text-foreground mb-4">5. Prohibited Activities</h2>
              <p className="mb-8">
                You agree not to engage in any of the following prohibited activities:
              </p>
              <ul className="list-disc pl-6 mb-8 space-y-2">
                <li>Violating any applicable laws or regulations</li>
                <li>Posting false, misleading, or fraudulent content</li>
                <li>Harassing, threatening, or abusing other users</li>
                <li>Attempting to gain unauthorized access to our systems</li>
                <li>Using the platform for commercial purposes without permission</li>
                <li>Interfering with the proper functioning of the platform</li>
              </ul>

              <h2 className="text-2xl font-bold text-foreground mb-4">6. Content and Intellectual Property</h2>
              <p className="mb-8">
                By posting content on our platform, you grant us a non-exclusive, royalty-free license to use, display,
                and distribute your content in connection with our Service. You retain ownership of your content and are
                responsible for ensuring you have the right to post it.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-4">7. Privacy</h2>
              <p className="mb-8">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service,
                to understand our practices regarding the collection and use of your personal information.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-4">8. Termination</h2>
              <p className="mb-8">
                We may terminate or suspend your account and access to the Service immediately, without prior notice or liability,
                for any reason, including breach of these Terms. Upon termination, your right to use the Service will cease immediately.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-4">9. Limitation of Liability</h2>
              <p className="mb-8">
                In no event shall Leli Rentals, its directors, employees, or agents be liable for any indirect, incidental,
                special, consequential, or punitive damages arising out of or related to your use of the Service.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-4">10. Governing Law</h2>
              <p className="mb-8">
                These Terms shall be interpreted and governed by the laws of Kenya, without regard to conflict of law provisions.
                Any disputes arising from these Terms shall be resolved in the courts of Kenya.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-4">11. Changes to Terms</h2>
              <p className="mb-8">
                We reserve the right to modify these Terms at any time. We will notify users of material changes via email
                or through our platform. Your continued use of the Service after such modifications constitutes acceptance
                of the updated Terms.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-4">12. Contact Information</h2>
              <p className="mb-8">
                If you have any questions about these Terms, please contact us at lelirentalsmail@gmail.com or through our support channels.
              </p>
            </div>

            {/* Key Points Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sections.map((section, index) => (
                <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <section.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{section.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{section.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
