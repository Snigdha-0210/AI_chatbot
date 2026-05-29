import { ChatInterface } from "@/components/chat/ChatInterface";

export default function ChatByIdPage({
  params,
}: {
  params: { id: string };
}) {
  return <ChatInterface chatId={params.id} />;
}
