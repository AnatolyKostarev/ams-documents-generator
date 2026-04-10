'use client'

import { useMemo, useState } from 'react'
import type { DocumentData } from '@/types'

type Mode = 'filled' | 'template'
type Step = 'form' | 'generating' | 'preview' | 'error'

interface DocumentWidgetProps {
  document: DocumentData
}

export default function DocumentWidget({ document }: DocumentWidgetProps) {
  const [mode, setMode] = useState<Mode>('filled')
  const [step, setStep] = useState<Step>('form')
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [fields, setFields] = useState<Record<string, string>>({})

  const documentId = useMemo(
    () => `${document.category.slug}/${document.slug}`,
    [document.category.slug, document.slug],
  )

  const onFieldChange = (id: string, value: string) => {
    setFields((prev) => ({ ...prev, [id]: value }))
  }

  const generate = async () => {
    setStep('generating')
    setError('')
    try {
      const generateRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          mode,
          fields,
        }),
      })

      if (!generateRes.ok) throw new Error('Не удалось сгенерировать документ')
      const generated = (await generateRes.json()) as {
        success: boolean
        documentText: string
        sessionId: string
      }

      setText(generated.documentText)

      if (mode === 'template') {
        const pdfRes = await fetch('/api/pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: generated.sessionId }),
        })
        if (!pdfRes.ok) throw new Error('Не удалось подготовить файл')

        const blob = await pdfRes.blob()
        const href = URL.createObjectURL(blob)
        const link = window.document.createElement('a')
        link.href = href
        link.download = `${document.slug}.txt`
        link.click()
        URL.revokeObjectURL(href)
      }

      setStep('preview')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
      setStep('error')
    }
  }

  return (
    <section className='mt-6 rounded-lg border border-black/10 p-4'>
      <div className='mb-4 flex gap-2'>
        <button
          className={`rounded px-3 py-2 text-sm ${
            mode === 'filled' ? 'bg-black text-white' : 'border'
          }`}
          onClick={() => setMode('filled')}
          type='button'
        >
          Заполнить документ
        </button>
        <button
          className={`rounded px-3 py-2 text-sm ${
            mode === 'template' ? 'bg-black text-white' : 'border'
          }`}
          onClick={() => setMode('template')}
          type='button'
        >
          Получить шаблон
        </button>
      </div>

      {mode === 'filled' ? (
        <div className='grid gap-3 sm:grid-cols-2'>
          {document.formFields.map((field) => (
            <label key={field.id} className='flex flex-col gap-1 text-sm'>
              <span>{field.label}</span>
              <input
                className='rounded border px-3 py-2'
                style={{ fontSize: 16 }}
                type={field.type === 'number' ? 'number' : 'text'}
                value={fields[field.id] ?? ''}
                placeholder={field.placeholder}
                onChange={(e) => onFieldChange(field.id, e.target.value)}
              />
            </label>
          ))}
        </div>
      ) : (
        <p className='text-sm text-black/70'>
          Шаблон будет сформирован с подстановкой подчеркиваний вместо значений.
        </p>
      )}

      <p className='mt-4 text-xs text-black/60'>
        Данные используются только для генерации документа и не хранятся
      </p>

      <button
        className='mt-3 rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-60'
        disabled={step === 'generating'}
        onClick={generate}
        type='button'
      >
        {step === 'generating'
          ? 'Генерация...'
          : mode === 'template'
            ? 'Получить шаблон'
            : 'Сгенерировать документ'}
      </button>

      {step === 'preview' && text ? (
        <pre className='mt-4 whitespace-pre-wrap rounded bg-black/[.03] p-3 text-sm'>
          {text}
        </pre>
      ) : null}

      {step === 'error' ? (
        <p className='mt-3 text-sm text-red-600'>{error}</p>
      ) : null}
    </section>
  )
}
