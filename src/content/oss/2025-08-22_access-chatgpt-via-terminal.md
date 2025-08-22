---
date: 2025-08-22T03:37:33.995Z
title: 'ทำความรู้จัก Chatbang: ใช้งาน ChatGPT ผ่าน Terminal ได้ง่ายๆ'
description: >-
  "เรียนรู้การใช้งาน Chatbang เพื่อเข้าถึง ChatGPT จาก Terminal โดยไม่ต้องใช้ API Key"
author: Kananek T.
oss: https://github.com/ahmedhosssam/chatbang
tags: [oss,ChatGPT, Tool, CLI, Terminal, Installation]
---
`Chatbang` เป็นเครื่องมือที่ออกแบบมาให้คุณสามารถเข้าถึง ChatGPT ได้จาก Terminal โดยไม่จำเป็นต้องใช้ API Key  

![Chatbang](./assets/chatbang.png)  

## การติดตั้ง  
คุณสามารถติดตั้งบน Linux ได้ง่ายๆ ด้วยคำสั่งต่อไปนี้:  
```bash  
curl -L https://github.com/ahmedhosssam/chatbang/releases/latest/download/chatbang -o chatbang  
chmod +x chatbang  
sudo mv chatbang /usr/bin/chatbang  
```  
หรือถ้าต้องการติดตั้งจาก source:  
```bash  
git clone git@github.com:ahmedhosssam/chatbang.git  
cd chatbang  
go mod tidy  
go build main.go  
sudo mv main /usr/bin/chatbang  
```  
## การตั้งค่า  
ก่อนอื่นให้เรียกสั่ง `chatbang --config` เพื่อสร้างไฟล์กำหนดค่าที่ `$HOME/.config/chatbang`  
ต้องแน่ใจว่าคุณมีเบราว์เซอร์ที่รองรับ Chromium ติดตั้งอยู่ พร้อมทำการเปลี่ยนเส้นทางไปยังเบราว์เซอร์ที่ชื่นชอบในไฟล์กำหนดค่า  
`$HOME/.config/chatbang/chatbang`  
เมื่อตั้งค่าเสร็จแล้ว เพียงพิมพ์ `chatbang` ใน Terminal เพื่อเริ่มต้นใช้งาน!  
```bash  
chatbang  
```  
ตอนนี้คุณก็สามารถทดลองใช้ ChatGPT ผ่าน Terminal ได้อย่างง่ายดายแล้ว! ไม่ต้องรอนาน ลุยกันเลย!
