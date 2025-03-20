import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Combine class names with Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Parse CAS XML response
export function parseXml(xml: string): { success: boolean; username: string; fullName: string } {
  // Default result
  const result = { success: false, username: "", fullName: "" }

  try {
    // Check if authentication was successful
    if (xml.includes("<cas:authenticationSuccess>")) {
      result.success = true

      // Extract username
      const usernameMatch = xml.match(/<cas:user>(.*?)<\/cas:user>/)
      if (usernameMatch && usernameMatch[1]) {
        result.username = usernameMatch[1]
      }

      // Extract full name (assuming it's in the attributes)
      const fullNameMatch = xml.match(/<cas:fullName>(.*?)<\/cas:fullName>/)
      if (fullNameMatch && fullNameMatch[1]) {
        result.fullName = fullNameMatch[1]
      } else {
        // If full name is not available, use username as fallback
        result.fullName = result.username
      }
    }
  } catch (error) {
    console.error("Error parsing CAS XML:", error)
  }

  return result
}

