"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Receipt, Edit, Trash2, Calendar, User, Users } from "lucide-react"
import type { Person, Expense } from "@/types/index"

interface ExpenseTrackingProps {
    people: Person[]
    expenses: Expense[]
    onAddExpense: (expense: Omit<Expense, "id">) => void
    onUpdateExpense: (id: string, updates: Partial<Expense>) => void
    onRemoveExpense: (id: string) => void
}

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

interface ExpenseCardProps {
    expense: Expense
    people: Person[]
    onEdit: () => void
    onDelete: () => void
}

function ExpenseCard({ expense, people, onEdit, onDelete }: ExpenseCardProps) {
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

interface ExpenseFormProps {
    people: Person[]
    initialExpense?: Expense
    onSubmit: (expense: Omit<Expense, "id">) => void
    onCancel: () => void
}

function ExpenseForm({ people, initialExpense, onSubmit, onCancel }: ExpenseFormProps) {
    const [title, setTitle] = useState(initialExpense?.title || "")
    const [amount, setAmount] = useState(initialExpense?.amount?.toString() || "")
    const [paidBy, setPaidBy] = useState(initialExpense?.paidBy || "")
    const [sharedBy, setSharedBy] = useState<string[]>(initialExpense?.sharedBy || [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim() || !amount || !paidBy || sharedBy.length === 0) return

        onSubmit({
            title: title.trim(),
            amount: Number.parseFloat(amount),
            paidBy,
            sharedBy,
            date: initialExpense?.date || new Date().toISOString(),
        })
    }

    const toggleSharedBy = (personId: string) => {
        setSharedBy((prev) => (prev.includes(personId) ? prev.filter((id) => id !== personId) : [...prev, personId]))
    }

    const selectAllPeople = () => {
        setSharedBy(people.map((person) => person.id))
    }

    const deselectAllPeople = () => {
        setSharedBy([])
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-sm font-medium">ชื่อรายการ</label>
                <Input placeholder="เช่น อาหารเที่ยง, ค่าแท็กซี่" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div>
                <label className="text-sm font-medium">จำนวนเงิน (บาท)</label>
                <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
            </div>

            <div>
                <label className="text-sm font-medium">คนที่จ่าย</label>
                <Select value={paidBy} onValueChange={setPaidBy} required>
                    <SelectTrigger>
                        <SelectValue placeholder="เลือกคนที่จ่าย" />
                    </SelectTrigger>
                    <SelectContent>
                        {people.map((person) => (
                            <SelectItem key={person.id} value={person.id}>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: person.color }} />
                                    {person.name}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">คนที่แชร์ค่าใช้จ่าย</label>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={selectAllPeople}
                            className="text-xs bg-transparent"
                        >
                            เลือกทั้งหมด
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={deselectAllPeople}
                            className="text-xs bg-transparent"
                        >
                            ยกเลิกทั้งหมด
                        </Button>
                    </div>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                    {people.map((person) => (
                        <div key={person.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={person.id}
                                checked={sharedBy.includes(person.id)}
                                onCheckedChange={() => toggleSharedBy(person.id)}
                            />
                            <label htmlFor={person.id} className="flex items-center gap-2 cursor-pointer">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: person.color }} />
                                {person.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-2 pt-4">
                <Button
                    type="submit"
                    className="flex-1"
                    disabled={!title.trim() || !amount || !paidBy || sharedBy.length === 0}
                >
                    {initialExpense ? "บันทึกการแก้ไข" : "เพิ่มรายการ"}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                    ยกเลิก
                </Button>
            </div>
        </form>
    )
}
