export interface Person {
  id: string
  name: string
  color: string
}

export interface Expense {
  id: string
  title: string
  amount: number
  paidBy: string // Person ID
  sharedBy: string[] // Array of Person IDs
  date: string
  category?: string
}

export interface PersonSummary {
  id: string
  name: string
  color: string
  totalPaid: number
  totalOwed: number
  balance: number // positive = should receive, negative = should pay
}

export interface Settlement {
  from: Person
  to: Person
  amount: number
}
