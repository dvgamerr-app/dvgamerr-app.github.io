---
date: 2025-09-02T05:26:21.177Z
title: 'ลอง Sim: สร้าง-ดีพลอย AI Agents ภายในไม่กี่นาที'
description: >-
  "ลอง Sim เพื่อสร้างและดีพลอย AI agent workflows ได้ภายในไม่กี่นาที ทั้งแบบคลาวด์และเซลฟ์โฮสต์ พร้อมตัวเลือกใช้โมเดลโลคอลผ่าน Ollama."
author: Kananek T.
oss: https://github.com/simstudioai/sim
tags: [oss, AI, agents, workflow, open-source, Docker, Ollama]
---

![Sim demo](https://raw.githubusercontent.com/simstudioai/sim/HEAD/apps/sim/public/static/demo.gif)

อยากลองเป็นนักทดลองเอเจนต์ AI แบบไวๆ มาลอง Sim แพลตฟอร์มโอเพนซอร์สสำหรับสร้างและดีพลอยเวิร์กโฟลว์เอเจนต์กัน

เริ่มไวสุด (คลาวด์)

- เข้า sim.ai แล้วสร้าง Flow แรก ลากบล็อก LLM/Tool/HTTP ต่อสาย กด Run ทันที

โหมดเซลฟ์โฮสต์ (เร็วและง่าย)

- ต้องมี Docker รันอยู่
- ทดลองทันที: `npx simstudio` แล้วเปิด http://localhost:3000 (เปลี่ยนพอร์ตได้ด้วย `--port 4000`)
- โหมดโปรดักชัน: `git clone https://github.com/simstudioai/sim.git && cd sim && docker compose -f docker-compose.prod.yml up -d`

ใช้โมเดลโลคอล (ไม่พึ่ง API ภายนอก) ด้วย Ollama

- GPU/เริ่มต้น: `docker compose -f docker-compose.ollama.yml --profile setup up -d`
- เพิ่มโมเดล: `docker compose -f docker-compose.ollama.yml exec ollama ollama pull llama3.1:8b`

ทิปส์พร้อมลองจริง

- ต้องการ Copilot บนเซลฟ์โฮสต์: สร้างคีย์ที่ Settings → Copilot จากนั้นใส่ `COPILOT_API_KEY` ใน apps/sim/.env
- ถ้าอยาก dev เต็มสูบ ลอง VS Code Dev Containers แล้วรัน `bun run dev:full`

ถึงเวลาเล่น: ต่อ Input → LLM → Tool → Output แล้วกด Run ดูผลแบบเรียลไทม์ สนุกและปรับแต่งได้ตามใจ!
