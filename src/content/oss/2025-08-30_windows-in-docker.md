---
date: 2025-08-30T05:15:55.518Z
title: 'ลองรัน Windows ใน Docker แบบง่ายมาก'
description: >-
  "รัน Windows ใน Docker ง่ายและเร็ว เปิดเว็บติดตั้งอัตโนมัติ ปรับ CPU/RAM/ดิสก์ แชร์ไฟล์ และเชื่อมต่อ RDP ได้ทันที เหมาะทั้งลองเล่นและใช้งานจริง"
author: Kananek T.
oss: https://github.com/dockur/windows
tags: [oss, docker, windows, kvm, virtualization, devops, howto, tutorial]
---

![Windows in Docker](https://github.com/dockur/windows/raw/master/.github/logo.png)

วันนี้ลองเป็นนักทดลองซอฟต์แวร์กัน เป้าหมาย: เปิด Windows ในคอนเทนเนอร์ Docker แบบชิลๆ ไม่ต้องง้อ VM หนักเครื่อง แค่เตรียม Linux ที่รองรับ KVM จากนั้นเช็กให้พร้อม:

```bash
sudo apt install cpu-checker && sudo kvm-ok
```

ต่อไปเขียน docker-compose.yml สั้นๆ แล้วลุย:

```yaml
services:
  windows:
    image: dockurr/windows
    container_name: windows
    environment:
      VERSION: '11'
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

รันเลย:

```bash
docker compose up -d
```

เปิดเบราว์เซอร์ไปที่ http://127.0.0.1:8006 แล้วนั่งดูการติดตั้งอัตโนมัติ เมื่อเห็นเดสก์ท็อปก็พร้อมใช้ทันที อยากแรงขึ้นใส่ตัวแปรเพิ่มได้ เช่น:

```yaml
environment:
  RAM_SIZE: '8G'
  CPU_CORES: '4'
  DISK_SIZE: '256G'
```

แชร์ไฟล์กับโฮสต์ให้โฟลเดอร์โผล่บนเดสก์ท็อปชื่อ Shared:

```yaml
volumes:
  - ./example:/shared
```

ใช้งานจริงจังต่อผ่าน RDP ที่พอร์ต 3389 ผู้ใช้ Docker รหัส admin จะเลือกเวอร์ชันอื่นก็เปลี่ยน VERSION เป็น "10", "11l" หรือ URL ของ ISO ได้เลย รวมถึงปรับภาษา/คีย์บอร์ดด้วย LANGUAGE และ KEYBOARD พร้อมไหม? ไปลองกัน!
