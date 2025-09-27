// Utility for redacting Personally Identifiable Information (PII)
export function redactPII(text: string): string {
  // Redact phone numbers (Ecuador format, etc.)
  text = text.replace(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '[PHONE]');
  // Redact emails
  text = text.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]');
  // Redact potential license plates (Ecuador format: ABC-1234)
  text = text.replace(/\b[A-Z]{3}-\d{4}\b/g, '[PLATE]');
  // Redact cedula (Ecuador ID: 10 digits)
  text = text.replace(/\b\d{10}\b/g, '[ID]');
  // Add more patterns as needed
  return text;
}