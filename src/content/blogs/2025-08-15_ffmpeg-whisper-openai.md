---
date: 2025-08-15
title: 'FFmpeg 8.0 ผนวกฟิลเตอร์ Whisper จาก OpenAI สู่ระบบแปลงเสียงเป็นข้อความ'
description: 'FFmpeg 8.0 เพิ่มฟิลเตอร์ Whisper สำหรับถอดความเสียงเป็นข้อความ รองรับหลายภาษา ใช้งานในเครื่อง พร้อมส่งออกเป็น SRT และ JSON'
author: Kananek T.
tags: [ffmpeg, whisper, speech-to-text, transcription, openai]
---

FFmpeg กำลังจะออกเวอร์ชัน 8.0 และฟีเจอร์ใหม่ที่เพิ่งรวมเข้ามาคือ **ฟิลเตอร์ Whisper** สำหรับทำ **Automatic Speech Recognition (ASR)** หรือแปลงเสียงเป็นข้อความโดยอัตโนมัติ

Whisper เป็นโมเดลแปลงเสียงเป็นข้อความจาก OpenAI เทรนด้วยข้อมูลเสียงจำนวนมาก มีความสามารถสูง

การเปิดใช้ใน FFmpeg ทำได้โดยใช้ `--enable-whisper` เมื่อระบบติดตั้งไลบรารี `whisper.cpp` แล้ว

ฟังก์ชันเพิ่มขึ้นคือ:

- รองรับ **GPU acceleration**
- ปรับแต่ง parameter ได้หลายรูปแบบ
- แปลงเสียงแล้วสร้างไฟล์ **SRT** หรือส่งผลลัพธ์ในรูปแบบ **JSON** ไปยังบริการ HTTP ได้

อีกเวอร์ชันหนึ่งเขียนว่า Whisper filter ทำงาน **ในเครื่อง (local)** ไม่ต้องอัปโหลดเสียงไปยังคลาวด์ รองรับภาษาได้หลายภาษาโดยอัตโนมัติ แต่สามารถกำหนดภาษาด้วยมือได้ และเปิดใช้ GPU ได้เป็นค่า default

สำนักข่าว Neowin ยังเสริมว่า ฟิลเตอร์ `af_whisper` สามารถเลือกโมเดลภาษา กำหนดรูปแบบไฟล์ผลลัพธ์ (text, SRT, JSON) รองรับไฟล์เสียงและสตรีมแบบเรียลไทม์ และสามารถใช้ Voice Activation Detection (VAD) เพิ่มความแม่นยำ
สรุปข้อดี:

- ลดขั้นตอนแปลงเสียงหลายขั้นด้วยเครื่องมือแยกหลายตัว
- รองรับทั้งไฟล์ที่บันทึกแล้วและสตรีมสด
- ง่ายต่อการสร้าง subtitle หรือสคริปต์จากวิดีโอและเสียงโดยอัตโนมัติ

FFmpeg 8.0 ยังรวมคุณสมบัติอื่น เช่น:

- การเร่งด้วย Vulkan (AV1 encoding, VP9 decoding)
- การปรับปรุงประสิทธิภาพ CPU และ AVX-512
- ตัวแปลงสัญญาณใหม่ มัลติมีเดียอื่น ๆ&#x20;

เวอร์ชัน 8.0 คาดว่าจะเปิดตัวในอีกไม่กี่สัปดาห์จากวันที่ 13 สิงหาคม 2025&#x20;

---

ตัวอย่างคำสั่ง FFmpeg ใช้ Whisper filter

```bash
ffmpeg -i input.mp3 -af "whisper=model=base:lang=th" -f srt subtitles.srt
```

หรือบันทึกผลเป็น JSON

```bash
ffmpeg -i input.wav -af "whisper=model=small:lang=th:output=json" output.json
```

สตรีมเสียงแล้วถอดความแบบเรียลไทม์

```bash
ffmpeg -f alsa -i default -af "whisper=model=base:lang=th" -f srt -
```
