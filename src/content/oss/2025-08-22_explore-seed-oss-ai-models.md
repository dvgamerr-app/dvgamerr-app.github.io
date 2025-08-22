---
date: 2025-08-22T07:19:55.995Z
title: 'สำรวจ Seed-OSS โมเดล AI สุดล้ำจาก ByteDance'
description: >-
  "เรียนรู้การใช้โมเดล Seed-OSS ที่พัฒนาโดยทีม ByteDance Seed สู่การทดลองสร้างสรรค์ AI ใหม่ๆ"
author: Kananek T.
oss: https://github.com/ByteDance-Seed/seed-oss
tags: [oss,AI, SeedOSS, ByteDance, OpenSource, โมเดล]
---
<div align="center">
   <img src="https://github.com/user-attachments/assets/c42e675e-497c-4508-8bb9-093ad4d1f216" alt="Seed OSS Logo">
</div>

ลองมาทำความรู้จักกับ Seed-OSS โมเดล AI ที่พัฒนาโดยทีม ByteDance Seed กันดีกว่า! โมเดลนี้มีคุณสมบัติหลายอย่างที่น่าสนใจ ไม่ว่าจะเป็น การควบคุมความยาวของการคิด การเพิ่มพูนความสามารถในการวิเคราะห์ และความเข้ากันได้กับผู้พัฒนา

คุณสามารถเริ่มต้นการทดลองของคุณได้อย่างง่ายดาย เพียงแค่รันคำสั่งติดตั้ง:

```shell
pip install git+ssh://git@github.com/Fazziekey/transformers.git@seed-oss
```

เมื่อติดตั้งเสร็จแล้ว ลองทำการสร้างโมเดลง่ายๆ ด้วยโค้ดนี้:

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

model_name_or_path = "ByteDance-Seed/Seed-OSS-36B-Instruct"

tokenizer = AutoTokenizer.from_pretrained(model_name_or_path)
model = AutoModelForCausalLM.from_pretrained(model_name_or_path)

messages = [
    {"role": "user", "content": "ทำพาสต้าอย่างไร?"},
]

outputs = model.generate(tokenized_chat.to(model.device), max_new_tokens=2048)
```

ด้วย Seed-OSS คุณจะได้สร้างสรรค์คำตอบที่น่าประทับใจ แถมยังมีฟีเจอร์ควบคุมการคิดที่ยืดหยุ่น ไม่พลาดโอกาสทดลองและพัฒนา AI ไปกับเรา!  
👉 ดูข้อมูลเพิ่มเติมที่ [นี่](https://seed.bytedance.com/)
