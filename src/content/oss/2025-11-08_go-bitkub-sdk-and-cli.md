---
date: 2025-11-08T07:43:23.137Z
title: 'ลองเล่น go-bitkub: Go SDK + CLI สำหรับ Bitkub'
description: >-
  "ลองเล่น go-bitkub SDK/CLI สำหรับ Bitkub API รองรับ V3/V4 ดึงราคา เทรด และสตรีมเรียลไทม์ได้ในไม่กี่นาที พร้อมโค้ดตัวอย่างเริ่มต้นเร็ว"
author: Kananek T.
oss: https://github.com/dvgamerr-app/go-bitkub
tags: [oss,go, bitkub, sdk, crypto, trading, websocket, cli, api]
---
![](https://raw.githubusercontent.com/dvgamerr-app/go-bitkub/HEAD/docs/example.png)

วันนี้มาลองเป็นนักทดลองซอฟต์แวร์กับ go-bitkub กัน! Go SDK + CLI สำหรับ Bitkub API ที่รองรับ V3/V4 แบบ type-safe มีทั้งดึงข้อมูลตลาด เทรด กระเป๋า และสตรีมเรียลไทม์ครบจบ

เริ่มเร็วใน 5 นาที
- ติดตั้ง CLI:
  ```bash
  go install github.com/dvgamerr-app/go-bitkub/cmd/bitkub@latest
  ```
- ทดลองดูราคา:
  ```bash
  bitkub market ticker btc_thb
  bitkub market ticker --format json
  ```
- สตรีมเรียลไทม์:
  ```bash
  bitkub stream ticker thb_btc -t
  bitkub --format jsonl stream trade thb_btc -n 2
  ```
- ใช้ endpoint ที่ต้องเซ็นด้วยคีย์:
  ```bash
  export BTK_APIKEY="your_key"
  export BTK_SECRET="your_secret"
  bitkub market balances
  ```

ลองโค้ด Go สั้นๆ:
```go
package main
import (
  "log"
  "github.com/dvgamerr-app/go-bitkub/bitkub"
  "github.com/dvgamerr-app/go-bitkub/market"
)
func main(){
  bitkub.Initlizer() // ใช้ BTK_APIKEY/BTK_SECRET จาก env
  w, err := market.GetWallet(); if err != nil { log.Fatal(err) }
  log.Printf("%+v", w)
}
```

จุดเด่นที่น่าลอง: CLI สวยด้วย zerolog, output ได้ทั้ง JSON/JSONL/Text, keyset pagination สำหรับออเดอร์, WebSocket auto-reconnect และชุดฟีเจอร์ Crypto V4 พร้อมใช้งาน แนวตั้งค่าไม่ยาก ไม่ commit คีย์ขึ้น git แล้วลุยได้เลย!
