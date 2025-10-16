---
date: 2025-10-16T06:18:41.293Z
title: 'ลองสร้าง Windows 11 บางเฉียบด้วย tiny11builder'
description: >-
  "คู่มือสั้นๆ สร้างอิมเมจ Windows 11 แบบบางเฉียบด้วย tiny11builder พร้อมขั้นตอน ทีละขั้นและข้อควรรู้ เลือกได้ทั้งรุ่นใช้งานจริงหรือรุ่น core สำหรับงานทดสอบ"
author: Kananek T.
oss: https://github.com/ntdevlabs/tiny11builder
tags: [oss,windows, tiny11, powershell, iso, dism, virtualization, scripting]
---
![Tiny Windows Lab](https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&q=80)

วันนี้มาสวมบทนักทดลองซอฟต์แวร์ สร้างอิมเมจ Windows 11 แบบบางเฉียบด้วย tiny11builder กัน ใช้ง่าย ยืดหยุ่น และเร็ว

สิ่งที่ต้องมี
- ISO ของ Windows 11 ที่เมานต์แล้ว (เช่นไดรฟ์ I)
- พื้นที่ว่างสำหรับสcratch (เช่นไดรฟ์ D)
- PowerShell 5.1 เปิดแบบ Administrator

เริ่มกันเลย
1) เปิด PowerShell (Admin) แล้วตั้งค่านโยบายชั่วคราว:
```powershell
Set-ExecutionPolicy Bypass -Scope Process
```
2) รันสคริปต์ (ปรับ path และตัวอักษรไดรฟ์ของคุณ):
```powershell
C:/path/to/your/tiny11/script.ps1 -ISO I -SCRATCH D
```
3) เลือก SKU แล้วนั่งชิล ระหว่างสคริปต์ปรับแต่งและสร้าง tiny11.iso ในโฟลเดอร์สคริปต์

เลือกสูตรให้เหมาะงาน
- tiny11maker.ps1: ตัดของบวมแต่ยัง “serviceable” เติมภาษา อัปเดต ฟีเจอร์ได้ เหมาะใช้งานจริง
- tiny11coremaker.ps1: เบาสุด ตัด WinSxS/Update/WinRE ใช้ทดสอบ/VM เร็วๆ เท่านั้น ติดตั้งแล้วเพิ่มอะไรภายหลังไม่ได้

ทิปและข้อควรรู้
- ใช้การบีบอัดแบบ recovery ของ DISM ทำให้ ISO เล็กลง
- มีไฟล์ unattended ช่วยข้าม Microsoft Account ใน OOBE และติดตั้งแบบ /compact
- อาจต้องอัปเดต winget ก่อนติดตั้งแอป
- Edge ถูกลบแล้ว แต่ร่องรอยใน Settings อาจยังเห็นได้
- บน arm64 อาจเห็นข้อความผิดพลาดสั้นๆ จาก OneDriveSetup ที่ไม่มี

เสร็จแล้วนำ tiny11.iso ไปบูตเครื่องจริงหรือสร้าง VM ได้ทันที ลองเล่นให้สุด!
