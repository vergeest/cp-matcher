export interface User {
  username: string
  fullName: string
}

export interface Match extends User {
  score: number
}

export interface Preference {
  username: string
  preferences: string[]
}

