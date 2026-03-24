'use client'

import { useState } from 'react'
import type { Lang, Question } from '@/lib/questions'
import { UI } from '@/lib/questions'
import VoiceRecorder from '@/components/VoiceRecorder'

interface Props {
  question: Question
  lang: Lang
  stepIndex: number
  totalSteps: number
  initialAnswer?: string
  isLast: boolean
  isSubmitting: boolean
  onAnswer: (answer: string) => void
}

export default function QuestionStep({
  question,
  lang,
  stepIndex,
  initialAnswer = '',
  isLast,
  isSubmitting,
  onAnswer,
}: Props) {
  const [value, setValue] = useState(initialAnswer)
  const ui = UI[lang]
  const text = question[lang]
  const placeholder = question.placeholder?.[lang] ?? ''
  const isRadio = question.type === 'radio'

  const canContinue = isRadio ? value !== '' : true

  return (
    <div className="flex flex-col min-h-[100dvh]">
      {/* Header */}
      <div className="px-8 pt-14">
        <div className="w-8 h-0.5 bg-[#2929FF] mb-10" />
        <p className="text-[1.65rem] font-normal text-[#0A0A0A] leading-snug tracking-[-0.01em]">
          {text}
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 px-8 pt-8 flex flex-col justify-end gap-4 pb-4">
        {isRadio && question.options ? (
          <div className="flex flex-col gap-3">
            {question.options.map((opt) => (
              <button
                key={opt[lang]}
                onClick={() => setValue(opt[lang])}
                className={`w-full h-14 border text-sm font-medium tracking-wide transition-colors ${
                  value === opt[lang]
                    ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white'
                    : 'border-[#E8E8E8] text-[#0A0A0A] hover:border-[#0A0A0A]'
                }`}
              >
                {opt[lang]}
              </button>
            ))}
          </div>
        ) : (
          <>
            <VoiceRecorder lang={lang} onTranscript={(text) => setValue(text)} />

            {/* Divider */}
            <div className="flex items-center gap-3 text-xs text-[#767676] uppercase tracking-widest">
              <div className="flex-1 h-px bg-[#E8E8E8]" />
              {ui.orDivider}
              <div className="flex-1 h-px bg-[#E8E8E8]" />
            </div>

            {/* Textarea */}
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              rows={3}
              className="w-full border-b border-[#E8E8E8] resize-none bg-transparent text-base text-[#0A0A0A] placeholder-[#AAAAAA] py-2 outline-none leading-relaxed"
            />
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-8 pb-11 pt-4">
        <button
          onClick={() => onAnswer(value)}
          disabled={!canContinue || isSubmitting}
          className="w-full h-14 bg-[#0A0A0A] text-white text-sm font-semibold tracking-wide disabled:opacity-30 transition-opacity"
        >
          {isSubmitting ? ui.sending : isLast ? ui.submit : ui.next}
        </button>
      </div>
    </div>
  )
}
