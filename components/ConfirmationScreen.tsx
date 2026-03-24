'use client'

import type { Lang } from '@/lib/questions'
import { CONFIRMATION } from '@/lib/questions'

export default function ConfirmationScreen({ lang }: { lang: Lang }) {
  const copy = CONFIRMATION[lang]
  return (
    <div className="flex flex-col min-h-[100dvh] px-8 pt-16 gap-10">
      <div className="w-12 h-12 rounded-full bg-[#2929FF] flex items-center justify-center">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-[1.75rem] font-normal text-[#0A0A0A] leading-snug tracking-[-0.01em]">
          {copy.headline}
        </p>
        <p className="text-base text-[#767676] leading-relaxed">{copy.sub}</p>
      </div>
    </div>
  )
}
