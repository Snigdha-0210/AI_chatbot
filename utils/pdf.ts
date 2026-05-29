import pdf from "pdf-parse";

export async function extractPdfText(buffer: Buffer): Promise<string> {
  const { text } = await pdf(buffer);
  const cleaned = text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();

  if (!cleaned || cleaned.length < 20) {
    throw new Error(
      "Could not extract enough text. The PDF may be empty or image-only."
    );
  }
  return cleaned;
}
