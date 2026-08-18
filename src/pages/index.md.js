import { renderResumeMarkdown } from '../utils/renderResumeMarkdown'

export function GET() {
  return new Response(renderResumeMarkdown('en'), {
    headers: {
      'Content-Language': 'en',
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  })
}
