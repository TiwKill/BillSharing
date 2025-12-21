"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Calendar, User, Users } from "lucide-react"
import type { Person, Expense } from "@/types/index"

interface ExpenseCardProps {
    expense: Expense
    people: Person[]
    onEdit: () => void
    onDelete: () => void
}

/**
 * Card component displaying a single expense with details and actions
 */
export function ExpenseCard({ expense, people, onEdit, onDelete }: ExpenseCardProps) {
    const paidByPerson = people.find((p) => p.id === expense.paidBy)
    const sharedByPeople = people.filter((p) => expense.sharedBy.includes(p.id))
    const amountPerPerson = expense.amount / expense.sharedBy.length

    return (
        <Card className="border-l-4" style={{ borderLeftColor: paidByPerson?.color || "#gray" }}>
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{expense.title}</h3>
                            <Badge variant="secondary">฿{expense.amount.toLocaleString()}</Badge>
                        </div>

                        <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <User className="h-3 w-3" />
                                <span>จ่ายโดย: {paidByPerson?.name || "ไม่ทราบ"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-3 w-3" />
                                <span>แชร์โดย: {sharedByPeople.map((p) => p.name).join(", ")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(expense.date).toLocaleDateString("th-TH")}</span>
                            </div>
                            <div className="text-xs">
                                <span>฿{amountPerPerson.toLocaleString()} ต่อคน</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-1 ml-4">
                        <Button variant="ghost" size="sm" onClick={onEdit}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
