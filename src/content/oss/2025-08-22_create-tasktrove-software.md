---
date: 2025-08-22T03:41:41.555Z
title: 'สร้าง TaskTrove ซอฟต์แวร์จัดการงานแบบใหม่'
description: >-
  "ลองใช้งาน TaskTrove ซอฟต์แวร์จัดการงานสุดเจ๋งด้วยการติดตั้งง่ายๆ."
author: Kananek T.
oss: https://github.com/dohsimpson/TaskTrove
tags: [oss,TaskTrove, Software, SelfHosted, Docker, Productivity]
---
<div align="center">

# TaskTrove

<img width="3400" height="920" alt="tasktrove-banner" src="https://github.com/user-attachments/assets/52c06cfe-2757-40d0-bb17-a6fed1b74f96" />

</div>

---

## ✨ ฟีเจอร์ที่น่าสนใจ

- **ความเป็นส่วนตัวสูง**: เปิดใช้งานได้บนเซิร์ฟเวอร์ของคุณเอง ไม่มีการติดตามข้อมูล.
- **สร้างงานอย่างชาญฉลาด**: สร้างงานได้ด้วยการพิมพ์ในลักษณะภาษาธรรมชาติ เช่น "พรุ่งนี้ตอนบ่ายสอง".
- **การจัดการโครงการ**: จัดกลุ่มงานตามโครงการพร้อมสีและวิธีมุมมองที่หลากหลาย.
  
## 📦 การติดตั้ง
### Docker (แนะนำ)

```bash
# เริ่มต้นได้ง่าย
docker run -p 3000:3000 -v ./data:/app/data -d --name tasktrove ghcr.io/dohsimpson/tasktrove
```

### Docker Compose

```bash
# ดาวน์โหลดไฟล์การตั้งค่า
git clone https://github.com/dohsimpson/TaskTrove
cd TaskTrove/selfhost

# เริ่ม TaskTrove
docker-compose up -d
```

## 💻 การใช้งาน
### คำสั่งคีย์บอร์ด
| **ปุ่ม** | **การกระทำ**                       |
| ------- | -------------------------------- |
| `n`     | เพิ่มงานใหม่อย่างรวดเร็ว           |
| `/`     | ค้นหางานและโครงการ              |
| `Space` | ทำเครื่องหมายว่างานเสร็จหรือลบออก |

---

## 🧩 การพัฒนา
สนใจมีส่วนร่วมในการพัฒนาหรือไม่? คุณสามารถเริ่มต้นได้โดยการ:
1. ดาวน์โหลดโค้ดจาก GitHub
2. ติดตั้ง dependencies.
3. เริ่มต้นการพัฒนาได้เลย!

---

<div align="center">

_Happy Tasking!_

</div>
