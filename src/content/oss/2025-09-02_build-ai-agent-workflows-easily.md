---
date: 2025-09-02T05:26:21.177Z
title: 'ทดลองสร้างแอป AI ง่ายๆ ด้วย Sim'
description: >-
  "เรียนรู้วิธีสร้างและติดตั้ง AI agent workflows ด้วย Sim ในเวลาสั้นๆ"
author: Kananek T.
oss: https://github.com/simstudioai/sim
tags: [oss,AI, Sim, Workflow, OpenSource, Development]
---
<p align="center">
  <a href="https://sim.ai" target="_blank" rel="noopener noreferrer">
    <img src="apps/sim/public/logo/reverse/text/large.png" alt="Sim Logo" width="500"/>
  </a>
</p>

<p align="center">สร้างและปล่อย AI agent workflows ได้ในเวลาไม่กี่นาที!</p>

Sim เป็นแพลตฟอร์ม Open-source ที่ช่วยให้คุณสามารถสร้างแนวทางการทำงานของ AI ได้อย่างรวดเร็วและง่ายดาย ไม่ว่าคุณจะเป็นนักพัฒนาที่ต้องการทดลองหรือผู้ที่สนใจใน AI ก็สามารถลงมือทำตามได้ง่ายๆ!

## การเริ่มต้นใช้ Sim

### ตัวอย่างการใช้งาน - Self-hosted ใช้ Docker Compose
1. เริ่มต้นด้วยการ Clone โครงการ
   ```bash
   git clone https://github.com/simstudioai/sim.git
   cd sim
   # เริ่มใช้งาน Sim
   docker compose -f docker-compose.prod.yml up -d
   ```
2. จากนั้นเข้าถึงที่อยู่ [http://localhost:3000/](http://localhost:3000/)

### การใช้กับโมเดล AI ในเครื่อง
ถ้าคุณไม่ต้องการใช้ API ภายนอก สามารถใช้โมเดล AI ในเครื่องได้ด้วยการใช้งาน Ollama:
```bash
# เริ่มต้นด้วยการสนับสนุน GPU
docker compose -f docker-compose.ollama.yml --profile setup up -d
```

หลังจากดาวน์โหลดโมเดลเสร็จแล้ว สามารถเข้าไปที่ [http://localhost:3000](http://localhost:3000) และเริ่มทดลองสร้าง AI Agent ของคุณได้!

ด้วยการสร้าง AI workflow ที่ Sim ให้มา คุณสามารถสร้างแนวทางเฉพาะที่ตอบโจทย์การทำงานของคุณได้อย่างง่ายดาย ลองเลย!
