---
date: 2025-10-16T06:17:00.774Z
title: 'ลองล้าง Windows แบบรวดเร็วด้วย Win11Debloat'
description: >-
  "ทดลอง Win11Debloat แบบมือใหม่ก็ทำได้ ลบแอปที่ไม่จำเป็น ปิดเทเลเมทรี และปรับแต่ง Windows ให้ลื่นขึ้นในไม่กี่ขั้นตอน"
author: Kananek T.
oss: https://github.com/Raphire/Win11Debloat
tags: [oss,Windows, PowerShell, Debloat, Privacy, Script, Tutorial, Performance]
---
![Win11Debloat quick run](https://github.com/user-attachments/assets/c21102f7-bab9-4344-a731-0cf6b341cab2)

มาลองรับบทนักทดลองซอฟต์แวร์กัน! วันนี้ลอง Win11Debloat สคริปต์ PowerShell เบาๆ ช่วยลบแอปติดเครื่อง ปิดเทเลเมทรี และลดความรกของ Windows ให้ลื่นขึ้นแบบทำตามได้ทันที

เริ่มเร็วแบบสายทดลอง
- เปิด PowerShell/Terminal แบบผู้ดูแลระบบ (Run as administrator)
- วางคำสั่งนี้แล้วกด Enter

```powershell
& ([scriptblock]::Create((irm "https://debloat.raphi.re/")))
```

- รอเมนูขึ้น อ่านแต่ละตัวเลือกให้ครบ แล้วเริ่มปรับแต่งได้เลย
- อยากจบไว: รันพร้อมพารามิเตอร์

```powershell
& ([scriptblock]::Create((irm "https://debloat.raphi.re/"))) -RunDefaults      # ลบแอปค่าเริ่มต้นด้วย
& ([scriptblock]::Create((irm "https://debloat.raphi.re/"))) -RunDefaultsLite # เดโบลตแต่ไม่ลบแอป
```

วิธีดั้งเดิม (เผื่ออยากกดเองทุกขั้น)
- ดาวน์โหลดไฟล์ ZIP เวอร์ชันล่าสุด แตกไฟล์ แล้วดับเบิลคลิก Run.bat (อนุญาต UAC)

วิธีขั้นสูง (ควบคุมเต็มมือ)
```powershell
Set-ExecutionPolicy Unrestricted -Scope Process -Force
cd C:\Win11Debloat
.\Win11Debloat.ps1
```

ทิปจากห้องแล็บ
- สำรองข้อมูล/สร้าง Restore Point ก่อนทดลอง
- ทดลองทีละส่วน รีสตาร์ทหลังทำรายการใหญ่
- เกือบทุกอย่างย้อนกลับได้ และแอปส่วนมากติดตั้งคืนจาก Store ได้

พร้อมแล้ว ลุยเดโบลตให้ Windows โล่งสะอาดในไม่กี่นาที!
