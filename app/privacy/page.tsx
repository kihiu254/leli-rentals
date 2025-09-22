import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Eye, Lock, Database, Users, AlertCircle } from "lucide-react"

export default function PrivacyPage() {
  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: `We collect information you provide directly, usage data, and information from third parties to provide and improve our services.`
    },
    {
      icon: Lock,
      title: "How We Use Your Data",
      content: `Your data helps us provide services, communicate with you, ensure security, and comply with legal obligations.`
    },
    {
      icon: Database,
      title: "Data Storage & Security",
      content: `We implement appropriate security measures to protect your personal information against unauthorized access or disclosure.`
    },
    {
      icon: Users,
      title: "Information Sharing",
      content: `We may share your information with service providers, for legal reasons, or with your consent. We never sell your data.`
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
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
                At Leli Rentals, we are committed to protecting your privacy and ensuring the security of your personal information.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-foreground mb-3">Personal Information</h3>
              <p className="mb-4">We collect personal information that you provide to us, including:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Name, email address, and phone number</li>
                <li>Billing and payment information</li>
                <li>Profile information and preferences</li>
                <li>Identification documents for verification</li>
                <li>Communications with us or other users</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-3">Usage Information</h3>
              <p className="mb-4">We automatically collect certain information when you use our platform:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Device information and browser type</li>
                <li>IP address and location data</li>
                <li>Pages visited and time spent on our platform</li>
                <li>Search queries and browsing behavior</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-3">Information from Third Parties</h3>
              <p className="mb-8">
                We may receive information from third-party services, such as payment processors, social media platforms,
                or background check services, to verify your identity and improve our services.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect for the following purposes:</p>
              <ul className="list-disc pl-6 mb-8 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Verify your identity and prevent fraud</li>
                <li>Communicate with you about our services</li>
                <li>Personalize your experience and provide recommendations</li>
                <li>Conduct research and analytics to improve our platform</li>
                <li>Comply with legal obligations and enforce our terms</li>
                <li>Send marketing communications (with your consent)</li>
              </ul>

              <h2 className="text-2xl font-bold text-foreground mb-4">3. Information Sharing and Disclosure</h2>
              <p className="mb-4">We may share your information in the following circumstances:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li><strong>With other users:</strong> Basic profile information is visible to facilitate rentals</li>
                <li><strong>With service providers:</strong> Third parties who help us operate our platform</li>
                <li><strong>For legal reasons:</strong> When required by law or to protect our rights</li>
                <li><strong>With your consent:</strong> When you explicitly agree to sharing</li>
                <li><strong>Business transfers:</strong> In connection with a merger or sale of our company</li>
              </ul>
              <p className="mb-8">
                We do not sell your personal information to third parties for their marketing purposes.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-4">4. Data Security</h2>
              <p className="mb-8">
                We implement appropriate technical and organizational measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction. These measures include encryption, access controls,
                and regular security assessments. However, no method of transmission over the internet is 100% secure.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-4">5. Data Retention</h2>
              <p className="mb-8">
                We retain your personal information for as long as necessary to provide our services, comply with legal obligations,
                resolve disputes, and enforce our agreements. When we no longer need your information, we securely delete or anonymize it.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-4">6. Cookies and Tracking Technologies</h2>
              <p className="mb-4">We use cookies and similar technologies to:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Remember your preferences and settings</li>
                <li>Analyze site traffic and usage patterns</li>
                <li>Provide personalized content and recommendations</li>
                <li>Ensure platform security and prevent fraud</li>
              </ul>
              <p className="mb-8">
                You can control cookie settings through your browser preferences. Please see our Cookie Policy for more details.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-4">7. Your Rights and Choices</h2>
              <p className="mb-4">Depending on your location, you may have the following rights:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Receive your data in a structured format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Restriction:</strong> Limit how we process your information</li>
              </ul>
              <p className="mb-8">
                To exercise these rights, please contact us using the information provided below.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-4">8. International Data Transfers</h2>
              <p className="mb-8">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate
                safeguards are in place to protect your information during such transfers.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-4">9. Children's Privacy</h2>
              <p className="mb-8">
                Our services are not intended for children under 18. We do not knowingly collect personal information from
                children under 18. If we become aware that we have collected such information, we will delete it immediately.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-4">10. Changes to This Policy</h2>
              <p className="mb-8">
                We may update this Privacy Policy from time to time. We will notify you of material changes by email or
                through our platform. Your continued use of our services after such changes constitutes acceptance of the updated policy.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-4">11. Contact Us</h2>
              <p className="mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <ul className="list-disc pl-6 mb-8 space-y-2">
                <li>Email: lelirentalsmail@gmail.com</li>
                <li>Phone: +254112081866</li>
                <li>Address: 123 Rental Street, Nairobi, Kenya 00100</li>
              </ul>
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
