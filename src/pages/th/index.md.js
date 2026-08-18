import { renderResumeMarkdown } from '../../utils/renderResumeMarkdown'

export function GET() {
  return new Response(renderResumeMarkdown('th'), {
    headers: {
      'Content-Language': 'th',
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  })
}
