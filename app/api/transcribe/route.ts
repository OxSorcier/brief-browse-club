import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const lang = (formData.get('lang') as string | null) ?? 'fr'

  // Validate: ~0.5s of audio is ~8KB minimum
  if (!file || file.size < 1000) {
    return NextResponse.json({ error: 'too_short' }, { status: 400 })
  }

  const groqFd = new FormData()
  groqFd.append('file', file)
  groqFd.append('model', 'whisper-large-v3-turbo')
  groqFd.append('language', lang)
  groqFd.append('response_format', 'json')

  const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: groqFd,
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Groq transcription error:', err)
    return NextResponse.json({ error: 'groq_failed' }, { status: 500 })
  }

  const data = await res.json()
  return NextResponse.json({ transcript: data.text ?? '' })
}
