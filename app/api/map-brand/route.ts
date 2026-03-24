import { NextRequest, NextResponse } from 'next/server'
import { mapBrandChunks } from '@/lib/brand-mapper'

export async function POST(req: NextRequest) {
  const { answers, lang } = await req.json()
  const chunks = await mapBrandChunks(answers, lang)
  return NextResponse.json({ chunks })
}
