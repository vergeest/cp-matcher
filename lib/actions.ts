"use server"

import { revalidatePath } from "next/cache"
import prisma from "./prisma"
import { requireAuth } from "./auth"

// Save user preferences
export async function savePreferences(formData: FormData) {
  const user = await requireAuth()

  try {
    // Get preferences from form data
    const preferences = formData.getAll("preferences") as string[]

    // Start a transaction
    await prisma.$transaction(async (tx) => {
      // Delete existing preferences
      await tx.preference.deleteMany({
        where: { userId: user.id },
      })

      // Create new preferences
      for (let i = 0; i < preferences.length; i++) {
        const selectedId = preferences[i]
        if (selectedId) {
          await tx.preference.create({
            data: {
              userId: user.id,
              selectedId,
              rank: i + 1,
            },
          })
        }
      }
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error saving preferences:", error)
    return { success: false, error: "Failed to save preferences" }
  }
}

// Run matching algorithm
export async function runMatching() {
  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: { id: true },
    })

    // Get all preferences
    const preferences = await prisma.preference.findMany({
      select: {
        userId: true,
        selectedId: true,
        rank: true,
      },
    })

    // Clear existing matches
    await prisma.match.deleteMany()

    // Create a map of user preferences
    const userPreferences = new Map<string, Map<string, number>>()

    for (const pref of preferences) {
      if (!userPreferences.has(pref.userId)) {
        userPreferences.set(pref.userId, new Map())
      }
      userPreferences.get(pref.userId)!.set(pref.selectedId, pref.rank)
    }

    // Calculate matches
    const matches = []
    const processedUsers = new Set<string>()

    for (const user1 of users) {
      if (processedUsers.has(user1.id)) continue

      const user1Prefs = userPreferences.get(user1.id) || new Map()

      for (const user2 of users) {
        // Skip self or already processed users
        if (user1.id === user2.id || processedUsers.has(user2.id)) continue

        const user2Prefs = userPreferences.get(user2.id) || new Map()

        // Check if they have mutual preferences
        if (user1Prefs.has(user2.id) && user2Prefs.has(user1.id)) {
          // Calculate match score (lower rank = higher preference)
          const user1Rank = user1Prefs.get(user2.id) || 999
          const user2Rank = user2Prefs.get(user1.id) || 999

          // Score is inverse of ranks (lower rank = higher score)
          const score = Math.round(200 - (user1Rank + user2Rank))

          matches.push({
            user1Id: user1.id,
            user2Id: user2.id,
            score: Math.max(score, 1), // Ensure score is at least 1
          })

          // Mark both users as processed
          processedUsers.add(user1.id)
          processedUsers.add(user2.id)

          // Break to the next user1
          break
        }
      }
    }

    // Save matches to database
    if (matches.length > 0) {
      await prisma.match.createMany({
        data: matches,
      })
    }

    revalidatePath("/matches")
    return { success: true, matchCount: matches.length }
  } catch (error) {
    console.error("Error running matching algorithm:", error)
    return { success: false, error: "Failed to run matching algorithm" }
  }
}

// Get all users
export async function getUsers() {
  const currentUser = await requireAuth()

  try {
    const users = await prisma.user.findMany({
      where: {
        id: { not: currentUser.id }, // Exclude current user
      },
      select: {
        id: true,
        username: true,
        fullName: true,
      },
      orderBy: {
        fullName: "asc",
      },
    })

    return users
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

// Get user preferences
export async function getUserPreferences() {
  const user = await requireAuth()

  try {
    const preferences = await prisma.preference.findMany({
      where: { userId: user.id },
      select: {
        selected: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
        rank: true,
      },
      orderBy: { rank: "asc" },
    })

    return preferences.map((pref) => pref.selected)
  } catch (error) {
    console.error("Error fetching preferences:", error)
    return []
  }
}

// Get user matches
export async function getUserMatches() {
  const user = await requireAuth()

  try {
    const matchesAsUser1 = await prisma.match.findMany({
      where: { user1Id: user.id },
      select: {
        id: true,
        score: true,
        user2: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
    })

    const matchesAsUser2 = await prisma.match.findMany({
      where: { user2Id: user.id },
      select: {
        id: true,
        score: true,
        user1: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
    })

    // Combine and normalize matches
    const matches = [
      ...matchesAsUser1.map((match) => ({
        id: match.id,
        score: match.score,
        user: match.user2,
      })),
      ...matchesAsUser2.map((match) => ({
        id: match.id,
        score: match.score,
        user: match.user1,
      })),
    ]

    return matches
  } catch (error) {
    console.error("Error fetching matches:", error)
    return []
  }
}

