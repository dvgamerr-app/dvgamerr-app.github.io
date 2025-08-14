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

จากข้อมูลที่ได้รับ ให้เขียนบทความสำหรับให้ผู้อื่นลงทำตามได้อย่างน่าสนใจ 
ความยาว: 100 - 300 คำ  
โทน: เป็นกันเองที่เหมือนกำลังเป็น นักทดลอง software ใหม่ๆ 
รูปแบบ: Markdown

Responses in JSON format only.
`

const invokeBlogsContent = async (data) => {
  // สร้าง Schema ด้วย Zod สำหรับ validation
  const TechNewsSchema = z.object({
    author: z.string().describe('Name of the writer'),
    content: z.string().describe('Blog content displayed in markdown format.'),
    date: z.string().describe('Publisher date format: YYYY-MM-DD'),
    description: z.string().describe('Short description of content (max 50 token)'),
    oss: z.url(z.string()).describe('URL from github'),
    tags: z.array(z.string()).describe('URL from github'),
    title: z.string().describe('Title name (max 30 token)'),
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
    logger.fatal({ content, error: error.message || 'invalid_json' })
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

console.log(res)
