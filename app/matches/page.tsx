import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { requireAuth } from "@/lib/auth"
import { MatchList } from "@/components/match-list"
import { Skeleton } from "@/components/ui/skeleton"
import { RunMatchingButton } from "@/components/run-matching-button"

export default async function Matches() {
  const user = await requireAuth()

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your Matches</h1>
            <p className="text-muted-foreground">View your partner matches based on mutual preferences</p>
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
            <RunMatchingButton />
          </div>
        </div>

        <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
          <MatchList />
        </Suspense>
      </div>
    </main>
  )
}

