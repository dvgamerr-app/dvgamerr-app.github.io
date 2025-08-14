---
date: 2025-08-14
title: 'เล่นกับ uwu: เปลี่ยนภาษาเป็นคำสั่ง Shell'
description: >-
  "เรียนรู้การใช้ uwu เพื่อแปลงภาษาธรรมชาติเป็นคำสั่ง Shell ได้ง่ายๆ"
author: Kananek T.
oss: repoUrl
tags: [oss, software, CLI, AI, utility, command]
---

หากคุณเคยพบว่าการเขียนคำสั่ง Shell ทำให้รู้สึกยุ่งยาก ลองมาทำความรู้จักกับ uwu กันดีกว่า! 🐾 uwu เป็นเครื่องมือ CLI ที่ช่วยแปลงภาษาธรรมชาติให้กลายเป็นคำสั่ง Shell ได้อย่างรวดเร็วและง่ายดาย เพียงแค่พิมพ์คำอธิบายว่าคุณต้องการทำอะไร แล้ว uwu จะสร้างคำสั่งให้คุณ!

### การติดตั้ง uwu

แค่ไม่กี่ขั้นตอน!

1. **โคลน Repository**

```bash
git clone https://github.com/context-labs/uwu.git
cd uwu
```

2. **ติดตั้ง Dependencies**  
   ติดตั้ง Bun ก่อน แล้วรันคำสั่ง

```bash
bun install
bun run build
```

3. **ตั้งค่า Binary**  
   เปลี่ยนสิทธิ์และย้ายไปไว้ใน PATH

```bash
chmod +x dist/uwu-cli
mv dist/uwu-cli /usr/local/bin/uwu-cli
```

4. **การตั้งค่า**  
   uwu จะสร้างไฟล์ `config.json` โดยอัตโนมัติเมื่อรันครั้งแรก สามารถตั้งค่า AI provider ได้ตามต้องการ!

### การใช้งาน uwu

แค่พิมพ์คำสั่งนี้ในเทอร์มินัล:

```bash
uwu generate a new ssh key called uwu-keyand add it to the ssh agent
```

คุณจะเห็นคำสั่งที่สร้างขึ้นใน Input line ของเซสชัน Shell ของคุณ! แค่กด **Enter** เพื่อรันหรือแก้ไขก่อนก็ได้

เมื่อลองใช้ uwu แล้ว คุณอาจจะรู้ว่ามันทำให้การเขียนคำสั่ง Shell ง่ายและสนุกขึ้นมาก!
