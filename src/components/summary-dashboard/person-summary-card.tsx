"use client"

import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import type { PersonSummary } from "@/types/index"

interface PersonSummaryCardProps {
    summary: PersonSummary
}

/**
 * Card component displaying a person's expense summary with balance status
 */
export function PersonSummaryCard({ summary }: PersonSummaryCardProps) {
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
