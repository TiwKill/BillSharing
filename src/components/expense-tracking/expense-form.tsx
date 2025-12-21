"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Person, Expense } from "@/types/index"

interface ExpenseFormProps {
    people: Person[]
    initialExpense?: Expense
    onSubmit: (expense: Omit<Expense, "id">) => void
    onCancel: () => void
}

/**
 * Form component for creating or editing an expense
 */
export function ExpenseForm({ people, initialExpense, onSubmit, onCancel }: ExpenseFormProps) {
    const [title, setTitle] = useState(initialExpense?.title || "")
    const [amount, setAmount] = useState(initialExpense?.amount?.toString() || "")
    const [paidBy, setPaidBy] = useState(initialExpense?.paidBy || "")
    const [sharedBy, setSharedBy] = useState<string[]>(initialExpense?.sharedBy || [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim() || !amount || !paidBy || sharedBy.length === 0) return

        onSubmit({
            title: title.trim(),
            amount: parseFloat(amount),
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
