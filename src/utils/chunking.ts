export function chunkText(text: string, maxTokens = 1000, overlap = 120): string[] {
  const size = Math.max(200, Math.floor(maxTokens * 4)); // chars approx
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += size - overlap) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}
