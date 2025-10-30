---
date: 2025-10-30T05:03:26.379Z
title: 'ลอง Postgresus: แบ็กอัป PostgreSQL แบบ Self‑Hosted มี UI'
description: >-
  "ชวนลอง Postgresus เครื่องมือแบ็กอัป PostgreSQL แบบ self-hosted มี UI ตั้งเวลา เก็บบนโลคอลหรือคลาวด์ แจ้งเตือน และกู้คืนง่าย พร้อมวิธีติดตั้งรวดเร็วด้วยสคริปต์หรือ Docker."
author: Kananek T.
oss: https://github.com/RostislavDugin/postgresus
tags: [oss, postgres, postgresql, backup, docker, selfhosted, devops]
---

![Postgresus Dashboard](https://raw.githubusercontent.com/RostislavDugin/postgresus/refs/heads/main/assets/dashboard.svg)

วันนี้ขอลองเป็นนักทดลองซอฟต์แวร์กับ Postgresus เครื่องมือแบ็กอัป PostgreSQL ที่ติดตั้งเองบนเครื่องเรา มี UI ใช้ง่าย ตั้งเวลาได้ยืดหยุ่น สำรองลงโลคอลหรือคลาวด์ แถมมีแจ้งเตือนและกู้คืนได้คลิกเดียว

เริ่มทดลองแบบไวสุด (Linux):

```bash
autocmd
sudo apt-get install -y curl && \
sudo curl -sSL https://raw.githubusercontent.com/RostislavDugin/postgresus/refs/heads/main/install-postgresus.sh | sudo bash
```

หรือรันด้วย Docker แบบรวดเร็ว:

```bash
docker run -d \
  --name postgresus \
  -p 4005:4005 \
  -v ./postgresus-data:/postgresus-data \
  --restart unless-stopped \
  rostislavdugin/postgresus:latest
```

ชอบ Compose ก็ได้เช่นกัน:

```yaml
services:
  postgresus:
    image: rostislavdugin/postgresus:latest
    ports: ['4005:4005']
    volumes: ['./postgresus-data:/postgresus-data']
    restart: unless-stopped
```

วิธีใช้งานแบบมือไว:

- เปิด http://localhost:4005
- กด New Database ใส่ข้อมูลการเชื่อมต่อ
- ตั้ง Schedule เป็นรายชั่วโมง/รายวัน/รายสัปดาห์/รายเดือน
- เลือกที่เก็บ: Local, S3, R2, Google Drive, NAS ฯลฯ
- เปิดแจ้งเตือนผ่าน Email/Telegram/Slack หรือ Webhook ได้ตามชอบ
- กด Save แล้วปล่อยให้ระบบทำงานอัตโนมัติ

ทิปฉุกเฉิน: รีเซ็ตรหัสแอดมิน

```bash
docker exec -it postgresus ./main --new-password="YourNewSecurePassword123"
```
