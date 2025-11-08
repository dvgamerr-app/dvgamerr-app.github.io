---
date: 2025-11-08T04:15:57.022Z
title: 'ลองใช้ AltSendme ส่งไฟล์ P2P ง่าย เร็ว ปลอดภัย'
description: >-
  "สอนติดตั้งและลองใช้ AltSendme ส่งไฟล์ P2P ไม่ต้องสมัคร ปลอดภัยด้วย TLS/QUIC รองรับ Windows, macOS, Linux ทำงานร่วมกับ CLI ได้ พร้อมทิปแก้ Gatekeeper บน macOS"
author: Kananek T.
oss: https://github.com/tonyantony300/alt-sendme
tags: [oss, p2p, filetransfer, privacy, encryption, crossplatform, desktop, tauri, iroh]
---

![AltSendme Demo](https://raw.githubusercontent.com/tonyantony300/alt-sendme/main/assets/animation.gif)

วันนี้มาลองเล่น AltSendme แอปส่งไฟล์แบบ P2P ที่ทั้งลื่น เร็ว และส่วนตัวสุดๆ ไม่ต้องสมัครบัญชี ส่งตรงเครื่องถึงเครื่องด้วยการเข้ารหัส end‑to‑end (QUIC + TLS 1.3)

เริ่มทดลองกันเลย:

1. ติดตั้ง

- Windows/macOS/Linux ดาวน์โหลดไฟล์ติดตั้งตามแพลตฟอร์มของคุณแล้วเปิดใช้งาน
- macOS (แอปยังไม่ลงลายเซ็น): ถ้าเจอคำเตือน ให้เปิด Terminal แล้วรัน:

```
cd /Applications && xattr -dr com.apple.quarantine AltSendme.app
```

2. ส่งไฟล์/โฟลเดอร์

- เปิด AltSendme กด Send แล้วลากไฟล์/โฟลเดอร์เข้าไป
- แอปจะสร้าง Ticket (โค้ดแชร์) ให้คัดลอกส่งให้ผู้รับ

3. รับไฟล์

- ฝั่งผู้รับกด Receive วาง Ticket แล้วเริ่มรับได้เลย
- การเชื่อมต่อเจาะ NAT อัตโนมัติ หากหลุดสามารถ resume ต่อได้

ทิปนักทดลอง

- โอนไฟล์ได้ทั้งในวงแลนและข้ามอินเทอร์เน็ต ไม่จำกัดขนาด
- ใช้ร่วมกับเครื่องมือ CLI “sendme” ได้สลับกันไปมา
- ไม่มีเซิร์ฟเวอร์กลาง คุณคุมความเป็นส่วนตัวเองเต็มที่

พร้อมลองยัง? เลือกไฟล์ใหญ่ๆ สักอัน แล้วส่งข้ามทวีปกันเลย!
