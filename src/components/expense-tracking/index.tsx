"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Receipt, Users } from "lucide-react"
import type { Person, Expense } from "@/types/index"
import { ExpenseCard } from "./expense-card"
import { ExpenseForm } from "./expense-form"

interface ExpenseTrackingProps {
    people: Person[]
    expenses: Expense[]
    onAddExpense: (expense: Omit<Expense, "id">) => void
    onUpdateExpense: (id: string, updates: Partial<Expense>) => void
    onRemoveExpense: (id: string) => void
}

/**
 * Component for tracking and managing expenses
 * Displays a list of expenses and allows adding/editing/removing them
 */
export function ExpenseTracking({
    people,
    expenses,
    onAddExpense,
    onUpdateExpense,
    onRemoveExpense,
}: ExpenseTrackingProps) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

    if (people.length === 0) {
        return (
            <Card>
                <CardContent className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">ยังไม่มีคนในกลุ่ม</h3>
                    <p className="text-muted-foreground">กรุณาเพิ่มคนในกลุ่มก่อนบันทึกรายการค่าใช้จ่าย</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Receipt className="h-5 w-5" />
                            รายการค่าใช้จ่าย ({expenses.length} รายการ)
                        </div>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    เพิ่มรายการ
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>เพิ่มรายการค่าใช้จ่าย</DialogTitle>
                                </DialogHeader>
                                <ExpenseForm
                                    people={people}
                                    onSubmit={(expense) => {
                                        onAddExpense(expense)
                                        setIsAddDialogOpen(false)
                                    }}
                                    onCancel={() => setIsAddDialogOpen(false)}
                                />
                            </DialogContent>
                        </Dialog>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {expenses.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>ยังไม่มีรายการค่าใช้จ่าย</p>
                            <p className="text-sm">เพิ่มรายการแรกเพื่อเริ่มต้นใช้งาน</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {expenses
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((expense) => (
                                    <ExpenseCard
                                        key={expense.id}
                                        expense={expense}
                                        people={people}
                                        onEdit={() => setEditingExpense(expense)}
                                        onDelete={() => onRemoveExpense(expense.id)}
                                    />
                                ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {editingExpense && (
                <Dialog open={!!editingExpense} onOpenChange={() => setEditingExpense(null)}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>แก้ไขรายการค่าใช้จ่าย</DialogTitle>
                        </DialogHeader>
                        <ExpenseForm
                            people={people}
                            initialExpense={editingExpense}
                            onSubmit={(updates) => {
                                onUpdateExpense(editingExpense.id, updates)
                                setEditingExpense(null)
                            }}
                            onCancel={() => setEditingExpense(null)}
                        />
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
