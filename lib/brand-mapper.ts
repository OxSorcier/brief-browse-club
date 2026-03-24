import Anthropic from '@anthropic-ai/sdk'
import type { Lang } from '@/lib/questions'

const client = new Anthropic()

export interface BrandChunks {
  project_context: string   // Q1: current state
  problem_statement: string // Q2: what's not working
  objectives_6mo: string    // Q3: vision in 6 months
  team_structure: string    // Q4: solo or team
  pre_call_note: string     // Q5: what Erwan should know
  summary: string           // Claude synthesis for the call
}

const QUESTIONS = {
  fr: [
    "Où en est le projet en ce moment ?",
    "Qu'est-ce qui ne fonctionne pas encore ?",
    "Dans six mois, si ça s'est bien passé : à quoi ça ressemble ?",
    "Vous êtes seul sur ce projet, ou il y a une équipe ?",
    "Ce que vous voulez qu'Erwan sache avant l'appel.",
  ],
  en: [
    "Where does the project stand right now?",
    "What's not working yet?",
    "Six months from now, if things went well — what does that look like?",
    "Are you working on this alone, or is there a team?",
    "What you want Erwan to know before the call.",
  ],
}

const PROMPT = {
  fr: (answers: string) => `Tu es l'assistant de Browse Club. Un prospect vient de remplir un formulaire pre-call.

Voici ses réponses :
${answers}

Extrait les informations clés sous forme de JSON structuré. Réponds UNIQUEMENT avec du JSON valide, sans markdown.

Format exact :
{
  "project_context": "état actuel du projet en 2-3 phrases",
  "problem_statement": "ce qui bloque ou ne fonctionne pas encore",
  "objectives_6mo": "vision à 6 mois, résultats attendus",
  "team_structure": "solo ou équipe, composition si connue",
  "pre_call_note": "ce que le prospect veut qu'Erwan sache",
  "summary": "synthèse du prospect en 3-4 phrases pour préparer l'appel"
}`,
  en: (answers: string) => `You are Browse Club's assistant. A prospect just filled out a pre-call form.

Their answers:
${answers}

Extract key information as structured JSON. Respond ONLY with valid JSON, no markdown.

Exact format:
{
  "project_context": "current project state in 2-3 sentences",
  "problem_statement": "what's blocking or not working yet",
  "objectives_6mo": "6-month vision, expected outcomes",
  "team_structure": "solo or team, composition if known",
  "pre_call_note": "what the prospect wants Erwan to know",
  "summary": "prospect summary in 3-4 sentences to prep for the call"
}`,
}

export async function mapBrandChunks(answers: string[], lang: Lang): Promise<BrandChunks> {
  const questions = QUESTIONS[lang]
  const formatted = questions
    .map((q, i) => `Q${i + 1}: ${q}\nA: ${answers[i] || '(pas de réponse)'}`)
    .join('\n\n')

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: PROMPT[lang](formatted) }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    // Strip potential markdown code fences if model wraps JSON
    const clean = text.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '').trim()
    return JSON.parse(clean) as BrandChunks
  } catch {
    // Fallback: preserve raw answers
    return {
      project_context: answers[0] || '',
      problem_statement: answers[1] || '',
      objectives_6mo: answers[2] || '',
      team_structure: answers[3] || '',
      pre_call_note: answers[4] || '',
      summary: '',
    }
  }
}
