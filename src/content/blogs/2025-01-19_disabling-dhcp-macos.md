---
date: 2025-01-19
title: 'ปิด DHCP บน macOS แบบทีละขั้นตอน (ง่ายและตรงไปตรงมา)'
description: 'ถ้ารัน DHCP server แล้วชนพอร์ตหรือมีปัญหาแปลก ๆ อาจต้องปิดบริการ DHCP ที่ติดมากับ macOS บทความนี้สอนปิดผ่านไฟล์ bootpd.plist แบบกระชับ'
author: 'Kananek T.'
image:
  url: '/cover/disabling-dhcp.jpg'
  src: '../../../public/cover/disabling-dhcp.jpg'
tags:
  [
    'dhcp',
    'dhcp server',
    'port 67',
    'udp',
    'macos',
    'bootpd',
    'bootp',
    'bootpd.plist',
    'lsof',
    'network',
    'disable dhcp',
    'stop dhcp',
    'launchctl',
    'plist',
    'xml config',
    'kill process',
    'troubleshooting',
    'restore settings',
    'networking',
    'port conflict',
  ]
---

ผมรัน DHCP server แล้วเจอว่า bind พอร์ต 67 ไม่ได้ ก็เลยเช็กก่อนว่าใครจับอยู่ ผลคือมีโปรเซสในเครื่องใช้พอร์ตนี้อยู่แล้ว (ส่วนมากจะเป็น bootpd ของ macOS เอง)

ตัวอย่าง error ที่ผมเจอจะหน้าตาประมาณนี้:

```
Error: control/dhcp/set_config
enabling dhcp: starting dhcp server: dhcpv4:
creating ipv4 udp connection: cannot bind to port 67: address already in use
```

ผมลองหยุดบริการก่อนแบบง่าย ๆ ด้วยคำสั่ง แล้วถ้าไม่ได้ ค่อยสับไปแก้ไฟล์คอนฟิกต่อ ไล่ไปทีละด่านแบบนี้เลย

---

## ด่าน 1: ดูก่อนว่าใครจับพอร์ต 67 อยู่

ผมลองส่องด้วย lsof ก่อน ถ้าไม่เจอ output ก็ผ่าน พอร์ตว่างแล้ว ไม่ต้องทำอะไรต่อ

```bash
sudo lsof -i :67
```

ถ้าเจอว่าเป็น `bootpd` ผมก็จะไปด่านถัดไป แต่ถ้าเป็นโปรเซสอื่น (เช่น docker หรือโปรแกรมของตัวเอง) ผมจะชั่งใจก่อนว่าจะปิดตัวนั้นแทนไหม

---

## ด่าน 2: ผมลอง stop ดูก่อน ถ้าไม่ได้ ค่อยแก้ไฟล์แทน

ก่อนแก้ไฟล์ ผมลองสั่งหยุดบริการตรง ๆ ก่อน เผื่อจบ:

```bash
sudo launchctl stop com.apple.bootpd
```

ถ้าเช็กแล้วพอร์ตยังไม่ว่าง ผมก็เลยไปลองแบบนี้แทน: แก้ไฟล์ `bootpd.plist`

```bash
sudo nano /etc/bootpd.plist
```

ในไฟล์ ผมทำสามอย่างนี้ต่อ ก็น่าจะได้ผลชัดเจน:

- ปิด DHCP โดยให้ `dhcp_enabled` เป็น array ว่าง

```xml
<key>dhcp_enabled</key>
<array/>
```

- ถ้ามี `Subnets` ผมก็ลบ/คอมเมนต์ทั้งก้อน `<dict>` ออก
- ปิด BOOTP ให้เป็น `false`

```xml
<key>bootp_enabled</key>
<false/>
```

จากนั้นผมก็เซฟไฟล์ออก (Ctrl + O แล้ว Enter, ตามด้วย Ctrl + X)

---

## ด่าน 3: ผมก็ unload daemon ต่อ ให้มันไม่กลับมาเอง

พอแก้ไฟล์เสร็จ ผมก็หยุดและถอดโหลดบริการออกไปเลย เพื่อไม่ให้กลับมาจับพอร์ตเองอัตโนมัติ

```bash
sudo launchctl stop com.apple.bootpd
sudo launchctl unload /System/Library/LaunchDaemons/bootps.plist
```

---

## ด่าน 4: ตรวจซ้ำอีกที ว่างยัง

ผมเช็กอีกรอบ ถ้าเงียบ ๆ ไม่มี output ก็แปลว่าพอร์ต 67 ว่างแล้ว ก็น่าจะได้ตามที่ต้องการ

```bash
sudo lsof -i :67
```

ถ้ายังเห็นมีใครจับอยู่ ผมก็จะดู PID แล้วค่อยตัดสินใจยิงโปรเซส หรือรีบูตเครื่องในบางกรณี

```bash
sudo lsof -i :67
sudo kill -9 <PID>
```

ถ้ารีบูตครั้งหนึ่งแล้วทุกอย่างนิ่งดี แปลว่าปิด DHCP ของเครื่องสำเร็จ ไม่ชนพอร์ต 67 อีกต่อไป

---

## บันทึกสั้น ๆ สไตล์ผม

- ผมลอง stop ก่อน ถ้าไม่ได้ ก็ไปแก้ `/etc/bootpd.plist`
- ผมตั้ง `dhcp_enabled` ให้เป็น `<array/>` และ `bootp_enabled` เป็น `<false/>`
- ผมก็ unload daemon ต่อ ด้วย `launchctl unload` เพื่อกันมันกลับมา
- สุดท้ายผมเช็กพอร์ต 67 อีกรอบ ถ้าเงียบก็จบ งานนี้ผ่าน

อยากย้อนกลับก็ได้ แนะนำให้ backup ไฟล์ก่อน แล้วค่อยคืนค่า:

```bash
sudo cp /etc/bootpd.plist /etc/bootpd.plist.bak
sudo defaults write /etc/bootpd.plist ""
```

เรียบร้อยครับ พอร์ต 67 โล่ง ผมก็ไปรัน DHCP server ของตัวเองต่อได้สบายใจ
