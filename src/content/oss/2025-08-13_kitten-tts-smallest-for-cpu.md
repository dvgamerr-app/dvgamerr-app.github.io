---
date: 2025-08-13
title: Kitten-TTS เป็นโมเดล TTS แบบโอเพนซอร์สที่เล็กแต่ทรงพลัง
description: |
  ติดตั้งง่าย ใช้งานสะดวก และช่วยให้คุณสร้างโปรเจกต์เสียงพูดได้แม้ไม่มี GPU
  เหมาะทั้งสำหรับการทดลองและการใช้งานจริงบนอุปกรณ์ขนาดเล็กอย่าง Raspberry Pi หรือแม้กระทั่งแล็ปท็อปเครื่องเก่า
author: Kananek T.
oss: https://github.com/KittenML/KittenTTS
tags:
  [
    'oss',
    'tts',
    'texttospeech',
    'ai',
    'machinelearning',
    'deeplearning',
    'speechsynthesis',
    'kittentts',
    'opensource',
    'python',
    'cpu',
    'offlinetts',
    'voicegeneration',
    'raspberrypi',
    'edgeai',
    'smallmodel',
    'lowresource',
    'audioprocessing',
    'nlp',
  ]
---

โมเดล TTS ขนาดเล็กที่รันได้บน CPU

คุณเคยอยากให้คอมพูดได้ แต่ติดตรงที่ต้องใช้ GPU หรือเครื่องแรงๆ ไหม?  
วันนี้เรามี Kitten-TTS โมเดล Text-to-Speech (TTS) ขนาดจิ๋ว แต่เสียงดีพอตัว แถมรันบน CPU ได้สบายๆ  
เหมาะมากสำหรับคนที่อยากทำโปรเจกต์เสียงพูด โดยไม่ต้องลงทุนซื้อการ์ดจอแพง

---

## ทำไม Kitten-TTS ถึงน่าสนใจ

- **เล็กมาก** แค่ 15 ล้านพารามิเตอร์ และไฟล์โมเดลไม่ถึง 25 MB
- **ไม่ง้อ GPU** รันบน CPU ธรรมดาก็ได้
- **เร็ว** สร้างเสียงได้ทันที แม้บนเครื่องสเปกต่ำ
- **ใช้ได้ออฟไลน์** เหมาะกับงานที่ต้องการความเป็นส่วนตัว หรืออยู่ในพื้นที่เน็ตไม่เสถียร

---

## แปลงข้อความเป็นเสียงได้ง่ายๆ ด้วย Kitten-TTS

### 1. ติดตั้ง

```bash
pip install https://github.com/KittenML/KittenTTS/releases/download/0.1/kittentts-0.1.0-py3-none-any.whl
```

### 2. เขียนโค้ดให้พูด

```python
from kittentts import KittenTTS
import soundfile as sf

# โหลดโมเดลขนาด nano
m = KittenTTS("KittenML/kitten-tts-nano-0.1")

# แปลงข้อความเป็นเสียง
audio = m.generate("Hello, this is Kitten-TTS speaking from your CPU!")

# บันทึกไฟล์เสียง
sf.write('output.wav', audio, 24000)
```

### เอาไปทำอะไรได้บ้าง

- แอปช่วยอ่านข่าวหรือบทความ
- ผู้ช่วยเสมือน (Virtual Assistant) บนอุปกรณ์ IoT
- เครื่องมือช่วยผู้พิการทางสายตา
- ระบบประกาศอัตโนมัติในร้านหรือโรงงาน
- แอปสอนภาษา
