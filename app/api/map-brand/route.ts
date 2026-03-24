import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { answers, lang } = await req.json()

  // TODO Phase 3: call Claude API to map Brand Stack chunks
  // For now return a stub so the UI flow works
  const chunks = {
    about: answers[0] ?? '',
    blocking: answers[1] ?? '',
    vision: answers[2] ?? '',
    team: answers[3] ?? '',
    context: answers[4] ?? '',
    lang,
  }

  return NextResponse.json({ chunks })
}
