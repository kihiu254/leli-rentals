// Mock firebase-admin exports for client-side compatibility
// This file provides mock implementations to prevent import errors

export const auth = {
  verifyIdToken: () => Promise.resolve({ uid: 'mock-user' }),
  getUser: () => Promise.resolve({ uid: 'mock-user' }),
  createUser: () => Promise.resolve({ uid: 'mock-user' }),
  updateUser: () => Promise.resolve({ uid: 'mock-user' }),
  deleteUser: () => Promise.resolve(),
}

export const db = {
  collection: () => ({
    doc: () => ({
      get: () => Promise.resolve({ exists: false, data: () => null }),
      set: () => Promise.resolve(),
      update: () => Promise.resolve(),
      delete: () => Promise.resolve(),
    }),
    add: () => Promise.resolve({ id: 'mock-doc-id' }),
    where: () => ({
      get: () => Promise.resolve({ docs: [] }),
    }),
  }),
}

export default {
  auth,
  db,
}
