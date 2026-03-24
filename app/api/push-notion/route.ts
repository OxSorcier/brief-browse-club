import { NextRequest, NextResponse } from 'next/server'
import { pushProspect } from '@/lib/notion-client'
import type { Lang } from '@/lib/questions'
import type { BrandChunks } from '@/lib/brand-mapper'

export async function POST(req: NextRequest) {
  const { answers, chunks, lang } = await req.json() as {
    answers: string[]
    chunks: BrandChunks
    lang: Lang
  }

  const pageId = await pushProspect(answers, chunks, lang)
  return NextResponse.json({ ok: true, pageId })
}
