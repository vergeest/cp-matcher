import { getUserMatches } from "@/lib/actions"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export async function MatchList() {
  const matches = await getUserMatches()

  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No matches found</h2>
        <p className="text-muted-foreground mb-6">You don't have any matches yet. This could be because:</p>
        <ul className="list-disc list-inside text-left max-w-md mx-auto text-muted-foreground">
          <li>The matching algorithm hasn't been run yet</li>
          <li>You haven't selected any preferences</li>
          <li>Your preferences don't match with anyone else's preferences</li>
        </ul>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map((match) => (
        <Card key={match.id}>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {match.user.fullName
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .toUpperCase()
                  .substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{match.user.fullName}</h2>
              <p className="text-sm text-muted-foreground">{match.user.username}</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <p className="font-medium">Match Score: {match.score}</p>
              <p className="text-muted-foreground mt-1">Based on mutual preferences</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

