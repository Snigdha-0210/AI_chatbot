import type { CareerRoadmap } from "@/types";

export function personalizeRoadmap(
  roadmap: CareerRoadmap,
  year: string,
  level: string
): CareerRoadmap {
  // Create a deep copy to avoid mutating the original cached JSON
  const personalized: CareerRoadmap = JSON.parse(JSON.stringify(roadmap));

  // 1. Skill Level Personalization
  if (level === "Intermediate" || level === "Advanced") {
    // If advanced, skip Foundations stage completely (or flag it as auto-complete)
    // We'll actually remove the 'foundations' stage so the user focuses purely on core/projects/interview.
    const foundationIndex = personalized.stages.findIndex(s => s.id === "foundations");
    if (foundationIndex !== -1) {
      if (level === "Advanced") {
        personalized.stages.splice(foundationIndex, 1);
      } else if (level === "Intermediate") {
        // Just make the foundations look smaller
        personalized.stages[foundationIndex].description = "Quick Review: " + personalized.stages[foundationIndex].description;
      }
    }
  }

  // 2. Academic Year Personalization
  const interviewStage = personalized.stages.find(s => s.id === "interview");
  const jobStage = personalized.stages.find(s => s.id === "job");
  const projectsStage = personalized.stages.find(s => s.id === "projects");

  if (year === "1st Year" || year === "2nd Year") {
    // Emphasize learning and mini projects over immediate placements
    if (jobStage) {
      jobStage.title = "Internship Readiness";
      jobStage.description = "Prepare for your first summer internships and hackathons.";
      if (!jobStage.topics?.includes("Participate in Hackathons")) {
        jobStage.topics?.push("Participate in Hackathons");
      }
    }
  } else if (year === "3rd Year") {
    // Heavy focus on Internships and Portfolio
    if (projectsStage) {
      projectsStage.description += " Focus on building a strong portfolio for internship applications.";
    }
  } else if (year === "4th Year" || year === "Graduate") {
    // Heavy focus on Placements, System Design
    if (interviewStage) {
      interviewStage.description = "CRITICAL: Placement Preparation. Master these concepts.";
      if (!interviewStage.topics?.includes("System Design Interviews")) {
        interviewStage.topics?.push("System Design Interviews");
      }
    }
    if (jobStage) {
      jobStage.title = "Placement Readiness";
      jobStage.description = "Final sprint for full-time offers.";
    }
  }

  return personalized;
}
