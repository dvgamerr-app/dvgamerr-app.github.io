---
date: 2025-08-22T06:11:20.850Z
title: 'ทดลอง AIRI: เพื่อน AI เล่นเกมได้'
description: >-
  "ลอง AIRI แบบนักทดลองซอฟต์แวร์: ตั้งค่าเร็ว รันเว็บ/เดสก์ท็อป คุยเสียง เล่น Minecraft/Factorio เชื่อม Discord/Telegram และปรับแต่ง Live2D/VRM ได้ง่าย"
author: Kananek T.
oss: https://github.com/moeru-ai/airi
tags: [oss, AIRI, AI, VTuber, WebGPU, Tauri, Voice, Minecraft, Factorio, selfhosted]
---

<picture>
  <source width="100%" srcset="https://raw.githubusercontent.com/moeru-ai/airi/main/docs/content/public/banner-dark-1280x640.avif" media="(prefers-color-scheme: dark)" />
  <source width="100%" srcset="https://raw.githubusercontent.com/moeru-ai/airi/main/docs/content/public/banner-light-1280x640.avif" media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)" />
  <img width="250" src="https://raw.githubusercontent.com/moeru-ai/airi/main/docs/content/public/banner-light-1280x640.avif" />
</picture>

วันนี้เรามาลอง AIRI โอเพ่นซอร์ส “cyber waifu/husbando” ที่คุยสด เล่นเกม และรันได้ทั้งเว็บ/เดสก์ท็อป ในสไตล์นักทดลองซอฟต์แวร์หน้าใหม่ กันแบบเร็วๆ

สิ่งที่ต้องมี

- Node.js + pnpm
- เดสก์ท็อปมี GPU (NVIDIA/Apple) จะเร่งได้ดีขึ้น

เริ่มต้น (เวอร์ชันเว็บ)

1. เปิดเทอร์มินัล

```shell
pnpm i
pnpm dev
```

2. เปิดเบราว์เซอร์ไปที่ localhost ที่แจ้งในคอนโซล

เดสก์ท็อป (Tamagotchi)

```shell
pnpm dev:tamagotchi
```

หรือใช้ Nix

```shell
nix run github:moeru-ai/airi
```

ทดลองฟีเจอร์เหมือนแล็บส่วนตัว

- เปิดไมค์แล้วคุยเสียงแบบเรียลไทม์ (VAD+STT+TTS)
- โหลดโมเดล Live2D/VRM เห็นกระพริบตา มองตาม อนิเมชันไหลลื่น
- เชื่อม Discord/Telegram เพื่อแชทในห้องจริง
- โหมดเล่นเกม: ให้ AIRI เข้า Minecraft หรือ Factorio ได้ (เตรียมเซิร์ฟเวอร์ให้พร้อม)

ทิปปรับแต่ง

- เน้นแรง: ใช้เดสก์ท็อปเพื่อเปิด CUDA/Metal
- เน้นพกพา: ติดตั้งเป็น PWA บนมือถือ
- สายทดลอง: ลองเปิดปลั๊กอิน/หน่วยความจำในเบราว์เซอร์

พร้อมอัญเชิญ “วิญญาณดิจิทัล” ตัวแรกของคุณหรือยัง? กดรัน แล้วให้ AIRI พูด เดิน เล่น และเรียนรู้ไปกับคุณเลย!
