---
date: 2025-01-19
title: ปิดใช้งาน DHCP บน macOS
description: >-
  หากการรัน DHCP server ทำให้เกิดการชนพอร์ตหรือปัญหาแปลก ๆ
  คุณอาจต้องปิดบริการ DHCP ที่มาพร้อมกับ macOS
  บทความนี้สรุปสั้น ๆ ว่าปิดได้อย่างไรผ่านไฟล์ bootpd.plist
author: Kananek T.
image:
  url: '/cover/b08517fb-443f-46df-9618-de41b01a505b.jpg'
  src: '../../../public/cover/b08517fb-443f-46df-9618-de41b01a505b.jpg'
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

เออ วันนั้นผมจะตั้ง DHCP server บนเครื่อง macOS ตัวเองนี่แหละครับ ปรากฏว่า bind พอร์ต 67 ไม่ได้อยู่ดี ขึ้นว่า address already in use อ่า… ก็เดาได้ไม่ยาก ส่วนใหญ่ต้นเรื่องคือเจ้า bootpd ของ macOS เองนี่แหละ ชอบโผล่มาจับพอร์ตก่อนคนอื่นตลอด เหมือนมีเพื่อนที่ “มาจองเก้าอี้” ไว้ก่อนทุกทีเลยครับ

ตัวอย่าง error ที่โผล่มาประมาณนี้เลย:

```
Error: control/dhcp/set_config
enabling dhcp: starting dhcp server: dhcpv4:
creating ipv4 udp connection: cannot bind to port 67: address already in use
```

ผมเลยทำเช็กลิสต์แก้ปัญหาง่าย ๆ ไล่ด่านแบบแก้จริงใช้จริง เออ บางด่านจบเร็ว บางด่านก็มีงอแงบ้าง เดี๋ยวเล่าเป็นขั้น ๆ ไปนะครับ

---

## แผนรบสั้น ๆ ก่อนลุย

- ด่าน 1: หาให้เจอว่าใครจับพอร์ต 67 (UDP) อยู่
- ด่าน 2: ลองหยุดบริการแบบนิ่ม ๆ ก่อนด้วย launchctl
- ด่าน 3: ปิดให้เด็ดขาดด้วยการปรับ `/etc/bootpd.plist`
- ด่าน 4: กันไม่ให้ลุกขึ้นมาเอง ด้วย unload/disable
- ด่าน 5: ตรวจซ้ำ รีบูตถ้าจำเป็น และสรุปผล

ระหว่างทางจะเล่าว่าติดอะไร เจออะไรจริง ๆ บนเครื่องผมเองบ้างครับ อ่า ไป!

---

## ด่าน 1: ใครจับพอร์ต 67 กันแน่

เริ่มด้วยส่องก่อนเลย ถ้าคำสั่งนี้เงียบ ๆ ไม่มี output แปลว่าพอร์ตว่าง โล่งใจครับ จบตั้งแต่หน้าบ้าน ไม่ต้องไปไกล

```bash
sudo lsof -nP -i UDP:67
```

ถ้าเจอชื่อ `bootpd` ก็ใช่เลย ตัวป่วนประจำบ้าน แต่บางทีผมก็เคยเจออย่างอื่นนะ เช่นโปรเซสจาก tool ที่ทดสอบ DHCP เอง หรือ service แปลก ๆ จาก virtualization ถ้าเป็นพวกนี้ก็คุยกันก่อนว่าใครควรหยุด ใครควรอยู่ครับ

ข้อสังเกต: ใช้ `-nP` จะไม่ทำ DNS/port lookup ช่วยให้ผลลัพธ์เร็วและตรงไปตรงมากว่า

---

## ด่าน 2: หยุดแบบสุภาพก่อน (stop)

ก่อนจะไปแก้ไฟล์ ผมชอบลองสั่งหยุด service ตรง ๆ ก่อน เผื่อ “เออ จบ” ง่าย ๆ

```bash
sudo launchctl stop com.apple.bootpd
```

จากนั้นตรวจอีกทีว่าพอร์ตว่างยัง:

```bash
sudo lsof -nP -i UDP:67
```

ถ้ายังเห็น `bootpd` กลับมานั่งเก้าอี้เหมือนเดิม อ่า… งั้นไปด่าน 3 ครับ

---

## ด่าน 3: ปิดจากรากด้วยการแก้ /etc/bootpd.plist

ถ้าอยากปิดให้ชัด ๆ ผมแก้ไฟล์คอนฟิกของ bootpd เลย ตัวนี้อยู่ที่ `/etc/bootpd.plist` ถ้าไฟล์ยังไม่มีก็สร้างใหม่ได้ครับ (สิทธิ์ต้องเป็น root)

ก่อนแก้ ผมสำรองไว้ก่อนเสมอ เผื่ออยากย้อนกลับ

```bash
sudo cp /etc/bootpd.plist /etc/bootpd.plist.bak 2>/dev/null || true
sudo nano /etc/bootpd.plist
```

ในไฟล์ ให้แน่ใจว่ามี (หรือแก้ให้เป็น) ประมาณนี้เพื่อ “ปิดสวิตช์” DHCP/BOOTP:

```xml
<plist version="1.0">
<dict>
  <key>dhcp_enabled</key>
  <array/>

  <key>bootp_enabled</key>
  <false/>

  <!-- ถ้ามี Subnets/Networks เป็นก้อน dict อยู่ ให้ลบทิ้งได้เลย เพื่อไม่ปล่อยเช่า IP -->
</dict>
</plist>
```

เซฟแล้วออก (Ctrl+O, Enter แล้ว Ctrl+X) ครับ

เชิงเทคนิค: `dhcp_enabled` เป็นรายชื่อ interface ที่เปิด DHCP ถ้าเป็น `<array/>` ว่าง ๆ ก็เท่ากับ “ไม่เปิดสัก interface” ส่วน `bootp_enabled` คือ BOOTP รุ่นพี่ของ DHCP ปิดไปด้วยจะชัวร์กว่า

---

## ด่าน 4: กันฟื้นคืนชีพ (unload/disable)

หลังแก้ไฟล์ ผมหยุดอีกรอบ แล้วถอดโหลด daemon เพื่อไม่ให้มัน pop กลับมาเองทันที

```bash
sudo launchctl stop com.apple.bootpd
sudo launchctl unload /System/Library/LaunchDaemons/bootps.plist
```

บน macOS รุ่นใหม่ ๆ (อ่า โดยเฉพาะตั้งแต่ Big Sur เป็นต้นมา) ผมชอบกด “ปิดถาวรระดับ launchd” ด้วย เพื่อกันกลับมาตอนบูต:

```bash
sudo launchctl disable system/com.apple.bootpd
```

อยากเปิดกลับก็:

```bash
sudo launchctl enable system/com.apple.bootpd
```

หมายเหตุ: คำสั่ง `unload` จะหยุดในรอบนั้น ๆ แต่ไม่ได้การันตีว่ารีบูตแล้วจะไม่กลับมา ส่วน `disable` จะบอก launchd ตรง ๆ ว่า “อย่าเรียกฉันตอนบูตนะ” ครับ

---

## ด่าน 5: ตรวจซ้ำ แล้วค่อยไปต่อ

เช็กอีกรอบ ถ้าเงียบ ๆ แปลว่าพอร์ต 67 ว่างแล้ว

```bash
sudo lsof -nP -i UDP:67
```

ถ้ายังเห็นโปรเซสจับพอร์ตอยู่ ให้ดู PID แล้วค่อยตัดสินใจอีกที (เคสที่ผมเคยเจอคือมี tool ทดสอบเก่า ๆ ยังค้างอยู่ใน background)

```bash
sudo lsof -nP -i UDP:67
sudo kill -9 <PID>
```

บางครั้งรีบูตเครื่องหนึ่งทีก็ช่วย “รีเซ็ตสนามรบ” ให้คลีนขึ้นครับ โดยเฉพาะหลังจาก `disable` แล้ว

---

## โน้ตจากสนามจริง: ข้อจำกัดและกับดักที่ผมเคยตก

- SIP และสิทธิ์ระบบ: เราไม่ได้ไปแก้ไฟล์ใน `/System/Library` นะครับ เราแก้ที่ `/etc/bootpd.plist` ซึ่งโอเค แต่คำสั่งบางอย่างอย่าง `unload/disable` ถ้าไม่มี `sudo` ก็จะทำไม่ผ่าน
- ไฟล์คอนฟิกไม่อยู่: ถ้า `/etc/bootpd.plist` ไม่เจอ ให้สร้างใหม่ตามตัวอย่างด้านบนได้เลย อย่าลืมสำรองถ้ามีไฟล์เดิม
- ชนกับ service อื่น: บางทีเป็นโปรแกรมทดสอบ DHCP เองที่ทำงานแบบ background ลืมปิด… อ่า เคยเป็นมาแล้วครับ ฮา ให้หาด้วย `lsof` แล้วจัดการเป็นรายตัว
- ผลข้างเคียงในเครือข่ายองค์กร: ถ้าเครื่องคุณเคยถูกตั้งให้ทำ Internet Sharing หรือ NetBoot ในแวดล้อมบางที่ การปิด bootpd อาจพ่วงผลกับฟีเจอร์เหล่านั้น ตรวจสอบ requirement ทีมงานก่อนครับ

---

## ย้อนกลับได้เสมอ (เผื่อหัวหน้าอยากให้เปิดใหม่)

- คืนค่าไฟล์คอนฟิกจากแบ็กอัพ (ถ้าสำรองไว้):

```bash
sudo test -f /etc/bootpd.plist.bak && sudo mv /etc/bootpd.plist.bak /etc/bootpd.plist
```

- เปิดบริการกลับมา:

```bash
sudo launchctl enable system/com.apple.bootpd
sudo launchctl load /System/Library/LaunchDaemons/bootps.plist
sudo launchctl start com.apple.bootpd
```

---

สรุปแบบเพื่อนเล่าให้เพื่อนฟัง: ผมหาว่าใครจับพอร์ต 67 ก่อน ถ้าคือ bootpd ก็หยุดมัน ปรับ `/etc/bootpd.plist` ให้ไม่ปล่อยเช่าอะไรเลย ปิด BOOTP ไปด้วย แล้วค่อย unload/disable กันฟื้น สุดท้ายเช็กอีกรอบ ถ้าเงียบก็ยิ้มได้ เออ… ง่ายกว่าที่คิดนิดนึงครับ พอร์ต 67 โล่งปุ๊บ ผมก็ไปปล่อย DHCP ของตัวเองต่อได้แบบไม่ต้องแย่งเก้าอี้กับใครแล้วครับ
