---
date: 2025-08-16T07:18:24.123Z
title: Fix Electron Build Error on Windows – Symlink Privilege
description: วิธีแก้ปัญหา build Electron ไม่ผ่านบน Windows เพราะสิทธิ์สร้าง symlink ไม่พอ ด้วยการเปิด Developer Mode
author: Kananek T.
tags: [electron, windows, symlink, developer-mode, powershell, electron-builder]
---

เจอ error ตอน build Electron บน Windows ประมาณนี้ใช่ไหม

```bash
ERROR: Cannot create symbolic link : A required privilege is not held by the client. : C:\Users\dvgamerr\AppData\Local\electron-builder\Cache\winCodeSign\700413911\darwin\10.12\lib\libssl.dylib
```

ต้นเหตุคือ Windows ไม่ให้สร้าง **symlink** ถ้าไม่ได้เปิดสิทธิ์นักพัฒนาไว้ ทำให้เครื่องมืออย่าง `electron-builder` สร้างลิงก์ไฟล์ไม่ได้

## วิธีแก้แบบสั้นสุด

เปิด **Developer Mode** ใน Windows หนึ่งครั้ง ก็จบ

### ทาง GUI

1. เปิด **Settings**
2. ไปที่ **Update & Security → For developers**
3. เปิดสวิตช์ **Developer Mode**

### ทาง PowerShell (ต้อง Run as Administrator)

```powershell
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock" `
  /t REG_DWORD /f /v AllowDevelopmentWithoutDevLicense /d 1
```

เสร็จแล้วลอง `npm run build` หรือคำสั่ง build เดิมอีกครั้ง

## บันทึกสั้นๆ

- เปิด Developer Mode แล้ว ไม่ต้องเป็น Admin ตอนสร้าง symlink อีกต่อไป สำหรับ user ปกติ
- ถ้า CI/CD ยัง error ให้เช็กว่า runner มีสิทธิ์เทียบเท่า หรือใช้วิธี run ใน shell ที่มีสิทธิ์พอ
- ยังไม่หาย? ลองลบ cache ที่เกี่ยวข้องแล้ว build ใหม่

  ```
  rmdir /s /q %LOCALAPPDATA%\electron-builder\Cache
  ```

## สรุป

นี่ไม่ใช่ปัญหา Electron โดยตรง แต่เป็นสิทธิ์ symlink ของ Windows เปิด Developer Mode ครั้งเดียว เคลียร์ได้ยาวๆ.
