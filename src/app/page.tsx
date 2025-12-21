"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { PersonManagement } from "@/components/person-management"
import { ExpenseTracking } from "@/components/expense-tracking"
import { SummaryDashboard } from "@/components/summary-dashboard"
import { useExpenseData } from "@/hooks/use-expense-data"
import Footer from "@/components/footer"
import type { TabType } from "@/types/index"

export default function HomePage() {
    const [activeTab, setActiveTab] = useState<TabType>("people")
    const expenseData = useExpenseData()

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
            <div className="container mx-auto px-4 py-8">
                <div className="text-center space-y-4 mb-8 mt-4">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
                        BillSharing
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Manage shared expenses, split bills, and quickly see who owes what—perfect for trips, friend groups, and roommates.
                    </p>
                </div>

                <div className="w-full max-w-4xl mx-auto">
                    <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

                    <div className="space-y-6">
                        {activeTab === "people" && (
                            <PersonManagement
                                people={expenseData.people}
                                onAddPerson={expenseData.addPerson}
                                onRemovePerson={expenseData.removePerson}
                            />
                        )}

                        {activeTab === "expenses" && (
                            <ExpenseTracking
                                people={expenseData.people}
                                expenses={expenseData.expenses}
                                onAddExpense={expenseData.addExpense}
                                onUpdateExpense={expenseData.updateExpense}
                                onRemoveExpense={expenseData.removeExpense}
                            />
                        )}

                        {activeTab === "summary" && (
                            <SummaryDashboard
                                people={expenseData.people}
                                expenses={expenseData.expenses}
                                calculateSummary={expenseData.calculateSummary}
                                calculateSettlements={expenseData.calculateSettlements}
                            />
                        )}
                    </div>
                    <Footer />
                </div>
            </div>
        </main>
    )
}
