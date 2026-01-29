export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.length !== 10) return phone;

  const area = digits.slice(0, 3);
  const prefix = digits.slice(3, 6);
  const line = digits.slice(6);

  return `(${area}) ${prefix}-${line}`;
}
