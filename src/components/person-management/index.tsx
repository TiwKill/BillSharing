"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users } from "lucide-react"
import type { Person } from "@/types/index"
import { PersonCard } from "./person-card"

interface PersonManagementProps {
    people: Person[]
    onAddPerson: (name: string) => void
    onRemovePerson: (id: string) => void
}

/**
 * Component for managing people in the expense sharing group
 * Allows adding new people and removing existing ones
 */
export function PersonManagement({ people, onAddPerson, onRemovePerson }: PersonManagementProps) {
    const [newPersonName, setNewPersonName] = useState("")

    const handleAddPerson = () => {
        if (newPersonName.trim()) {
            onAddPerson(newPersonName.trim())
            setNewPersonName("")
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleAddPerson()
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        เพิ่มคนใหม่
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Input
                            placeholder="ชื่อคน"
                            value={newPersonName}
                            onChange={(e) => setNewPersonName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1"
                        />
                        <Button onClick={handleAddPerson} disabled={!newPersonName.trim()}>
                            <Plus className="h-4 w-4 mr-2" />
                            เพิ่ม
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        รายชื่อคนในกลุ่ม ({people.length} คน)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {people.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>ยังไม่มีคนในกลุ่ม</p>
                            <p className="text-sm">เพิ่มคนแรกเพื่อเริ่มต้นใช้งาน</p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {people.map((person) => (
                                <PersonCard 
                                    key={person.id} 
                                    person={person} 
                                    onRemove={() => onRemovePerson(person.id)} 
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
