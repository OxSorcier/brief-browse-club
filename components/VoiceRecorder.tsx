'use client'

import { useState, useRef, useEffect } from 'react'

type RecordState = 'idle' | 'recording' | 'transcribing'

interface Props {
  lang: string
  onTranscript: (text: string) => void
}

export default function VoiceRecorder({ lang, onTranscript }: Props) {
  const [supported, setSupported] = useState<boolean | null>(null)
  const [state, setState] = useState<RecordState>('idle')
  const [error, setError] = useState<string | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    setSupported(
      typeof MediaRecorder !== 'undefined' &&
      !!navigator.mediaDevices?.getUserMedia
    )
  }, [])

  if (!supported) return null

  const start = async () => {
    setError(null)
    chunksRef.current = []

    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      // Permission denied — textarea is always available, silent fail
      return
    }

    const recorder = new MediaRecorder(stream)
    recorderRef.current = recorder
    startTimeRef.current = Date.now()

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }

    recorder.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop())

      const duration = Date.now() - startTimeRef.current
      if (duration < 500) {
        setError(lang === 'fr' ? 'Trop court, réessayez.' : 'Too short, try again.')
        setState('idle')
        return
      }

      setState('transcribing')
      try {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const fd = new FormData()
        fd.append('file', blob, 'recording.webm')
        fd.append('lang', lang)

        const res = await fetch('/api/transcribe', { method: 'POST', body: fd })
        if (!res.ok) throw new Error('transcription failed')
        const { transcript } = await res.json()
        onTranscript(transcript ?? '')
      } catch {
        setError(lang === 'fr' ? 'Transcription échouée.' : 'Transcription failed.')
      } finally {
        setState('idle')
      }
    }

    recorder.start()
    setState('recording')
  }

  const stop = () => {
    recorderRef.current?.stop()
  }

  const label = error
    ? error
    : state === 'recording'
    ? lang === 'fr' ? 'Appuyez pour arrêter' : 'Tap to stop'
    : state === 'transcribing'
    ? lang === 'fr' ? 'Transcription...' : 'Transcribing...'
    : lang === 'fr' ? 'Appuyez pour parler' : 'Tap to speak'

  return (
    <div className="flex flex-col items-center gap-5 py-8">
      <button
        onClick={state === 'idle' ? start : state === 'recording' ? stop : undefined}
        disabled={state === 'transcribing'}
        className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
          state === 'recording'
            ? 'bg-[#FF2929] shadow-[0_4px_24px_rgba(255,41,41,0.28)]'
            : state === 'transcribing'
            ? 'bg-[#E8E8E8]'
            : 'bg-[#2929FF] shadow-[0_4px_24px_rgba(41,41,255,0.28)]'
        }`}
      >
        {state === 'transcribing' ? (
          <div className="w-6 h-6 border-2 border-[#2929FF] border-t-transparent rounded-full animate-spin" />
        ) : state === 'recording' ? (
          <span className="w-6 h-6 rounded-sm bg-white" />
        ) : (
          <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path
              d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"
              strokeWidth="2"
              stroke="white"
              fill="none"
            />
          </svg>
        )}
      </button>

      <span className={`text-xs ${error ? 'text-[#FF2929]' : 'text-[#767676]'}`}>
        {label}
      </span>
    </div>
  )
}
