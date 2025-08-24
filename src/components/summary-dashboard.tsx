"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, ArrowRight, Calculator, Users, Receipt } from "lucide-react"
import type { Person, Expense, PersonSummary, Settlement } from "@/types/index"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"

interface SummaryDashboardProps {
    people: Person[]
    expenses: Expense[]
    calculateSummary: () => PersonSummary[]
    calculateSettlements: () => Settlement[]
}

export function SummaryDashboard({ people, expenses, calculateSummary, calculateSettlements }: SummaryDashboardProps) {
    if (people.length === 0) {
        return (
            <Card>
                <CardContent className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">ยังไม่มีคนในกลุ่ม</h3>
                    <p className="text-muted-foreground">กรุณาเพิ่มคนในกลุ่มก่อนดูสรุปยอด</p>
                </CardContent>
            </Card>
        )
    }

    if (expenses.length === 0) {
        return (
            <Card>
                <CardContent className="text-center py-12">
                    <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">ยังไม่มีรายการค่าใช้จ่าย</h3>
                    <p className="text-muted-foreground">กรุณาเพิ่มรายการค่าใช้จ่ายก่อนดูสรุปยอด</p>
                </CardContent>
            </Card>
        )
    }

    const summary = calculateSummary()
    const settlements = calculateSettlements()
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

    const settlementsByRecipient = settlements.reduce(
        (acc, settlement) => {
            const recipientId = settlement.to.id
            if (!acc[recipientId]) {
                acc[recipientId] = {
                    recipient: settlement.to,
                    payments: [],
                }
            }
            acc[recipientId].payments.push(settlement)
            return acc
        },
        {} as Record<string, { recipient: Person; payments: Settlement[] }>,
    )

    return (
        <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">ค่าใช้จ่ายรวม</p>
                                <p className="text-2xl font-bold">฿{totalExpenses.toLocaleString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Receipt className="h-5 w-5 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">จำนวนรายการ</p>
                                <p className="text-2xl font-bold">{expenses.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">คนในกลุ่ม</p>
                                <p className="text-2xl font-bold">{people.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Person Summary */}
            <Dialog>
                <DialogTrigger asChild>
                    <Card className="relative overflow-hidden">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 cursor-pointer relative z-10">
                                <Calculator className="h-5 w-5" />
                                สรุปยอดแต่ละคน
                            </CardTitle>
                            <Image
                                src="/hand-click.svg"
                                alt="Expand"
                                width={124}
                                height={124}
                                className="absolute right-0 top-12 -translate-y-1/2 opacity-20 pointer-events-none select-none -rotate-24"
                                style={{ zIndex: 0 }}
                            />
                        </CardHeader>
                    </Card>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Calculator className="h-5 w-5" />
                            สรุปยอดแต่ละคน
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                        {summary.map((personSummary) => (
                            <PersonSummaryCard key={personSummary.id} summary={personSummary} />
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            {Object.keys(settlementsByRecipient).length > 0 && (
                <div className="space-y-4">
                    {Object.values(settlementsByRecipient).map(({ recipient, payments }) => (
                        <Card key={recipient.id}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium"
                                        style={{ backgroundColor: recipient.color }}
                                    >
                                        {recipient.name.charAt(0).toUpperCase()}
                                    </div>
                                    คนจ่าย {recipient.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {payments.map((settlement, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                                                    style={{ backgroundColor: settlement.from.color }}
                                                >
                                                    {settlement.from.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium">{settlement.from.name}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <ArrowRight className="h-4 w-4" />
                                                <Badge variant="outline" className="font-semibold">
                                                    ฿{settlement.amount.toLocaleString()}
                                                </Badge>
                                                <ArrowRight className="h-4 w-4" />
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className="font-medium">{settlement.to.name}</span>
                                                <div
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                                                    style={{ backgroundColor: settlement.to.color }}
                                                >
                                                    {settlement.to.name.charAt(0).toUpperCase()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {settlements.length === 0 && (
                <Card>
                    <CardContent className="text-center py-8">
                        <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50 text-green-500" />
                        <h3 className="text-lg font-semibold mb-2 text-green-600">ทุกคนชำระเงินครบแล้ว!</h3>
                        <p className="text-muted-foreground">ไม่มีการชำระเงินที่ค้างอยู่</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

interface PersonSummaryCardProps {
    summary: PersonSummary
}

function PersonSummaryCard({ summary }: PersonSummaryCardProps) {
    const isCreditor = summary.balance > 0
    const isEven = Math.abs(summary.balance) < 0.01

    return (
        <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
            <div className="flex items-center gap-3">
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: summary.color }}
                >
                    {summary.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h3 className="font-semibold">{summary.name}</h3>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>จ่าย: ฿{summary.totalPaid.toLocaleString()}</span>
                        <span>ต้องจ่าย: ฿{summary.totalOwed.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="text-right">
                {isEven ? (
                    <Badge variant="secondary" className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        เท่ากัน
                    </Badge>
                ) : isCreditor ? (
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        ได้รับ ฿{summary.balance.toLocaleString()}
                    </Badge>
                ) : (
                    <Badge variant="destructive" className="flex items-center gap-1">
                        <TrendingDown className="h-3 w-3" />
                        ต้องจ่าย ฿{Math.abs(summary.balance).toLocaleString()}
                    </Badge>
                )}
            </div>
        </div>
    )
}