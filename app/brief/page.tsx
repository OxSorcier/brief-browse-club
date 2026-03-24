'use client'

import { useState, useEffect } from 'react'
import LanguageStep from '@/components/LanguageStep'
import QuestionStep from '@/components/QuestionStep'
import ConfirmationScreen from '@/components/ConfirmationScreen'
import { QUESTIONS, type Lang } from '@/lib/questions'

const STORAGE_KEY = 'bc-brief-answers'

interface SavedState {
  lang: Lang
  answers: string[]
  step: number
}

export default function BriefPage() {
  const [lang, setLang] = useState<Lang | null>(null)
  const [step, setStep] = useState(0) // 0 = first question
  const [answers, setAnswers] = useState<string[]>(Array(QUESTIONS.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const state: SavedState = JSON.parse(saved)
        setLang(state.lang)
        setAnswers(state.answers)
        setStep(state.step)
      }
    } catch {}
  }, [])

  // Save to localStorage on every answer change
  useEffect(() => {
    if (!lang) return
    try {
      const state: SavedState = { lang, answers, step }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {}
  }, [lang, answers, step])

  const handleLang = (l: Lang) => {
    setLang(l)
    setStep(0)
  }

  const handleAnswer = async (answer: string) => {
    const newAnswers = [...answers]
    newAnswers[step] = answer
    setAnswers(newAnswers)

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1)
      return
    }

    // Last question — submit
    setIsSubmitting(true)
    try {
      // Phase 3+4: map-brand then push-notion
      // For now: just mark as submitted
      await submitForm(newAnswers, lang!)
      localStorage.removeItem(STORAGE_KEY)
      setSubmitted(true)
    } catch (err) {
      console.error('Submit failed:', err)
      // Keep data in localStorage — user can retry
    } finally {
      setIsSubmitting(false)
    }
  }

  // Language not yet selected
  if (!lang) return <LanguageStep onSelect={handleLang} />

  // Submitted
  if (submitted) return <ConfirmationScreen lang={lang} />

  // Questions
  return (
    <QuestionStep
      key={step}
      question={QUESTIONS[step]}
      lang={lang}
      stepIndex={step}
      totalSteps={QUESTIONS.length}
      initialAnswer={answers[step]}
      isLast={step === QUESTIONS.length - 1}
      isSubmitting={isSubmitting}
      onAnswer={handleAnswer}
    />
  )
}

async function submitForm(answers: string[], lang: Lang) {
  // Phase 3: map brand stack chunks
  const mapRes = await fetch('/api/map-brand', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers, lang }),
  })
  if (!mapRes.ok) throw new Error('map-brand failed')
  const { chunks } = await mapRes.json()

  // Phase 4: push to Notion
  const pushRes = await fetch('/api/push-notion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers, chunks, lang }),
  })
  if (!pushRes.ok) throw new Error('push-notion failed')
}
