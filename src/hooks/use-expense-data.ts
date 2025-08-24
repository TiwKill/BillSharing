import { useLocalStorage } from "./use-local-storage"
import type { Person, Expense, PersonSummary, Settlement } from "@/types/index"

const COLORS = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#f43f5e",
    "#84cc16",
]

export function useExpenseData() {
    const [people, setPeople] = useLocalStorage<Person[]>("expense-people", [])
    const [expenses, setExpenses] = useLocalStorage<Expense[]>("expense-expenses", [])

    const addPerson = (name: string) => {
        const newPerson: Person = {
            id: Date.now().toString(),
            name,
            color: COLORS[people.length % COLORS.length],
        }
        setPeople([...people, newPerson])
        return newPerson
    }

    const removePerson = (id: string) => {
        setPeople(people.filter((p) => p.id !== id))
        // Remove person from all expenses
        setExpenses(
            expenses
                .map((expense) => ({
                    ...expense,
                    sharedBy: expense.sharedBy.filter((personId) => personId !== id),
                    paidBy: expense.paidBy === id ? "" : expense.paidBy,
                }))
                .filter((expense) => expense.paidBy !== ""),
        )
    }

    const addExpense = (expense: Omit<Expense, "id">) => {
        const newExpense: Expense = {
            ...expense,
            id: Date.now().toString(),
        }
        setExpenses([...expenses, newExpense])
        return newExpense
    }

    const updateExpense = (id: string, updates: Partial<Expense>) => {
        setExpenses(expenses.map((expense) => (expense.id === id ? { ...expense, ...updates } : expense)))
    }

    const removeExpense = (id: string) => {
        setExpenses(expenses.filter((e) => e.id !== id))
    }

    const calculateSummary = (): PersonSummary[] => {
        return people.map((person) => {
            // ยอดที่จ่ายจริง (เป็นผู้จ่าย)
            const totalPaid = expenses
                .filter((expense) => expense.paidBy === person.id)
                .reduce((sum, expense) => sum + expense.amount, 0)
    
            // ยอดที่ต้องจ่าย (รวมถึง share ของตัวเองด้วย)
            const totalOwed = expenses
                .filter((expense) => expense.sharedBy.includes(person.id))
                .reduce((sum, expense) => {
                    const shareAmount = expense.amount / expense.sharedBy.length
                    return sum + shareAmount
                }, 0)
    
            const balance = totalPaid - totalOwed
    
            return {
                id: person.id,
                name: person.name,
                color: person.color,
                totalPaid: Math.round(totalPaid),
                totalOwed: Math.round(totalOwed),
                balance: Math.round(balance),
            }
        })
    }
    
    const calculateSettlements = (): Settlement[] => {
        const settlements: Settlement[] = []
    
        // คำนวณยอดที่แต่ละคนต้องจ่ายให้กันตามสัดส่วน
        for (const payer of people) {
            // หารายการที่คนนี้เป็นผู้จ่าย
            const paidExpenses = expenses.filter(expense => expense.paidBy === payer.id)
            
            for (const expense of paidExpenses) {
                // หาคนที่ต้องจ่ายเงินให้คนนี้ (ทุกคนที่แชร์รายการนี้ยกเว้นตัวเอง)
                const sharers = people.filter(person => 
                    expense.sharedBy.includes(person.id) && person.id !== payer.id
                )
                
                // จำนวนเงินที่แต่ละคนต้องจ่าย (แบ่งเท่าๆกัน)
                const amountPerPerson = expense.amount / expense.sharedBy.length
                
                for (const sharer of sharers) {
                    settlements.push({
                        from: sharer,
                        to: payer,
                        amount: Math.round(amountPerPerson)
                    })
                }
            }
        }
    
        // รวมยอดถ้า from, to ซ้ำกัน
        const aggregated: Record<string, Settlement> = {}
        for (const s of settlements) {
            const key = `${s.from.id}-${s.to.id}`
            if (!aggregated[key]) {
                aggregated[key] = { ...s }
            } else {
                aggregated[key].amount += s.amount
            }
        }
    
        // ปัดเศษยอดรวมอีกครั้ง
        return Object.values(aggregated).map(s => ({
            ...s,
            amount: Math.round(s.amount)
        }))
    }
    
    return {
        people,
        expenses,
        addPerson,
        removePerson,
        addExpense,
        updateExpense,
        removeExpense,
        calculateSummary,
        calculateSettlements,
    }
}
