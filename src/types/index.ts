/**
 * Tab types for navigation
 */
export type TabType = "people" | "expenses" | "summary"

/**
 * Person in the expense sharing group
 */
export interface Person {
  id: string
  name: string
  color: string
}

/**
 * Expense record
 */
export interface Expense {
  id: string
  title: string
  amount: number
  paidBy: string // Person ID
  sharedBy: string[] // Array of Person IDs
  date: string
  category?: string
}

/**
 * Summary of a person's expenses and balance
 */
export interface PersonSummary {
  id: string
  name: string
  color: string
  totalPaid: number
  totalOwed: number
  balance: number // positive = should receive, negative = should pay
}

/**
 * Settlement between two people
 */
export interface Settlement {
  from: Person
  to: Person
  amount: number
}
