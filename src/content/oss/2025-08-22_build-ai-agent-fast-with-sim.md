---
date: 2025-08-22T03:37:45.579Z
title: 'ทดลองสร้าง AI Agent กับ Sim'
description: >-
  "สารพัดวิธีเริ่มต้นใช้งาน Sim เพื่อสร้าง AI Agent งานง่ายและเร็วมาก!"
author: Kananek T.
oss: https://github.com/simstudioai/sim
tags: [oss, AI, Sim, Software, Development, OpenSource]
---

<p align="center">
  <a href="https://sim.ai" target="_blank" rel="noopener noreferrer">
    <img src="apps/sim/public/logo/reverse/text/large.png" alt="Sim Logo" width="500"/>
  </a>
</p>

<p align="center">สร้างและนำ AI agent workflows ไปใช้ได้ภายในไม่กี่นาที</p>

ต้นแบบการสร้าง AI Agent ของคุณง่ายมาก! หากคุณยังใหม่กับการพัฒนาซอฟต์แวร์ ลองใช้ Sim ซึ่งเป็นเครื่องมือที่เปิดให้ใช้สาธารณะเพื่อสร้าง AI agent workflows Clash กับเครื่องมือต่างๆ ได้อย่างง่ายดาย เพียงแค่ทำตามขั้นตอนด้านล่างนี้:

### เริ่มต้นใช้งาน Sim

1. **ใช้ Cloud**: ไปที่ [sim.ai](https://sim.ai) คุณสามารถเริ่มสร้างการทำงานของ AI Agent ได้ ภายในไม่กี่คลิก!
2. **ใช้ NPM Package**:
   ```bash
   npx simstudio
   ```
   รันที่ http://localhost:3000
3. **ใช้ Docker Compose**:
   ```bash
   git clone https://github.com/simstudioai/sim.git
   cd sim
   docker compose -f docker-compose.prod.yml up -d
   ```
   คลิกที่ http://localhost:3000 เพื่อเข้าถึงแอปพลิเคชันของคุณ

ด้วยวิธีการที่กล่าวมา คุณจะสามารถสร้างและทดสอบการดำเนินการซอฟต์แวร์ AI ของคุณได้อย่างรวดเร็ว ขอบคุณที่ลองใช้ Sim!
