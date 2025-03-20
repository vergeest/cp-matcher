import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { requireAuth } from "@/lib/auth"
import { PreferenceForm } from "@/components/preference-form"
import { UserProfile } from "@/components/user-profile"
import { Skeleton } from "@/components/ui/skeleton"

export default async function Dashboard() {
  const user = await requireAuth()

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Select your preferred partners</p>
          </div>
          <div className="flex gap-4">
            <Link href="/matches">
              <Button variant="outline">View Matches</Button>
            </Link>
            <Link href="/api/auth/logout">
              <Button variant="ghost">Logout</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <UserProfile user={user} />
          </div>
          <div className="md:col-span-2">
            <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
              <PreferenceForm />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
}

