export function generateChatTitle(firstMessage: string): string {
  const text = firstMessage.trim().replace(/\s+/g, " ");
  if (!text) return "New chat";
  if (text.length <= 48) return text;
  return `${text.slice(0, 45)}…`;
}
