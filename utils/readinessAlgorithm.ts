export type ReadinessMetrics = {
  roadmapScore: number; // /25
  projectsScore: number; // /20
  atsScore: number; // /20
  interviewScore: number; // /20
  resumeCompletenessScore: number; // /15
  globalReadinessPct: number; // /100
  internshipReady: boolean; // >= 50%
  startupReady: boolean; // >= 70%
  productCompanyReady: boolean; // >= 85%
};

export function calculateGlobalReadiness(
  roadmapCompletionPct: number, // 0-100
  roadmapProjectsCompleted: number, // integer
  totalRoadmapProjects: number, // integer
  atsMatchScore: number, // 0-100
  interviewQuestionsPracticed: number, // integer
  totalInterviewQuestions: number, // integer
  resumeIsComplete: boolean // boolean
): ReadinessMetrics {
  
  // Roadmap (25%)
  const roadmapScore = (roadmapCompletionPct / 100) * 25;

  // Projects (20%)
  const projectCompletionPct = totalRoadmapProjects > 0 ? (roadmapProjectsCompleted / totalRoadmapProjects) : 0;
  const projectsScore = projectCompletionPct * 20;

  // ATS (20%)
  const atsScore = (atsMatchScore / 100) * 20;

  // Interview (20%)
  // Cap it at 20 points even if they do more
  const interviewCompletionPct = totalInterviewQuestions > 0 ? Math.min(1, interviewQuestionsPracticed / totalInterviewQuestions) : 0;
  const interviewScore = interviewCompletionPct * 20;

  // Resume Completeness (15%)
  const resumeCompletenessScore = resumeIsComplete ? 15 : 0;

  const globalReadinessPct = Math.round(roadmapScore + projectsScore + atsScore + interviewScore + resumeCompletenessScore);

  return {
    roadmapScore: Math.round(roadmapScore),
    projectsScore: Math.round(projectsScore),
    atsScore: Math.round(atsScore),
    interviewScore: Math.round(interviewScore),
    resumeCompletenessScore,
    globalReadinessPct,
    internshipReady: globalReadinessPct >= 50,
    startupReady: globalReadinessPct >= 70,
    productCompanyReady: globalReadinessPct >= 85
  };
}
