export interface User {
  uid: string
  email: string | null
  name: string | null
}

export interface AuthState {
  user: User | null
  deviceId: string
  token: string
  loading: boolean
  error: string | null
  status: "pending" | "succeed" | "rejected"
}