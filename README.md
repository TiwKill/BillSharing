This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

เว็บไซต์แชร์ค่าใช้จ่าย

เกี่ยวกับอะไร:
เว็บไซต์นี้เป็นแอปพลิเคชันสำหรับคำนวณและแบ่งค่าใช้จ่ายระหว่างเพื่อน เหมาะสำหรับการไปเที่ยว กินข้าว หรือซื้อของร่วมกัน

ฟีเจอร์หลัก:

1. จัดการคน - เพิ่ม/ลบคนในกลุ่ม พร้อมสุ่มสีประจำตัว สามารถกดเลือกคนที่เเชร์ค่าใช้จ่ายทั้งหมดได้เเละยกเลิกการเลือกทั้งหมดได้
2. บันทึกรายการ - เพิ่มรายการค่าใช้จ่าย กำหนดราคา เลือกคนที่จ่ายและคนที่แชร์
3. แก้ไขรายการ - สามารถแก้ไขรายการที่บันทึกไปแล้ว เปลี่ยนราคาหรือคนที่แชร์
4. สรุปยอด - ดูว่าแต่ละคนจ่ายไปเท่าไหร่ ต้องจ่ายเท่าไหร่ และยอดคงเหลือ
5. คำนวณการชำระเงิน - แสดงว่าใครต้องจ่ายเงินให้ใครเท่าไหร่เพื่อให้เท่ากัน
6. บันทึกข้อมูล - บันทึกข้อมูลทั้งหมดลง localStorage

หน้าที่ต้องการให้เเสดงมีดังนี้:

1. จัดการคน
2. รายหารค่าใช้จ่าย
3. สรุปยอด

เทคโนโลยีที่ใช้:

- Next.js - React framework สำหรับ frontend และ backend
- shadcn/ui - Component library สำหรับ UI ที่สวยงาม
- Tabler Icons - ไอคอนสำหรับ interface

จากโค้ดเเก้ไขตรง calculateSettlements ให้เป็นเเบเรียบง่ายให้หน่อยตามนี้

ตัวอย่างรายชื่อคน:
a, b, c

ตัวอย่างรายการค่าใช้จ่าย:
1. น้ำเเข็ง 9บาท จ่ายโดย: a แชร์โดย: a, b, c
2. เบียช้าง 6บาท จ่ายโดย: b แชร์โดย: a, b, c
3. ข้าว 2บาท จ่ายโดย: c แชร์โดย: a, b

ตัวอย่างสรุปยอดที่ควรจะเป็น:
คนจ่าย a
b -> 3 -> a
c -> 3 -> a

คนจ่าย b
a -> 2 -> b
c -> 2-> b

คนจ่าย c
a -> 1 -> c
b -> 1 -> c

ตัวอย่างสรุปยอดที่ควรจะเป็น:
คนจ่าย a
b -> 1 -> a
c -> 2 -> a

คนจ่าย b
a -> 2 -> b

คนจ่าย c
b -> 1 -> c