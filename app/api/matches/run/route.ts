import { NextResponse } from "next/server"
import { runStableMatching } from "@/lib/matching"

export async function POST() {
  try {
    // Run the stable matching algorithm
    const matches = await runStableMatching()

    // Convert the Map to an array of objects for the response
    const matchesArray = Array.from(matches.entries()).map(([a, b]) => ({
      userA: a,
      userB: b,
    }))

    return NextResponse.json({ success: true, matches: matchesArray })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to run matching algorithm" }, { status: 500 })
  }
}

