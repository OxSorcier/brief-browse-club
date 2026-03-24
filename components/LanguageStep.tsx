'use client'

import type { Lang } from '@/lib/questions'

interface Props {
  onSelect: (lang: Lang) => void
}

export default function LanguageStep({ onSelect }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] px-8 gap-12">
      <span className="text-[#2929FF] text-xs font-bold tracking-[0.12em] uppercase">
        Browse Club
      </span>

      <p className="text-[#767676] text-sm text-center leading-relaxed">
        Choisissez votre langue.
        <br />
        Choose your language.
      </p>

      <div className="flex gap-4 w-full">
        <button
          onClick={() => onSelect('fr')}
          className="flex-1 h-16 border border-[#E8E8E8] text-[#0A0A0A] text-xl font-bold tracking-wide hover:border-[#2929FF] hover:text-[#2929FF] transition-colors"
        >
          FR
        </button>
        <button
          onClick={() => onSelect('en')}
          className="flex-1 h-16 border border-[#E8E8E8] text-[#0A0A0A] text-xl font-bold tracking-wide hover:border-[#2929FF] hover:text-[#2929FF] transition-colors"
        >
          EN
        </button>
      </div>
    </div>
  )
}
