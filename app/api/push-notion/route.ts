import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { answers, chunks, lang } = await req.json()

  // TODO Phase 4: create Notion page in Prospects DB
  console.log('push-notion stub', { answers, chunks, lang })

  return NextResponse.json({ ok: true })
}
