"use client"

import type React from "react"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"

interface SortableItemProps {
  id: string
  children: React.ReactNode
}

export function SortableItem({ id, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li ref={setNodeRef} style={style} {...attributes} className="list-none">
      <div className="flex items-center">
        <div className="cursor-grab p-2 text-muted-foreground" {...listeners}>
          <GripVertical className="h-4 w-4" />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </li>
  )
}

