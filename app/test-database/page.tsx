'use client'

import { useState, useEffect } from 'react'
import { useAuthContext } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Database, 
  Shield,
  Users,
  Home,
  Calendar
} from 'lucide-react'

export default function TestDatabasePage() {
  const { user, isLoading: authLoading } = useAuthContext()
  const [testResults, setTestResults] = useState<{
    auth: boolean
    database: boolean
    api: boolean
  }>({
    auth: false,
    database: false,
    api: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Test database connection
  const testDatabaseConnection = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Test API endpoint
      const response = await fetch('/api/test-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setTestResults({
          auth: !!user,
          database: data.connected,
          api: true
        })
      } else {
        throw new Error('API test failed')
      }
    } catch (err: any) {
      setError(err.message)
      setTestResults({
        auth: !!user,
        database: false,
        api: false
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    )
  }

  const getStatusBadge = (status: boolean, loading: boolean) => {
    if (loading) {
      return <Badge variant="secondary"><Loader2 className="h-4 w-4 mr-1 animate-spin" />Testing</Badge>
    }
    return status ? (
      <Badge variant="default" className="bg-green-500">Success</Badge>
    ) : (
      <Badge variant="destructive">Failed</Badge>
    )
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p>Loading authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Database Connection Test
          </h1>
          <p className="text-muted-foreground">
            Testing Firebase Authentication + PostgreSQL + API Integration
          </p>
        </div>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Integration Test Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {getStatusIcon(testResults.auth)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Firebase Auth</span>
                    {getStatusBadge(testResults.auth, false)}
                  </div>
                  {user && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Logged in as: {user.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {getStatusIcon(testResults.api)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">API Routes</span>
                    {getStatusBadge(testResults.api, false)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {getStatusIcon(testResults.database)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">PostgreSQL</span>
                    {getStatusBadge(testResults.database, false)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={testDatabaseConnection}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Run Database Tests'
                )}
              </Button>

              {!user && (
                <Button 
                  onClick={() => window.location.href = '/login'}
                  variant="outline"
                >
                  Sign In to Test
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Information */}
        {user && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Current User (Firebase)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-lg">{user.displayName || 'No name'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-lg">{user.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">UID</Label>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded">{user.uid}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email Verified</Label>
                  <Badge variant={user.emailVerified ? "default" : "destructive"}>
                    {user.emailVerified ? 'Verified' : 'Not Verified'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Setup Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">1. Set up PostgreSQL Database</h3>
              <p className="text-sm text-muted-foreground">
                Go to your Neon dashboard and run the database schema
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">2. Configure Environment Variables</h3>
              <p className="text-sm text-muted-foreground">
                Create .env.local file with your Neon database credentials
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">3. Install Dependencies</h3>
              <p className="text-sm text-muted-foreground">
                Run: <code className="bg-gray-100 px-2 py-1 rounded">npm install @apollo/client graphql pg</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Add Label component if not available
function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={`text-sm font-medium ${className}`}>{children}</label>
}
