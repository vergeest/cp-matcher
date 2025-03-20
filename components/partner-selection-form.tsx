"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { ChevronUp, ChevronDown, X } from "lucide-react"

// Define User type
interface User {
  username: string
  fullName: string
}

interface PartnerSelectionFormProps {
  currentUser: User
  availableUsers: User[]
}

export function PartnerSelectionForm({ currentUser, availableUsers }: PartnerSelectionFormProps) {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [availablePool, setAvailablePool] = useState<User[]>(availableUsers)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddUser = (user: User) => {
    setSelectedUsers([...selectedUsers, user])
    setAvailablePool(availablePool.filter((u) => u.username !== user.username))
  }

  const handleRemoveUser = (user: User) => {
    setSelectedUsers(selectedUsers.filter((u) => u.username !== user.username))
    setAvailablePool([...availablePool, user])
  }

  const moveUserUp = (index: number) => {
    if (index === 0) return
    const newSelectedUsers = [...selectedUsers]
    const temp = newSelectedUsers[index]
    newSelectedUsers[index] = newSelectedUsers[index - 1]
    newSelectedUsers[index - 1] = temp
    setSelectedUsers(newSelectedUsers)
  }

  const moveUserDown = (index: number) => {
    if (index === selectedUsers.length - 1) return
    const newSelectedUsers = [...selectedUsers]
    const temp = newSelectedUsers[index]
    newSelectedUsers[index] = newSelectedUsers[index + 1]
    newSelectedUsers[index + 1] = temp
    setSelectedUsers(newSelectedUsers)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Simulate saving preferences
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Preferences saved",
        description: "Your partner preferences have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Selected Partners (In Order of Preference)</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedUsers.length > 0 ? (
            <ul className="space-y-2">
              {selectedUsers.map((user, index) => (
                <li key={user.username} className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div>
                    <p className="font-medium">{user.fullName}</p>
                    <p className="text-sm text-muted-foreground">{user.username}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" disabled={index === 0} onClick={() => moveUserUp(index)}>
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={index === selectedUsers.length - 1}
                      onClick={() => moveUserDown(index)}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveUser(user)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              No partners selected. Add partners from the available pool below.
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSubmit} disabled={selectedUsers.length === 0 || isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Preferences"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Users</CardTitle>
        </CardHeader>
        <CardContent>
          {availablePool.length > 0 ? (
            <ul className="space-y-2">
              {availablePool.map((user) => (
                <li key={user.username} className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div>
                    <p className="font-medium">{user.fullName}</p>
                    <p className="text-sm text-muted-foreground">{user.username}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleAddUser(user)}>
                    Add
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              All available users have been added to your selection.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

