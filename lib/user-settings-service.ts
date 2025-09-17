import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore"
import { 
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider,
  sendEmailVerification,
  deleteUser
} from "firebase/auth"
import { db, auth } from "./firebase"

export interface UserSettings {
  uid: string
  profile: {
    name: string
    email: string
    phone?: string
    location?: string
    bio?: string
    website?: string
    avatar?: string
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    marketingEmails: boolean
    bookingUpdates: boolean
    paymentReminders: boolean
    securityAlerts: boolean
  }
  privacy: {
    profileVisibility: "public" | "private"
    showEmail: boolean
    showPhone: boolean
    showLocation: boolean
    allowMessages: boolean
    showOnlineStatus: boolean
  }
  security: {
    twoFactorEnabled: boolean
    lastPasswordChange?: Date
    emailVerified: boolean
  }
  updatedAt: Date
}

export const userSettingsService = {
  // Get user settings
  async getUserSettings(uid: string): Promise<UserSettings | null> {
    try {
      const userRef = doc(db, "userSettings", uid)
      const userSnap = await getDoc(userRef)
      
      if (userSnap.exists()) {
        return userSnap.data() as UserSettings
      }
      
      // Return default settings if no settings exist
      return this.getDefaultSettings(uid)
    } catch (error) {
      console.error("Error fetching user settings:", error)
      throw new Error("Failed to fetch user settings")
    }
  },

  // Save user settings
  async saveUserSettings(uid: string, settings: Partial<UserSettings>): Promise<void> {
    try {
      const userRef = doc(db, "userSettings", uid)
      const updateData = {
        ...settings,
        updatedAt: new Date()
      }
      
      await setDoc(userRef, updateData, { merge: true })
    } catch (error) {
      console.error("Error saving user settings:", error)
      throw new Error("Failed to save user settings")
    }
  },

  // Update profile information
  async updateProfile(uid: string, profileData: Partial<UserSettings['profile']>): Promise<void> {
    try {
      const existingSettings = await this.getUserSettings(uid)
      const mergedProfile = {
        name: existingSettings?.profile.name || "",
        email: existingSettings?.profile.email || "",
        phone: "",
        location: "",
        bio: "",
        website: "",
        avatar: "",
        ...existingSettings?.profile,
        ...profileData
      }
      await this.saveUserSettings(uid, {
        profile: mergedProfile
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      throw new Error("Failed to update profile")
    }
  },

  // Update notification settings
  async updateNotificationSettings(uid: string, notificationSettings: Partial<UserSettings['notifications']>): Promise<void> {
    try {
      const existingSettings = await this.getUserSettings(uid)
      const mergedNotifications = {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        marketingEmails: false,
        bookingUpdates: true,
        paymentReminders: true,
        securityAlerts: true,
        ...existingSettings?.notifications,
        ...notificationSettings
      }
      await this.saveUserSettings(uid, {
        notifications: mergedNotifications
      })
    } catch (error) {
      console.error("Error updating notification settings:", error)
      throw new Error("Failed to update notification settings")
    }
  },

  // Update privacy settings
  async updatePrivacySettings(uid: string, privacySettings: Partial<UserSettings['privacy']>): Promise<void> {
    try {
      const existingSettings = await this.getUserSettings(uid)
      const mergedPrivacy = {
        profileVisibility: "public" as const,
        showEmail: false,
        showPhone: false,
        showLocation: true,
        allowMessages: true,
        showOnlineStatus: true,
        ...existingSettings?.privacy,
        ...privacySettings
      }
      await this.saveUserSettings(uid, {
        privacy: mergedPrivacy
      })
    } catch (error) {
      console.error("Error updating privacy settings:", error)
      throw new Error("Failed to update privacy settings")
    }
  },

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = auth.currentUser
      if (!user || !user.email) {
        throw new Error("No authenticated user found")
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, credential)

      // Update password
      await updatePassword(user, newPassword)

      // Update last password change in settings
      const existingSettings = await this.getUserSettings(user.uid)
      const mergedSecurity = {
        twoFactorEnabled: false,
        emailVerified: user.emailVerified || false,
        ...existingSettings?.security,
        lastPasswordChange: new Date()
      }
      await this.saveUserSettings(user.uid, {
        security: mergedSecurity
      })
    } catch (error: any) {
      console.error("Error changing password:", error)
      
      if (error.code === 'auth/wrong-password') {
        throw new Error("Current password is incorrect")
      } else if (error.code === 'auth/weak-password') {
        throw new Error("New password is too weak")
      } else if (error.code === 'auth/requires-recent-login') {
        throw new Error("Please sign in again before changing your password")
      }
      
      throw new Error("Failed to change password")
    }
  },

  // Send email verification
  async sendEmailVerification(): Promise<void> {
    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error("No authenticated user found")
      }

      await sendEmailVerification(user)
      
      // Update email verification status
      const existingSettings = await this.getUserSettings(user.uid)
      const mergedSecurity = {
        twoFactorEnabled: false,
        emailVerified: user.emailVerified,
        ...existingSettings?.security
      }
      await this.saveUserSettings(user.uid, {
        security: mergedSecurity
      })
    } catch (error) {
      console.error("Error sending email verification:", error)
      throw new Error("Failed to send email verification")
    }
  },

  // Enable/disable two-factor authentication (placeholder for future implementation)
  async updateTwoFactorAuth(enabled: boolean): Promise<void> {
    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error("No authenticated user found")
      }

      const existingSettings = await this.getUserSettings(user.uid)
      const mergedSecurity = {
        twoFactorEnabled: enabled,
        emailVerified: false,
        ...existingSettings?.security
      }
      await this.saveUserSettings(user.uid, {
        security: mergedSecurity
      })
    } catch (error) {
      console.error("Error updating two-factor authentication:", error)
      throw new Error("Failed to update two-factor authentication")
    }
  },

  // Delete user account
  async deleteUserAccount(currentPassword: string): Promise<void> {
    try {
      const user = auth.currentUser
      if (!user || !user.email) {
        throw new Error("No authenticated user found")
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, credential)

      // Delete user data from Firestore
      await this.deleteUserData(user.uid)

      // Delete user from Firebase Auth
      await deleteUser(user)
    } catch (error: any) {
      console.error("Error deleting user account:", error)
      
      if (error.code === 'auth/wrong-password') {
        throw new Error("Password is incorrect")
      } else if (error.code === 'auth/requires-recent-login') {
        throw new Error("Please sign in again before deleting your account")
      }
      
      throw new Error("Failed to delete account")
    }
  },

  // Delete all user data from Firestore
  async deleteUserData(uid: string): Promise<void> {
    try {
      // Delete user settings
      const settingsRef = doc(db, "userSettings", uid)
      await deleteDoc(settingsRef)

      // Delete user profile
      const profileRef = doc(db, "userProfiles", uid)
      await deleteDoc(profileRef)

      // Delete user listings
      const listingsQuery = query(collection(db, "listings"), where("ownerId", "==", uid))
      const listingsSnapshot = await getDocs(listingsQuery)
      const deletePromises = listingsSnapshot.docs.map(doc => deleteDoc(doc.ref))
      await Promise.all(deletePromises)

      // Delete user bookings
      const bookingsQuery = query(collection(db, "bookings"), where("userId", "==", uid))
      const bookingsSnapshot = await getDocs(bookingsQuery)
      const deleteBookingPromises = bookingsSnapshot.docs.map(doc => deleteDoc(doc.ref))
      await Promise.all(deleteBookingPromises)

      // Delete user favorites
      const favoritesQuery = query(collection(db, "favorites"), where("userId", "==", uid))
      const favoritesSnapshot = await getDocs(favoritesQuery)
      const deleteFavoritesPromises = favoritesSnapshot.docs.map(doc => deleteDoc(doc.ref))
      await Promise.all(deleteFavoritesPromises)
    } catch (error) {
      console.error("Error deleting user data:", error)
      throw new Error("Failed to delete user data")
    }
  },

  // Get default settings for new users
  getDefaultSettings(uid: string): UserSettings {
    const user = auth.currentUser
    return {
      uid,
      profile: {
        name: user?.displayName || "",
        email: user?.email || "",
        phone: "",
        location: "",
        bio: "",
        website: "",
        avatar: user?.photoURL || ""
      },
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        marketingEmails: false,
        bookingUpdates: true,
        paymentReminders: true,
        securityAlerts: true
      },
      privacy: {
        profileVisibility: "public",
        showEmail: false,
        showPhone: false,
        showLocation: true,
        allowMessages: true,
        showOnlineStatus: true
      },
      security: {
        twoFactorEnabled: false,
        lastPasswordChange: undefined,
        emailVerified: user?.emailVerified || false
      },
      updatedAt: new Date()
    }
  }
}
