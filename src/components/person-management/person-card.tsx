"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { Person } from "@/types/index"

interface PersonCardProps {
    person: Person
    onRemove: () => void
}

/**
 * Card component displaying a single person with avatar and remove button
 */
export function PersonCard({ person, onRemove }: PersonCardProps) {
    return (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
            <div className="flex items-center gap-3">
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{ backgroundColor: person.color }}
                >
                    {person.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="font-medium">{person.name}</p>
                </div>
            </div>
            <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    )
}
