---
date: 2025-01-19
title: 'ปิด DHCP บน macOS แบบทีละขั้นตอน (ง่ายและตรงไปตรงมา)'
description: 'ถ้ารัน DHCP server แล้วชนพอร์ตหรือมีปัญหาแปลก ๆ อาจต้องปิดบริการ DHCP ที่ติดมากับ macOS บทความนี้สอนปิดผ่านไฟล์ bootpd.plist แบบกระชับ'
author: 'Kananek T.'
image:
  url: '/cover/disabling-dhcp.webp'
  src: '../../../public/cover/disabling-dhcp.webp'
tags: ['macOS', 'DHCP', 'networking', 'thai']
---

## อาการเวลา DHCP ชนกัน

ตัวอย่าง error อาจขึ้นประมาณนี้:

```
Error: control/dhcp/set_config
enabling dhcp: starting dhcp server: dhcpv4:
creating ipv4 udp connection: cannot bind to port 67: address already in use
```

แปลว่ามีอีกโปรเซสจับพอร์ต 67 อยู่ก่อนแล้ว (พอร์ตนี้เป็นของ DHCP)

---

## วิธีปิด DHCP บน macOS

### 1. เช็กก่อนว่าใครใช้พอร์ต 67

รัน:

```bash
sudo lsof -i :67
```

กรณีทั่วไปบน macOS ถ้าเห็น `bootpd` หรือ `bootpd` อยู่ในคอลัมน์ COMMAND / NAME แปลว่าบริการ DHCP/BOOTP ภายในเครื่องกำลังเปิดอยู่

ถ้าไม่เจออะไร (ไม่มี output) ไม่ต้องทำอะไรต่อก็ได้ เพราะพอร์ตว่างแล้ว

ถ้าเจอเป็น service อื่น (เช่น docker, process ของคุณเอง) ให้ตัดสินใจก่อนว่าจะปิดตัวนั้นหรือไม่ ก่อนยุ่งกับ `bootpd`

---

### 2. (ถ้ายืนยันว่าเป็น bootpd) แก้ไฟล์ตั้งค่า

เปิดไฟล์ `bootpd.plist`:

```bash
sudo nano /etc/bootpd.plist
```

### 3. ปรับค่าในไฟล์

- ปิด DHCP: หา `<key>dhcp_enabled</key>` แล้วให้ค่ามันว่างเป็น `<array/>`

```xml
<key>dhcp_enabled</key>
<array/>
```

- ลบหรือปิดส่วน Subnets: ถ้ามี `<key>Subnets</key>` จะคอมเมนต์ออกหรือลบ `<dict>` ทั้งก้อนได้
- ปิด BOOTP: ให้ `<key>bootp_enabled</key>` เป็น `false`

```xml
<key>bootp_enabled</key>
<false/>
```

### 4. เซฟแล้วออก

กด `Ctrl + O` (แล้ว Enter) จากนั้น `Ctrl + X`

---

### 5. รีสตาร์ท / ปิดบริการ bootpd

```bash
sudo launchctl stop com.apple.bootpd
sudo launchctl unload /System/Library/LaunchDaemons/bootps.plist
```

ตอนนี้ bootpd จะไม่กลับมาจับพอร์ต 67

### 6. ตรวจซ้ำ

```bash
sudo lsof -i :67
```

ถ้าเงียบ แปลว่าปิดสำเร็จ ถ้ายังเจอ ให้ดูอีกทีว่าเป็นโปรเซสใหม่หรือของเดิมยังไม่หยุด (อาจต้องรันซ้ำ / รีบูตเครื่องบางกรณี)

---

## แก้ปัญหาเพิ่มเติม (Troubleshooting)

### ยังเห็นพอร์ตโดนใช้?

- ดูว่าใครจับพอร์ต:
  ```bash
  sudo lsof -i :67
  ```
- ยิงโปรเซสนั้น (ระวังด้วย):
  ```bash
  sudo kill -9 <PID>
  ```

### อยากคืนค่าเดิม

ถ้าพังหรืออยากกลับไปเหมือนเดิม (ควร backup ก่อน):

```bash
sudo cp /etc/bootpd.plist /etc/bootpd.plist.bak
sudo defaults write /etc/bootpd.plist ""
```

---

ปิด DHCP สำเร็จ ก็ไม่ชนพอร์ต 67 แล้ว จะไปรัน DHCP server ของเราหรือบริการอื่นก็โล่งขึ้น 👍
