export type QuestionType = 'textarea' | 'radio'
export type Lang = 'fr' | 'en'

export interface Question {
  id: number
  fr: string
  en: string
  frVoice?: string
  enVoice?: string
  type: QuestionType
  options?: { fr: string; en: string }[]
  placeholder?: { fr: string; en: string }
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    fr: 'Où en est le projet en ce moment\u00a0?',
    en: 'Where does the project stand right now?',
    type: 'textarea',
  },
  {
    id: 2,
    fr: "Qu'est-ce qui ne fonctionne pas encore\u00a0? Ce que vous voyez clairement, ou ce que vous sentez sans pouvoir le nommer.",
    en: "What's not working yet? What you can see clearly, or what you feel but can't quite name.",
    type: 'textarea',
    placeholder: { fr: 'Écrivez librement.', en: 'Write freely.' },
  },
  {
    id: 3,
    fr: "Dans six mois, si ça s'est bien passé\u00a0: à quoi ça ressemble\u00a0?",
    en: 'Six months from now, if things went well — what does that look like?',
    type: 'textarea',
  },
  {
    id: 4,
    fr: "Vous êtes seul sur ce projet, ou il y a une équipe\u00a0?",
    en: 'Are you working on this alone, or is there a team?',
    frVoice: 'Vous travaillez seul ou en équipe\u00a0?',
    enVoice: 'Are you working alone or with a team?',
    type: 'radio',
    options: [
      { fr: 'Seul', en: 'Solo' },
      { fr: 'En équipe', en: 'With a team' },
    ],
  },
  {
    id: 5,
    fr: "Ce que vous voulez qu'Erwan sache avant qu'on se parle.",
    en: 'What you want Erwan to know before the call.',
    type: 'textarea',
    placeholder: { fr: 'Écrivez librement.', en: 'Write freely.' },
  },
]

export const CONFIRMATION = {
  fr: { headline: "Reçu. Erwan lira ça avant l'appel.", sub: "Plus qu'à se parler." },
  en: { headline: 'Received. Erwan will read this before the call.', sub: 'See you soon.' },
}

export const UI = {
  fr: {
    langPrompt: 'Choisissez votre langue.',
    voiceHint: 'Appuyez pour répondre à la voix',
    recordingHint: 'En écoute — appuyez pour arrêter',
    orDivider: 'ou',
    next: 'Continuer',
    submit: 'Envoyer',
    sending: 'Envoi en cours...',
  },
  en: {
    langPrompt: 'Choose your language.',
    voiceHint: 'Tap to answer with your voice',
    recordingHint: 'Listening — tap to stop',
    orDivider: 'or',
    next: 'Continue',
    submit: 'Submit',
    sending: 'Sending...',
  },
}
