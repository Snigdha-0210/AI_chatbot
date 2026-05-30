import { ChatSidebar } from "@/components/chat/ChatSidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="-mx-6 -mb-6 -mt-6 flex min-h-[calc(100vh-3.5rem)] lg:-mx-8 lg:-mb-8 lg:-mt-8 xl:-mx-10 xl:-mb-10 xl:-mt-10 lg:min-h-screen">
      <ChatSidebar />
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
