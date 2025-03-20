import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Match {
  username: string
  fullName: string
  score: number
}

interface MatchCardProps {
  match: Match
}

export function MatchCard({ match }: MatchCardProps) {
  const initials = match.fullName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold">{match.fullName}</h2>
          <p className="text-sm text-muted-foreground">{match.username}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm">
          <p className="font-medium">Match Score: {match.score}</p>
          <p className="text-muted-foreground mt-1">Based on mutual preferences</p>
        </div>
      </CardContent>
    </Card>
  )
}

