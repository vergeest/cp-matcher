import type { User, Preference } from "./types"

// Mock database for demonstration
// In a real app, you would use a database like MongoDB, PostgreSQL, etc.
const users: User[] = [
  { username: "user123", fullName: "John Doe" },
  { username: "user456", fullName: "Jane Smith" },
  { username: "user789", fullName: "Bob Johnson" },
  { username: "user101", fullName: "Alice Williams" },
  { username: "user202", fullName: "Charlie Brown" },
]

const preferences: Preference[] = []

export async function getAllUsers(): Promise<User[]> {
  // In a real app, you would fetch users from your database
  return users
}

export async function getUserPreferences(username: string): Promise<string[]> {
  // In a real app, you would fetch preferences from your database
  const userPrefs = preferences.find((p) => p.username === username)
  return userPrefs ? userPrefs.preferences : []
}

export async function saveUserPreferences(username: string, prefs: string[]): Promise<void> {
  // In a real app, you would save preferences to your database
  const existingIndex = preferences.findIndex((p) => p.username === username)

  if (existingIndex >= 0) {
    preferences[existingIndex].preferences = prefs
  } else {
    preferences.push({
      username,
      preferences: prefs,
    })
  }
}

export async function getAllPreferences(): Promise<Preference[]> {
  // In a real app, you would fetch all preferences from your database
  return preferences
}

