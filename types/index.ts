export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type UserProfile = {
  id: string;
  name: string | null;
  email: string | null;
};

export type ChatDoc = {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type ResumeFeedback = {
  missingKeywords: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
};

export type ResumeDoc = {
  id: string;
  userId: string;
  score: number;
  feedback: ResumeFeedback;
  fileName?: string;
  storagePath?: string;
  createdAt: Date | null;
};

export type AtsAnalysis = {
  score: number;
  missingKeywords: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
};

export type AiResultType = "bullet" | "roadmap" | "interview";

export type BulletContent = {
  input: string;
  output: string;
};

export type RoadmapPhase = {
  phase: string;
  duration: string;
  focus: string;
};

export type RoadmapContent = {
  role: string;
  timeframe?: string;
  skills: string[];
  tools: string[];
  projects: string[];
  timeline: RoadmapPhase[];
};

export type InterviewContent = {
  role: string;
  difficulty: string;
  technical: string[];
  behavioral: string[];
};

export type AiResultContent = BulletContent | RoadmapContent | InterviewContent;

export type AiResultDoc = {
  id: string;
  userId: string;
  type: AiResultType;
  label: string;
  content: AiResultContent;
  createdAt: Date | null;
};

export type ActivityItem =
  | { type: "chat"; id: string; title: string; at: Date }
  | { type: "resume"; id: string; title: string; score: number; at: Date };

export type DashboardStats = {
  latestAtsScore: number | null;
  chatCount: number;
  recentActivity: ActivityItem[];
};
