const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = process.env.GROQ_VISION_MODEL?.trim() || 'meta-llama/llama-4-scout-17b-16e-instruct'

type ReceiptValidationResult = {
  isValid: boolean
  status: 'validated' | 'unavailable'
}

type GroqChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
}

type ParsedValidationPayload = {
  isReceipt?: boolean
  documentType?: string
  confidence?: number
}

const extractJsonObject = (value: string) => {
  const fencedMatch = value.match(/```(?:json)?\s*([\s\S]*?)```/i)

  if (fencedMatch?.[1]) {
    return fencedMatch[1]
  }

  const firstBrace = value.indexOf('{')
  const lastBrace = value.lastIndexOf('}')

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error('missing_json_payload')
  }

  return value.slice(firstBrace, lastBrace + 1)
}

export async function validateReceiptImage(file: File): Promise<ReceiptValidationResult> {
  const groqApiKey = process.env.GROQ_API_KEY?.trim()

  if (!groqApiKey) {
    console.error('GROQ_API_KEY is not configured')
    return { isValid: false, status: 'unavailable' }
  }

  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const dataUrl = `data:${file.type};base64,${fileBuffer.toString('base64')}`
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          temperature: 0,
          messages: [
            {
              role: 'system',
              content:
                'Avalias imagens de talões e faturas. Responde sempre com JSON simples. Considera válida apenas uma imagem que mostre claramente um talão de compra ou uma fatura real.',
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text:
                    'Analisa a imagem e responde apenas com JSON no formato {"isReceipt": boolean, "documentType": "receipt" | "invoice" | "other", "confidence": number}. isReceipt só pode ser true se a imagem mostrar claramente um talão ou fatura.',
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: dataUrl,
                  },
                },
              ],
            },
          ],
        }),
        signal: controller.signal,
      })

      if (!response.ok) {
        const errorBody = await response.text()
        throw new Error(`groq_request_failed:${response.status}:${errorBody}`)
      }

      const payload = (await response.json()) as GroqChatCompletionResponse
      const messageContent = payload.choices?.[0]?.message?.content

      if (!messageContent) {
        throw new Error('missing_groq_response_content')
      }

      const parsedContent = JSON.parse(extractJsonObject(messageContent)) as ParsedValidationPayload
      const normalizedDocumentType = typeof parsedContent.documentType === 'string'
        ? parsedContent.documentType.toLowerCase()
        : 'other'
      const confidence = typeof parsedContent.confidence === 'number' ? parsedContent.confidence : 0
      const isValid = parsedContent.isReceipt === true && (normalizedDocumentType === 'receipt' || normalizedDocumentType === 'invoice') && confidence >= 0.6

      return {
        isValid,
        status: 'validated',
      }
    } finally {
      clearTimeout(timeout)
    }
  } catch (error) {
    console.error('Receipt AI validation failed:', error)
    return { isValid: false, status: 'unavailable' }
  }
}