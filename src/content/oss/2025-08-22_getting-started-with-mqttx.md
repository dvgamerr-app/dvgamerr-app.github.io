---
date: 2025-08-22T03:41:27.047Z
title: 'เริ่มต้นทดลองใช้งาน MQTTX เครื่องมือ MQTT ที่ทรงพลัง'
description: >-
  "บทความนี้จะแนะนำวิธีการเริ่มต้นใช้งาน MQTTX สำหรับการทดสอบการเชื่อมต่อ MQTT."
author: Kananek T.
oss: https://github.com/emqx/MQTTX
tags: [oss,MQTT, MQTTX, IoT, Client, Software]
---
<img src="./assets/mqttx-logo.png" width="480" alt="MQTTX Logo" />

MQTTX เป็นเครื่องมือที่ช่วยให้คุณสามารถทดสอบการเชื่อมต่อ MQTT ได้อย่างง่ายดาย ด้วยอินเตอร์เฟซที่คล้ายแชท ช่วยให้การทำงานต่างๆ เป็นเรื่องง่าย ไม่ว่าจะเป็นการเชื่อมต่อ, ส่งข้อมูล หรือการสมัครรับข้อมูล คุณสามารถสร้างการเชื่อมต่อ MQTT พร้อมกันหลายๆ ตัวได้

### การติดตั้ง MQTTX

1. **MacOS**: ดาวน์โหลดได้ที่ [Mac App Store](https://apps.apple.com/us/app/mqttx/id1514074565?mt=12) หรือใช้ Homebrew:
   ```shell
   brew install --cask mqttx
   ```

2. **Linux**: ใช้ Snap หรือ Flathub เพื่อดาวน์โหลด:
   [Snap Store](https://snapcraft.io/mqttx) / [Flathub](https://flathub.org/apps/details/com.emqx.MQTTX)

3. **Windows**: ดาวน์โหลดจาก [GitHub Releases](https://github.com/emqx/MQTTX/releases) 

### การใช้งานเบื้องต้น

1. เตรียม MQTT Broker: ถ้าไม่ต้องการติดตั้งเองสามารถใช้ Broker สาธารณะจาก EMQX:
   - IP: `broker.emqx.io`
   - TCP Port: `1883`

2. กดปุ่ม `+` เพื่อเพิ่มการเชื่อมต่อใหม่ กรอกข้อมูลที่จำเป็นแล้วกด `Connect`

3. หลังจากเชื่อมต่อสำเร็จสามารถทดสอบการส่งและรับข้อมูลผ่าน MQTT ได้แล้ว

### สนุกไปกับ MQTTX

ด้วยคุณสมบัติที่ใช้ง่ายและการออกแบบที่สะดวก MQTTX จึงเป็นเครื่องมือที่เหมาะสำหรับทั้งนักพัฒนาใหม่และผู้มีประสบการณ์ ถ้าต้องการความช่วยเหลือหรือพูดคุยก็สามารถเข้าร่วมกลุ่มใน [Discord](https://discord.gg/xYGf3fQnES) ได้! 

ให้ MQTTX เป็นเพื่อนคู่คิดในการทดลองของคุณ!  

