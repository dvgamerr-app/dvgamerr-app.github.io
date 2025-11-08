---
date: 2025-11-08T07:42:46.898Z
title: 'ต่อ Claude Desktop กับ Bitkub ผ่าน MCP ภายใน 5 นาที'
description: >-
  "ติดตั้ง gokub-mcp เชื่อม Claude Desktop กับ Bitkub ผ่าน MCP ภายในไม่กี่นาที ตั้งค่า .env, โหมด SSE และทดลองเรียกเครื่องมือดูราคา/กระเป๋าแบบเรียลไทม์"
author: Kananek T.
oss: https://github.com/dvgamerr-app/gokub-mcp
tags: [oss,mcp, bitkub, go, crypto, trading, claude, sse]
---
![gokub-mcp](https://raw.githubusercontent.com/dvgamerr-app/gokub-mcp/main/docs/logo-ai.png)

วันนี้มาลองสวมบทนักทดลอง สร้างสะพานเชื่อม Claude Desktop เข้ากับ Bitkub ผ่าน MCP server ชื่อ gokub-mcp กัน ทำเสร็จแล้วให้ Claude ขอข้อมูลตลาด/กระเป๋าได้เองแบบเรียลไทม์

สิ่งที่ต้องมี
- Go 1.21+ และบัญชี Bitkub (มี API Key/Secret)

เริ่มติดตั้งอย่างไว
```bash
git clone https://github.com/dvgamerr-app/gokub-mcp.git
cd gokub-mcp
go mod download

# สร้าง .env
echo "BTK_APIKEY=your_api_key" > .env
echo "BTK_SECRET=your_secret_key" >> .env

# รันเซิร์ฟเวอร์ (พอร์ต 8080)
go run main.go
```

อยากเปลี่ยนพอร์ต
```bash
PORT=3000 go run main.go
```

ตั้งค่าให้ Claude Desktop คุยผ่าน SSE
- Windows: %APPDATA%\Claude\claude_desktop_config.json
- Mac: ~/Library/Application Support/Claude/claude_desktop_config.json
```json
{
  "mcpServers": {
    "bitkub": { "url": "http://localhost:8080/sse", "transport": "sse" }
  }
}
```

ลองใช้ทันที (ตัวอย่างเครื่องมือ)
- get_wallet_balance ดูยอดคงเหลือ
- get_ticker ดูราคาเรียลไทม์
- get_market_depth ดูออเดอร์บุ๊ก
- get_my_open_orders เช็คออเดอร์ค้าง
- get_symbols รายชื่อคู่เทรด

ทิปส์ความปลอดภัย
- เก็บ API keys ใน .env หรือ Environment Variables เท่านั้น
- ใช้สิทธิ์เท่าที่จำเป็น และทดสอบบนพอร์ตโลคอลก่อนขึ้นจริง

พร้อมแล้ว ให้ Claude เรียก get_ticker ของคู่ที่สนใจ แล้วดูการตอบสนองแบบสดๆ กันเลย!
