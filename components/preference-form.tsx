"use client"

import { useEffect, useState, useTransition } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SortableItem } from "@/components/sortable-item"
import { UserItem } from "@/components/user-item"
import { getUsers, getUserPreferences, savePreferences } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"

type User = {
  id: string
  username: string
  fullName: string
}

export function PreferenceForm() {
  const [isPending, startTransition] = useTransition()
  const [availableUsers, setAvailableUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    async function loadData() {
      try {
        const [users, preferences] = await Promise.all([getUsers(), getUserPreferences()])

        // Filter out users that are already in preferences
        const preferenceIds = new Set(preferences.map((p) => p.id))
        const available = users.filter((user) => !preferenceIds.has(user.id))

        setAvailableUsers(available)
        setSelectedUsers(preferences)
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Error",
          description: "Failed to load users and preferences",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleAddUser = (user: User) => {
    setSelectedUsers([...selectedUsers, user])
    setAvailableUsers(availableUsers.filter((u) => u.id !== user.id))
  }

  const handleRemoveUser = (user: User) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id))
    setAvailableUsers([...availableUsers, user].sort((a, b) => a.fullName.localeCompare(b.fullName)))
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setSelectedUsers((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        const formData = new FormData()
        selectedUsers.forEach((user) => {
          formData.append("preferences", user.id)
        })

        const result = await savePreferences(formData)

        if (result.success) {
          toast({
            title: "Success",
            description: "Your preferences have been saved",
          })
        } else {
          throw new Error(result.error || "Failed to save preferences")
        }
      } catch (error) {
        console.error("Error saving preferences:", error)
        toast({
          title: "Error",
          description: "Failed to save preferences",
          variant: "destructive",
        })
      }
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading preferences...</CardTitle>
          </CardHeader>
          <CardContent className="h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Selected Partners (In Order of Preference)</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedUsers.length > 0 ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={selectedUsers.map((user) => user.id)} strategy={verticalListSortingStrategy}>
                <ul className="space-y-2">
                  {selectedUsers.map((user, index) => (
                    <SortableItem key={user.id} id={user.id}>
                      <UserItem user={user} rank={index + 1} onRemove={() => handleRemoveUser(user)} />
                    </SortableItem>
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              No partners selected. Add partners from the available pool below.
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Saving..." : "Save Preferences"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Users</CardTitle>
        </CardHeader>
        <CardContent>
          {availableUsers.length > 0 ? (
            <ul className="space-y-2">
              {availableUsers.map((user) => (
                <li key={user.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
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

