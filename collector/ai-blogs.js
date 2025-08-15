import dayjs from 'dayjs'
import OpenAI from 'openai'
import pino from 'pino'
import { z } from 'zod'

const logger = pino({ level: 'trace' })
const client = new OpenAI({
  apiKey: Bun.env.OPENAI_API_KEY,
})

const json_schema = (name, object) => ({
  json_schema: { name, schema: z.toJSONSchema(object) },
  type: 'json_schema',
})

const PROMPT = `
จากข้อมูลที่ได้รับ ให้เขียนบทความสำหรับให้ผู้อื่นลงทำตามได้อย่างน่าสนใจ ที่เหมือนกำลังเป็น นักทดลอง software ใหม่ๆ และถ้ามีรูปเอามาแสดงไว้ในช่วงแรกๆ สักรูปด้วย, ไม่เขียนอ้างอิง และ title ใน content อีกรอบ, ไม่ต้องทักทาย,responses in JSON format only.

ความยาว: 100 - 300 คำ  
โทน: เป็นกันเอง สั้นๆ เข้าใจง่าย
ภาษา: ไทย
`

const invokeBlogsContent = async (data) => {
  // สร้าง Schema ด้วย Zod สำหรับ validation
  const TechNewsSchema = z.object({
    content: z.string().describe('Blog engaging content displayed in markdown format.'),
    description: z.string().describe('Short description of content (max 40 word) (require)'),
    shortname: z.string().describe('Engaging English Title relate of content (max 12 word) (require)'),
    tags: z.array(z.string()).describe('Related tags, one word each (min 5 tags) (require)'),
    title: z.string().describe('Engaging title name (max 20 word) (require)'),
  })

  const res = await client.chat.completions.create({
    messages: [
      {
        content: PROMPT,
        role: 'system',
      },
      { content: data, role: 'user' },
    ],
    model: Bun.env.OPENAI_API_MODEL,
    response_format: json_schema('TechNewsSchema', TechNewsSchema),
  })

  const content = res.choices?.[0]?.message?.content ?? '{}'
  try {
    const parsed = JSON.parse(content)
    return TechNewsSchema.parse(parsed) // Validate with Zod
  } catch (error) {
    console.log(JSON.stringify(content, null, 2))
    throw new Error(error.message || 'invalid_json')
  }
}

logger.info('Github Reading...')

const fetchGithubRepo = async (url) => {
  const r = await fetch(url.replace('https://github.com/', 'https://api.github.com/repos/'), {
    headers: { Accept: 'application/vnd.github+json' },
  })
  if (r.ok) {
    return await r.json()
  }
  return { error: r }
}

const fetchReadme = async (url) => {
  const r = await fetch(url.replace('https://github.com/', 'https://api.github.com/repos/') + '/readme', {
    headers: { Accept: 'application/vnd.github+json' },
  })
  if (r.ok) {
    const data = await r.json()
    if (data && data.content) {
      return Buffer.from(data.content, 'base64').toString('utf-8')
    }
  }
  return ''
}

const checkLink = z.url(z.string())
const repoUrl = checkLink.parse(Bun.argv[2])
const repo = await fetchGithubRepo(repoUrl)

const readme = await fetchReadme(repoUrl)
const content = `
name: ${repo.full_name.split('/')[1]}
desc: ${repo.description}
detail:
${readme}
`

logger.info('Invoke AI...')

const res = await invokeBlogsContent(content)

logger.info('Writer...')
console.log(JSON.stringify(res, null, 2))
const today = dayjs()
const path = Bun.file(
  `./src/content/oss/${today.format('YYYY-MM-DD')}_${res.shortname.toLowerCase().replaceAll(/[\W]/gi, '-').replaceAll('--', '-')}.md`,
)
await Bun.write(
  path,
  `---
date: ${today.toISOString()}
title: '${res.title}'
description: >-
  "${res.description}"
author: Kananek T.
oss: ${repoUrl}
tags: [oss,${res.tags.join(', ')}]
---
${res.content}
`,
)

logger.info('Done')
