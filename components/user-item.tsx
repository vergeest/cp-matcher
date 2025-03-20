"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface UserItemProps {
  user: {
    id: string
    username: string
    fullName: string
  }
  rank: number
  onRemove: () => void
}

export function UserItem({ user, rank, onRemove }: UserItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-md">
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
          {rank}
        </span>
        <div>
          <p className="font-medium">{user.fullName}</p>
          <p className="text-sm text-muted-foreground">{user.username}</p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={onRemove}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

