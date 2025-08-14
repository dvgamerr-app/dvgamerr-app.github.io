---
date: 2025-08-05
title: ChatGPT OpenSouce Model Free
description: >-
  GPT‑OSS เป็นชุดโมเดลที่เปิดน้ำหนักและโมเดลให้ดาวน์โหลดได้แบบฟรี เพื่อให้สามารถนำไปใช้ฟีเจอร์ reasoning, agentic tasks และการปรับแต่งง่าย ๆ ในระบบของคุณ
author: Kananek T.
oss: https://github.com/openai/gpt-oss
tags: [oss, AI, open-source, machine-learning, reasoning]
---

มี 2 รุ่นหลัก: **gpt‑oss‑120b** (117B พารามิเตอร์) เหมาะกับ GPU 80 GB เช่น NVIDIA H100 หรือ AMD MI300X และ **gpt‑oss‑20b** (21B พารามิเตอร์) ที่ใช้พลัง 16 GB GPU โดยเน้นให้ latency ต่ำกว่า

โมเดลทั้งหมดถูกฝึกด้วย _harmony response format_ จึงต้องส่งข้อความในรูปแบบนั้นเพื่อให้ป้อนเข้าโมเดลได้อย่างถูกต้อง

คุณสมบัติเด่น:

- เปิดแบบ Apache‑2.0, ป้องกันปัญหาลิขสิทธิ์และความเสี่ยงด้านสิทธิบัตร
- รองรับ chain‑of‑thought ครบถ้วน (ทำให้เข้าใจการคิดขั้นตอนของโมเดลได้)
- สามารถปรับระดับการ reasoning (low/medium/high) เพื่อให้ได้ประสิทธิภาพตาม latency ที่ต้องการ
- มี built‑in “tools” เช่น browser, Python, apply_patch เพื่อให้โมเดลสามารถทำงานเชิงปฏิบัติการได้
- ใช้ MXFP4 quantization สำหรับ MoE ทำให้ 120b สามารถรันบน GPU เดียว 80 GB ได้
- รองรับหลาย backend: Transformers, vLLM, Ollama, LM Studio รวมถึง reference implementations (PyTorch, Triton, Metal)

ขั้นตอนเริ่มต้นง่าย: `pip install gpt‑oss[torch]` แล้วโหลดโมเดลจาก Hugging Face ด้วย `hf download openai/gpt‑oss‑120b`

สำหรับอินเตอร์เฟส API: ใช้งาน vLLM (`vllm serve openai/gpt‑oss‑20b`) หรือ Ollama (`ollama run gpt‑oss:20b`) เพื่อเปิดเซิร์ฟเวอร์ REST

สรุปแล้ว GPT‑OSS เป็นตัวเลือกที่มีประสิทธิภาพและยืดหยุ่นสูงสำหรับผู้พัฒนา AI ที่ต้องการโมเดล reasoning แรงและฟังก์ชัน agentic โดยไม่ต้องกังวลเรื่องลิขสิทธิ์.

มาเริ่มลองใช้กันเลยดีกว่า

#### 1. ติดตั้ง Ollama (ถ้ายังไม่มี)

```bash
# macOS, Linux หรือ Windows (WSL)
curl -fsSL https://ollama.ai/install.sh | sh
```

หลังจากติดตั้งแล้วตรวจสอบเวอร์ชัน:

```bash
ollama --version   # แสดงเวอร์ชันล่าสุดของ Ollama
```

---

#### 2. ดึงโมเดล GPT‑OSS

> **หมายเหตุ**
>
> - `gpt‑oss:120b` – 12 B มุมมองสูง ต้อง GPU ขนาด 80 GB
> - `gpt‑oss:20b` – 20 B เหมาะกับเครื่องคอมพิวเตอร์ทั่วไป 16 GB+

```bash
# โมเดลระดับ 120b
ollama pull gpt-oss:120b

# โมเดลระดับ 20b
ollama pull gpt-oss:20b
```

---

#### 3. ลองใช้งานแบบ CLI

```bash
ollama run gpt-oss:20b
```

คุณจะเห็นหน้าต่างที่เปิดให้พิมพ์ประโยคได้เลย  
**ตัวอย่าง**: `Prove that √2 is irrational.`

---

#### 4. ใช้งานผ่าน API ด้วย `curl`

Ollama เปิด API REST บน `localhost:11434` โดยสามารถส่งคำขอแบบ Chat‑Completion ได้

##### 4‑1. ตัวอย่างคำขอ JSON

```bash
curl -X POST http://127.0.0.1:11434/api/chat \
    -H "Content-Type: application/json" \
    -d '{
          "model": "gpt-oss:20b",
          "messages": [
            {"role":"system","content":"You are a helpful assistant."},
            {"role":"user","content":"Prove that √2 is irrational."}
          ]
        }'
```

_ผลลัพธ์_ จะเป็นข้อความในรูปแบบ JSON ที่มีคีย์ `message` หรือ `content` ขึ้นอยู่กับเวอร์ชันของ Ollama

> **หมายเหตุ**
>
> - เมื่อใช้โมเดล 120b ต้องมั่นใจว่าเครื่องมี GPU ขนาด 80 GB และมีการตั้งค่า CUDA อย่างถูกต้อง
> - การตั้งค่า `stream:true` ช่วยให้คุณเห็นข้อความที่ส่งออกทีละชิ้น

---

ขอให้สนุกกับการสร้างโมเดล reasoning ที่ทรงพลังบนเครื่องของคุณ!
