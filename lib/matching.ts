import type { Match } from "./types"
import { getAllUsers, getAllPreferences, getUserPreferences } from "./data"

// Function to calculate matches for a user
export async function getMatches(username: string): Promise<Match[]> {
  const users = await getAllUsers()
  const allPreferences = await getAllPreferences()
  const userPreferences = await getUserPreferences(username)

  // No preferences set yet
  if (userPreferences.length === 0) {
    return []
  }

  const matches: Match[] = []

  // Calculate match scores for each user that the current user has selected
  for (const preferredUsername of userPreferences) {
    const preferredUser = users.find((u) => u.username === preferredUsername)
    if (!preferredUser) continue

    // Check if the preferred user has also selected the current user
    const theirPreferences = allPreferences.find((p) => p.username === preferredUsername)?.preferences || []
    const mutualIndex = theirPreferences.indexOf(username)

    // Calculate score based on mutual preferences and ranking
    // Higher score means better match
    let score = 0

    if (mutualIndex >= 0) {
      // Base score for mutual match
      score = 100

      // Adjust score based on ranking (higher ranking = higher score)
      const userRanking = userPreferences.indexOf(preferredUsername)
      const theirRanking = mutualIndex

      // Normalize rankings to 0-1 range
      const normalizedUserRanking = 1 - userRanking / userPreferences.length
      const normalizedTheirRanking = 1 - theirRanking / theirPreferences.length

      // Combined ranking score (0-100)
      const rankingScore = Math.round((normalizedUserRanking + normalizedTheirRanking) * 50)

      score += rankingScore
    }

    if (score > 0) {
      matches.push({
        ...preferredUser,
        score,
      })
    }
  }

  // Sort matches by score (highest first)
  return matches.sort((a, b) => b.score - a.score)
}

// Function to run the stable matching algorithm (Gale-Shapley algorithm)
// This would be used for a global matching process
export async function runStableMatching(): Promise<Map<string, string>> {
  const users = await getAllUsers()
  const allPreferences = await getAllPreferences()

  // Create a map of username to preferences
  const preferencesMap = new Map<string, string[]>()
  allPreferences.forEach((pref) => {
    preferencesMap.set(pref.username, pref.preferences)
  })

  // Split users into two groups (for demonstration, we'll split alphabetically)
  const groupA = users.filter((user) => user.username.localeCompare("user500") < 0).map((u) => u.username)
  const groupB = users.filter((user) => user.username.localeCompare("user500") >= 0).map((u) => u.username)

  // Initialize the result map
  const matches = new Map<string, string>()

  // Initialize free users in group A
  const freeA = [...groupA]

  // Keep track of the current proposal index for each user in group A
  const proposalIndex = new Map<string, number>()
  groupA.forEach((a) => proposalIndex.set(a, 0))

  // Keep track of current matches for group B
  const currentMatches = new Map<string, string>()

  // Run the algorithm until all users in group A are matched
  while (freeA.length > 0) {
    const a = freeA[0]
    const aPrefs = preferencesMap.get(a) || []

    // If a has no more preferences to try, remove from free list
    if (proposalIndex.get(a)! >= aPrefs.length) {
      freeA.shift()
      continue
    }

    // Get the next preference for a
    const b = aPrefs[proposalIndex.get(a)!]
    proposalIndex.set(a, proposalIndex.get(a)! + 1)

    // If b is not matched yet, match a and b
    if (!currentMatches.has(b)) {
      currentMatches.set(b, a)
      matches.set(a, b)
      freeA.shift()
    } else {
      // If b is already matched, check if b prefers a to current match
      const currentMatch = currentMatches.get(b)!
      const bPrefs = preferencesMap.get(b) || []

      const currentRank = bPrefs.indexOf(currentMatch)
      const newRank = bPrefs.indexOf(a)

      // If b prefers a to current match, update matches
      if (newRank >= 0 && (currentRank < 0 || newRank < currentRank)) {
        currentMatches.set(b, a)
        matches.set(a, b)

        // Add current match back to free list
        if (currentRank >= 0) {
          matches.delete(currentMatch)
          freeA.unshift(currentMatch)
        }

        freeA.shift()
      }
    }
  }

  return matches
}

