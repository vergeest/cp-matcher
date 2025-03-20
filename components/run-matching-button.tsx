"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { runMatching } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"
import { RefreshCw } from "lucide-react"

export function RunMatchingButton() {
  const [isPending, startTransition] = useTransition()

  const handleRunMatching = () => {
    startTransition(async () => {
      try {
        const result = await runMatching()

        if (result.success) {
          toast({
            title: "Success",
            description: `Matching algorithm completed with ${result.matchCount} matches`,
          })
        } else {
          throw new Error(result.error || "Failed to run matching algorithm")
        }
      } catch (error) {
        console.error("Error running matching algorithm:", error)
        toast({
          title: "Error",
          description: "Failed to run matching algorithm",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Button onClick={handleRunMatching} disabled={isPending}>
      {isPending ? (
        <>
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          Running...
        </>
      ) : (
        "Run Matching"
      )}
    </Button>
  )
}

