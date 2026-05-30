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

export type MissingSkillRecommendation = {
  skill: string;
  estimatedPointValue: number;
};

export type ResumeFeedback = {
  // V2 Advanced Metrics
  roleDetected?: string;
  roleAlignmentScore?: number;
  technicalDepthScore?: number;
  resumeStrength?: "Weak" | "Average" | "Strong" | "Excellent";
  industryReadiness?: "Internship" | "Entry-Level" | "Mid-Level" | "Senior";
  completeness?: number;
  seniority?: "Fresher" | "Junior" | "Mid-Level" | "Senior";
  
  // V2 Skills
  coveredSkills?: string[];
  missingSkills?: string[];
  bonusSkills?: string[];
  recommendations?: MissingSkillRecommendation[];

  // V1 Legacy & General
  matchedKeywords?: string[];
  missingKeywords?: string[];
  sectionsFound?: string[];
  sectionsMissing?: string[];
  checklist?: {
    email: boolean;
    phone: boolean;
    links: boolean;
    actionVerbs: boolean;
    quantifiedMetrics: boolean;
  };
  strengths?: string[];
  weaknesses?: string[];
  suggestions: string[];
  
  // Radar Chart Breakdown
  radarMetrics?: {
    keywordMatch: number; // /20
    experience: number; // /15
    projects: number; // /10
    skills: number; // /10
    formatting: number; // /5
    impact: number; // /5
  };
  
  // V2 Debugging
  debugScores?: Record<string, number>;
};

export type BulletImproverDoc = {
  id: string;
  userId: string;
  originalBullet: string;
  improvedVersions: string[];
  atsScore: number;
  qualityLevel: "Weak" | "Average" | "Strong" | "Excellent";
  detectedTechnologies: string[];
  suggestions: string[];
  createdAt: Date | null;
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
} & ResumeFeedback;

export type AiResultType = "bullet" | "roadmap" | "interview";

export type BulletContent = {
  input: string;
  output: string;
};

// --- V2 ROADMAP ENGINE TYPES ---
export type ResourceLink = {
  title: string;
  url: string;
  type: "docs" | "video" | "practice" | "article";
};

export type SkillMetadata = {
  name: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedHours: number;
  importanceScore: number; // 1-10
  prerequisites: string[];
  resources: ResourceLink[];
  subtopics?: string[];
  miniProject?: {
    name: string;
    description: string;
  };
};

export type RoadmapProject = {
  name: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  skillsApplied: string[];
};

export type RoadmapStage = {
  id: "foundations" | "core" | "projects" | "interview" | "job";
  title: string;
  description: string;
  estimatedWeeks: number;
  skills?: SkillMetadata[];
  projects?: RoadmapProject[];
  topics?: string[]; // for interview/job stages
};

export type ToolCategory = "Core Technologies" | "Development Tools" | "AI Tools" | "Deployment Tools";
export type ToolStack = {
  [key in ToolCategory]?: string[];
};

export type CareerRoadmap = {
  roleId: string;
  title: string;
  demand: "Medium" | "High" | "Very High";
  estimatedMonths: number;
  stages: RoadmapStage[];
  toolStack?: ToolStack;
};

export type RoadmapProgressDoc = {
  id: string;
  userId: string;
  roleId: string;
  currentYear: string;
  skillLevel: string;
  completedSkills: string[];
  completedProjects: string[];
  roadmapCompletionPct: number;
  internshipReadinessPct: number;
  jobReadinessPct: number;
  updatedAt: Date | null;
};

// --- V1 INTERVIEW PREP ENGINE TYPES ---
export type InterviewQuestionType = "technical" | "coding" | "behavioral" | "resume" | "project";

export type InterviewQuestion = {
  id: string;
  type: InterviewQuestionType;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  category: string; // e.g., "React", "Data Structures", "Leadership"
  expectedKeyPoints: string[]; // for self-review
};

export type CompanyTrack = {
  company: string;
  pattern: string;
  expectedSkills: string[];
  sampleQuestions: InterviewQuestion[];
};

export type CheatSheet = {
  skill: string;
  content: string; // markdown content
};

export type InterviewPrepDoc = {
  id: string;
  userId: string;
  roleId: string;
  level: "Internship" | "Entry-Level" | "Junior" | "Mid-Level";
  practicedQuestionIds: string[];
  mockHistory: {
    questionId: string;
    userAnswer: string;
    selfScore: number; // 1-10
    date: Date;
  }[];
  strongAreas: string[];
  weakAreas: string[];
  globalReadinessScore: number;
  updatedAt: Date | null;
};

// --- V3 INTERVIEW PREP (PLACEMENT ENGINE) TYPES ---
export type PrepTopic = {
  name: string;
  theory: string[];
  miniProjects: string[];
  interviewQuestions: string[];
  estimatedHours: number;
};

export type ResourceLinkV3 = {
  title: string;
  url: string;
  type: "docs" | "video" | "practice" | "article";
};

export type MockQuizV3 = {
  question: string;
  options: string[];
  answer: string;
};

export type PrepSubject = {
  name: string;
  description: string;
  whyItMatters: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  resources: ResourceLinkV3[];
  quizzes: MockQuizV3[];
  topics: PrepTopic[];
};

export type CodingQuestionV2 = {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  stage: string;
  url: string;
  companies: string[];
};

export type CategorizedQuestions = {
  basic: string[];
  intermediate: string[];
  advanced: string[];
  systemDesign: string[];
  optimization: string[];
  deployment: string[];
  security: string[];
  database: string[];
  architecture: string[];
  behavioral: string[];
};

export type ProjectVivaGuide = {
  projectName: string;
  description: string;
  businessUseCase: string;
  architectureDiagramDesc: string; // description of the architecture
  techStack: string[];
  expectedFeatures: string[];
  deploymentStrategy: string;
  scalabilityDiscussion: string;
  databaseDesign: string;
  apiDesign: string;
  securityConsiderations: string;
  performanceOptimizations: string;
  testingStrategy: string;
  futureImprovements: string;
  questions: CategorizedQuestions;
  
  // Legacy fields for backward compat
  architectureQuestions?: string[];
  designQuestions?: string[];
  optimizationQuestions?: string[];
  deploymentQuestions?: string[];
  challenges?: string[];
};

// V4 Dedicated Topic Page Type
export type DetailedTopicPage = {
  roleId: string;
  subjectName: string;
  topicName: string;
  topicOverview: string;
  whyItMatters: string;
  concepts: string[];
  examples: string[];
  practiceQuestions: string[];
  interviewQuestions: string[];
  miniProjects: string[];
  advancedProjects: string[];
  resources: ResourceLinkV3[];
  companyQuestions: string[];
  expectedDifficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  estimatedPreparationTime: string;
};

export type ExtendedCompanyTrack = {
  company: string;
  overview: string;
  interviewPattern: string;
  rounds: string[];
  frequentlyAskedQuestions: string[];
  expectedSkills: string[];
  difficultyLevel: "Medium" | "Hard" | "Very Hard";
  preparationStrategy: string;
  salaryRange: string;
};

export type PlacementProgressDoc = {
  id: string;
  userId: string;
  roleId: string;
  solvedCodingIds: string[];
  completedTopics: string[];
  currentStreak: number;
  lastActiveDate: Date | null;
  internshipReadiness: number;
  placementReadiness: number;
  overallPlacementReadiness: number;
  updatedAt: Date | null;
};

// V6 DSA ROADMAP TYPES
export type DsaProject = {
  name: string;
  viva: ProjectVivaGuide;
};

export type DsaWeek = {
  week: number;
  title: string;
  focus: string[];
  targetCount: number;
  projects: DsaProject[];
  questions: CodingQuestionV2[];
};

export type DsaTrack = {
  id: string;
  title: string;
  description: string;
  weeks: DsaWeek[];
};

export type CompanyTrackV6 = {
  id: string;
  title: string;
  companies: string[];
  targetCount: number;
  focus: string[];
};

export type DsaRoadmapData = {
  tracks: DsaTrack[];
  companyTracks: CompanyTrackV6[];
};

// Legacy Roadmap Content (V1)
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
