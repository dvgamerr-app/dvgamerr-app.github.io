---
date: 2025-08-30T05:15:55.518Z
title: 'ทดลองติดตั้ง Windows ใน Docker Container ง่ายๆ!'
description: >-
  "เรียนรู้วิธีการติดตั้ง Windows ภายใน Docker ด้วยขั้นตอนง่ายๆ ที่ใครๆ ก็ทำตามได้!"
author: Kananek T.
oss: https://github.com/dockur/windows
tags: [oss,Docker, Windows, Container, Setup, Tutorial]
---
# Windows ใน Docker Container

![](https://github.com/dockur/windows/raw/master/.github/logo.png)

การทดลองติดตั้ง Windows ภายใน Docker นั้นไม่ยากเลย! คุณสามารถสร้าง Windows environment เพื่อการพัฒนา ทดลอง หรือเรียนรู้อย่างง่ายดาย ผ่าน Docker Container ตามขั้นตอนต่อไปนี้:

## คุณสมบัติเด่น ✨
- ISO downloader
- KVM acceleration
- Web-based viewer

## ขั้นตอนการตั้งค่า 🐳

### 1. ใช้ Docker Compose:
สร้างไฟล์ `docker-compose.yml` และเพิ่มโค้ดดังนี้:
```yaml
services:
  windows:
    image: dockurr/windows
    container_name: windows
    environment:
      VERSION: "11"
    devices:
      - /dev/kvm
      - /dev/net/tun
    cap_add:
      - NET_ADMIN
    ports:
      - 8006:8006
      - 3389:3389/tcp
      - 3389:3389/udp
    volumes:
      - ./windows:/storage
    restart: always
    stop_grace_period: 2m
```

### 2. เริ่มต้น Container:
ใช้คำสั่งต่อไปนี้ใน Terminal:
```bash
docker-compose up -d
```

### 3. เข้าสู่ระบบ Windows:
เชื่อมต่อไปที่ [http://127.0.0.1:8006/](http://127.0.0.1:8006/) เพื่อเริ่มการติดตั้ง ระบบจะทำการติดตั้ง Windows โดยอัตโนมัติ!

## สถาปัตยกรรมที่ยืดหยุ่น
คุณสามารถปรับเปลี่ยน `VERSION` เพื่อติดตั้ง Windows รุ่นต่างๆ เช่น Windows 10, 11 หรือแม้แต่ Windows Server!

## สรุป
เป็นวิธีที่สะดวกและรวดเร็วในการทดลอง Windows ใน Docker Container หวังว่าคุณจะสนุกกับการทดลองติดตั้ง!

💻  ทดลองสิ่งใหม่ๆ ได้แล้ววันนี้!
