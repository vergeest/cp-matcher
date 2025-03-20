import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface User {
  username: string
  fullName: string
}

interface UserCardProps {
  user: User
}

export function UserCard({ user }: UserCardProps) {
  const initials = user.fullName
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
          <h2 className="text-xl font-bold">{user.fullName}</h2>
          <p className="text-sm text-muted-foreground">{user.username}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm">
          <p className="font-medium">Your Profile</p>
          <p className="text-muted-foreground mt-1">Select your preferred partners from the available users.</p>
        </div>
      </CardContent>
    </Card>
  )
}

