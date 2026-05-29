import { ChatSidebar } from "@/components/chat/ChatSidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="-m-8 flex min-h-[calc(100vh-0px)] lg:-m-10">
      <ChatSidebar />
      <div className="flex min-w-0 flex-1 flex-col p-6 lg:p-8">{children}</div>
    </div>
  );
}
