import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { pushProspect } from '@/lib/notion-client'
import type { Lang } from '@/lib/questions'
import type { BrandChunks } from '@/lib/brand-mapper'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { answers, chunks, lang } = await req.json() as {
    answers: string[]
    chunks: BrandChunks
    lang: Lang
  }

  const pageId = await pushProspect(answers, chunks, lang)

  // Notify Erwan — non-blocking, failure doesn't break the form
  notifyErwan(answers, chunks, lang, pageId).catch((err) =>
    console.error('Resend notification failed:', err)
  )

  return NextResponse.json({ ok: true, pageId })
}

async function notifyErwan(
  answers: string[],
  chunks: BrandChunks,
  lang: Lang,
  pageId: string
) {
  const notionUrl = `https://notion.so/${pageId.replace(/-/g, '')}`
  const label = lang === 'fr' ? 'Nouveau prospect' : 'New prospect'
  const questions = lang === 'fr'
    ? ['État du projet', 'Ce qui ne fonctionne pas', 'Vision 6 mois', 'Équipe', 'Note pre-call']
    : ['Project status', "What's not working", '6-month vision', 'Team', 'Pre-call note']

  const answersHtml = questions
    .map((q, i) => `<p><strong>${q}</strong><br/>${answers[i] || '—'}</p>`)
    .join('')

  await resend.emails.send({
    from: 'brief@browse.club',
    to: 'erwan@browse.club',
    subject: `${label} — ${chunks.summary?.slice(0, 60) || 'brief.browse.club'}`,
    html: `
      <h2>${label}</h2>
      <p><strong>Résumé Claude :</strong><br/>${chunks.summary}</p>
      <hr/>
      ${answersHtml}
      <hr/>
      <p><a href="${notionUrl}">Voir dans Notion →</a></p>
    `,
  })
}
