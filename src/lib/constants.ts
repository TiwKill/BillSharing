/**
 * Color palette for person avatars
 * ใช้กำหนดสีให้กับแต่ละคนในกลุ่มโดยอัตโนมัติ
 */
export const PERSON_COLORS = [
    "#ef4444", // red
    "#f97316", // orange
    "#eab308", // yellow
    "#22c55e", // green
    "#06b6d4", // cyan
    "#3b82f6", // blue
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#f43f5e", // rose
    "#84cc16", // lime
] as const

/**
 * LocalStorage keys
 * กำหนด keys สำหรับ localStorage เพื่อป้องกันการพิมพ์ผิด
 */
export const STORAGE_KEYS = {
    PEOPLE: "expense-people",
    EXPENSES: "expense-expenses",
} as const
