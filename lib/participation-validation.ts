export const INVALID_RECEIPT_MESSAGE = `Ups! Parece que a imagem enviada não corresponde a um talão de compra.
Envia uma foto nítida do talão de compra.`

export const normalizeTelemovel = (value: string) => value.replace(/\D/g, '').slice(0, 9)

export const isValidTelemovel = (value: string) => /^\d{9}$/.test(value)