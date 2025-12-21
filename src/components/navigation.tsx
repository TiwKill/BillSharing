"use client"

import { Button } from "@/components/ui/button"
import type { TabType } from "@/types/index"

interface NavigationProps {
    activeTab: TabType
    onTabChange: (tab: TabType) => void
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
    return (
        <div className="flex gap-2 mb-6">
            <Button
                variant={activeTab === "people" ? "default" : "outline"}
                onClick={() => onTabChange("people")}
                className="flex-1"
            >
                จัดการคน
            </Button>
            <Button
                variant={activeTab === "expenses" ? "default" : "outline"}
                onClick={() => onTabChange("expenses")}
                className="flex-1"
            >
                รายการค่าใช้จ่าย
            </Button>
            <Button
                variant={activeTab === "summary" ? "default" : "outline"}
                onClick={() => onTabChange("summary")}
                className="flex-1"
            >
                สรุปยอด
            </Button>
        </div>
    )
}
