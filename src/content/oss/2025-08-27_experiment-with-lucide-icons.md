---
date: 2025-08-27T10:46:40.918Z
title: 'ลองของใหม่ Lucide: ไอคอนสวย ใช้ง่าย ใน 5 นาที'
description: >-
  "เพลย์เทสต์ Lucide ไอคอนโอเพนซอร์ส ติดตั้งไว ใช้ได้หลายเฟรมเวิร์ก ปรับขนาด สี และ stroke ได้ทันที รองรับ SVG ตรง และมีปลั๊กอิน Figma ให้ทีมดีไซน์"
author: Kananek T.
oss: https://github.com/lucide-icons/lucide
tags: [oss, lucide, icons, react, vue, svelte, figma, svg]
---

<p align="center">
  <a href="https://github.com/lucide-icons/lucide#gh-dark-mode-only">
    <img src="https://lucide.dev/lucide-logo-repo-dark.svg#gh-dark-mode-only" alt="Lucide - Beautiful & consistent icon toolkit made by the community. Open-source project and a fork of Feather Icons." width="480">
  </a>
</p>

วันนี้มาเพลย์เทสต์ Lucide ชุดไอคอนโอเพนซอร์สที่คม ชัด และคอนซิสเทนต์ เหมาะทั้งนักออกแบบและนักพัฒนา เป้าหมาย: เสกไอคอนสวยเข้าระบบใน 5 นาที

เริ่มเร็วแบบนักทดลอง

- เลือกแพ็กเกจให้ตรงเฟรมเวิร์ก: react ใช้ lucide-react, vue ใช้ lucide-vue-next, svelte ใช้ lucide-svelte, หรือใช้ js ล้วนด้วย lucide
- ติดตั้ง: `npm i lucide lucide-react` (ปรับตามเฟรมเวิร์ก)

ลองยิงไอคอนแรก (React)

```jsx
import { Camera, Moon } from 'lucide-react'
export default function App() {
  return (
    <div className="text-slate-900 dark:text-white">
      <Camera size={28} strokeWidth={1.75} />
      <Moon color="tomato" />
    </div>
  )
}
```

ปรับแต่งไว ๆ

- `size`: ขนาดไอคอน
- `color`: ใช้ `currentColor` ให้ตามธีมอัตโนมัติ
- `strokeWidth`: ความหนาเส้น (เช่น 1.25–2)
- `absoluteStrokeWidth`: คงความหนาเมื่อสเกล

ทางลัดสาย SVG ล้วน

- ติดตั้ง: `npm i lucide-static`
- ใช้ไฟล์ตรง ๆ: `<img src="/node_modules/lucide-static/icons/camera.svg" width="24" alt="camera" />`

ทิปให้บันเดิลเล็ก

- import แบบเจาะจงชื่อไอคอน เท่านี้ก็ได้ tree-shaking ฟรี

ฝั่งดีไซน์

- เปิดปลั๊กอิน Figma “Lucide Icons” แล้วลากใช้ไอคอนเดียวกับโค้ด เพื่อความสอดคล้องทั้งทีม

พร้อมแล้ว ลองแทนชุดไอคอนเดิมด้วย Lucide แล้วสัมผัสความเนียนตา + เวิร์กโฟลว์ที่ลื่นกว่าเดิม
