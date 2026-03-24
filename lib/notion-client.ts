import { Client } from '@notionhq/client'
import type { Lang } from '@/lib/questions'
import type { BrandChunks } from '@/lib/brand-mapper'

const notion = new Client({ auth: process.env.NOTION_API_KEY })

export async function pushProspect(
  answers: string[],
  chunks: BrandChunks,
  lang: Lang
): Promise<string> {
  const dbId = process.env.NOTION_PROSPECTS_DB_ID
  if (!dbId) throw new Error('NOTION_PROSPECTS_DB_ID not set')

  const date = new Date().toISOString().split('T')[0]
  const title = chunks.summary
    ? chunks.summary.slice(0, 80)
    : `Prospect — ${date}`

  const page = await notion.pages.create({
    parent: { database_id: dbId },
    properties: {
      Name: {
        title: [{ text: { content: title } }],
      },
      Language: {
        select: { name: lang.toUpperCase() },
      },
      Date: {
        date: { start: date },
      },
      Team: {
        select: { name: chunks.team_structure ? 'Team' : 'Solo' },
      },
    },
    children: [
      heading('Résumé pré-call'),
      paragraph(chunks.summary),
      divider(),
      heading('Q1 — État du projet'),
      paragraph(answers[0]),
      heading('Q2 — Ce qui ne fonctionne pas'),
      paragraph(answers[1]),
      heading('Q3 — Vision à 6 mois'),
      paragraph(answers[2]),
      heading('Q4 — Équipe'),
      paragraph(answers[3]),
      heading("Q5 — Ce qu'Erwan doit savoir"),
      paragraph(answers[4]),
      divider(),
      heading('Brand Stack — Extraction initiale'),
      paragraph(`Contexte projet : ${chunks.project_context}`),
      paragraph(`Problème : ${chunks.problem_statement}`),
      paragraph(`Objectifs : ${chunks.objectives_6mo}`),
      paragraph(`Équipe : ${chunks.team_structure}`),
      paragraph(`Note pre-call : ${chunks.pre_call_note}`),
    ],
  })

  return page.id
}

// ─── Block helpers ────────────────────────────────────────────────────────────

function heading(text: string) {
  return {
    object: 'block' as const,
    type: 'heading_2' as const,
    heading_2: {
      rich_text: [{ type: 'text' as const, text: { content: text } }],
    },
  }
}

function paragraph(text: string) {
  return {
    object: 'block' as const,
    type: 'paragraph' as const,
    paragraph: {
      rich_text: [{ type: 'text' as const, text: { content: text || '—' } }],
    },
  }
}

function divider() {
  return { object: 'block' as const, type: 'divider' as const, divider: {} }
}
