import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAdminDb } from "@/utils/firebase-admin";
import { COLLECTIONS } from "@/utils/constants";
import { saveChat } from "@/utils/firestore-server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("API HIT: /api/chat", body);

    const message = body.message as string;
    const userId = body.userId as string;
    const chatId = body.chatId as string | undefined;
    const history = body.history || [];

    if (!message?.trim()) {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "GEMINI_API_KEY is not configured" }, { status: 500 });
    }

    // Fetch user context from Firebase
    let userContextStr = "No data available.";
    
    try {
      const { db } = await import("@/lib/firebase");
      const { doc, getDoc, collection, query, where, orderBy, limit, getDocs } = await import("firebase/firestore");
      
      const userSnap = await getDoc(doc(db, COLLECTIONS.users, userId));
      const progressSnap = await getDoc(doc(db, 'progress', userId));
      
      const resumesQuery = query(
        collection(db, COLLECTIONS.resumes), 
        where("userId", "==", userId)
      );
      const resumesSnap = await getDocs(resumesQuery);

      const userData = userSnap.exists() ? userSnap.data() : {};
      const progressData = progressSnap.exists() ? progressSnap.data() : {};
      
      // Memory sort to bypass index
      const sortedResumes = resumesSnap.docs.map(d => d.data());
      sortedResumes.sort((a,b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      const latestResume = sortedResumes.length > 0 ? sortedResumes[0] : null;

      userContextStr = `
- Career Goal: ${progressData.selectedRole || "Not specified"}
- Roadmap Progress: ${progressData.completedRoadmapIds?.length || 0} items completed
- Coding Progress: ${progressData.solvedCodingIds?.length || 0} questions solved
- Latest ATS Score: ${latestResume ? latestResume.score : "No scans yet"}
      `;
    } catch (e) {
      console.error("Failed to fetch user context", e);
    }

    const systemPrompt = `
You are CampusCopilot AI, a dedicated career mentor for university students. 
Your responsibilities:
- Help students choose careers.
- Explain technologies.
- Suggest learning paths.
- Recommend projects.
- Guide interview preparation.
- Explain ATS issues.
- Improve resumes.

Always provide structured responses using Markdown.
Prefer practical, actionable advice. Focus on student career growth.

CURRENT STUDENT CONTEXT:
${userContextStr}

If data is missing (e.g. ATS score), state clearly "No ATS data found" instead of making assumptions.
    `;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction: systemPrompt });

    // Convert history format to Gemini format
    const formattedHistory = history.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const chatSession = model.startChat({ history: formattedHistory });
    const result = await chatSession.sendMessage(message);
    const replyContent = result.response.text();

    const newMessages = [
      ...history,
      { role: "user", content: message },
      { role: "assistant", content: replyContent }
    ];

    // Save to Firebase
    let savedChatId = chatId;
    try {
      savedChatId = await saveChat(userId, chatId, newMessages, message);
    } catch (e) {
      console.error("Failed to save chat to Firebase", e);
    }

    return NextResponse.json({
      success: true,
      data: {
        reply: replyContent,
        chatId: savedChatId,
        messages: newMessages
      }
    });
  } catch (err) {
    console.error("[api/chat]", err);
    return NextResponse.json(
      { success: false, error: "Unexpected error" },
      { status: 500 }
    );
  }
}
