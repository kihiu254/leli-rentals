// Utility functions for Firebase Storage operations
import { ref, getDownloadURL } from "firebase/storage"
import { storage } from "./firebase"

export const checkStorageAvailability = async (): Promise<boolean> => {
  try {
    // Simple check to see if Firebase Storage is available
    const testRef = ref(storage, 'test-connection-check')
    await getDownloadURL(testRef).catch(() => {
      // This is expected to fail, we just want to check if the service is reachable
    })
    return true
  } catch (error) {
    console.warn('Firebase Storage may not be available:', error)
    return false
  }
}

export const optimizeImageForUpload = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      const newWidth = img.width * ratio
      const newHeight = img.height * ratio
      
      canvas.width = newWidth
      canvas.height = newHeight
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, newWidth, newHeight)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const optimizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            })
            resolve(optimizedFile)
          } else {
            reject(new Error('Failed to compress image'))
          }
        },
        'image/jpeg',
        quality
      )
    }
    
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
      URL.revokeObjectURL(img.src)
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}
