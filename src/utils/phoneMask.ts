/** Казахстан / РФ: 11 цифр, начиная с 7. Формат: +7 747 126 24 75 */
export function digitsOnly(phone: string): string {
  let digits = phone.replace(/\D/g, '')
  if (digits.startsWith('8')) digits = `7${digits.slice(1)}`
  if (digits.length > 0 && !digits.startsWith('7')) digits = `7${digits}`
  return digits.slice(0, 11)
}

export function formatPhone(phone: string): string {
  const digits = digitsOnly(phone)
  if (!digits) return ''
  if (digits.length === 1) return '+7'

  const rest = digits.slice(1)
  let formatted = '+7'
  if (rest.length > 0) formatted += ` ${rest.slice(0, 3)}`
  if (rest.length > 3) formatted += ` ${rest.slice(3, 6)}`
  if (rest.length > 6) formatted += ` ${rest.slice(6, 8)}`
  if (rest.length > 8) formatted += ` ${rest.slice(8, 10)}`
  return formatted
}

export function isPhoneComplete(phone: string): boolean {
  return digitsOnly(phone).length === 11
}
