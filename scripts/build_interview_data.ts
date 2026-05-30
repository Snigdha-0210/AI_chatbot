import fs from 'fs';
import path from 'path';

const ROADMAP_DIR = path.join(process.cwd(), 'data', 'roadmaps');
const INTERVIEW_DIR = path.join(process.cwd(), 'data', 'interviews');

if (!fs.existsSync(INTERVIEW_DIR)) {
  fs.mkdirSync(INTERVIEW_DIR, { recursive: true });
}

// Fixed behavioral questions
const behavioralBank = [
  { id: "b1", type: "behavioral", difficulty: "Easy", category: "General", question: "Tell me about yourself.", expectedKeyPoints: ["Past experience", "Current role/study", "Future goals aligned with company"] },
  { id: "b2", type: "behavioral", difficulty: "Medium", category: "Teamwork", question: "Describe a time you had a conflict with a team member.", expectedKeyPoints: ["Situation", "Action taken to resolve", "Compromise", "Positive outcome"] },
  { id: "b3", type: "behavioral", difficulty: "Medium", category: "Leadership", question: "Tell me about a time you took the lead on a project.", expectedKeyPoints: ["Initiative", "Delegation", "Result"] },
  { id: "b4", type: "behavioral", difficulty: "Hard", category: "Failure", question: "Describe a project that failed. What did you learn?", expectedKeyPoints: ["Accountability", "Analysis of failure", "Lessons applied later"] }
];

// Fixed coding questions
const codingBank = [
  { id: "c1", type: "coding", difficulty: "Easy", category: "Arrays", question: "Two Sum: Find indices of two numbers that add up to target.", expectedKeyPoints: ["Hash Map", "O(N) Time", "O(N) Space"] },
  { id: "c2", type: "coding", difficulty: "Medium", category: "Strings", question: "Longest Substring Without Repeating Characters.", expectedKeyPoints: ["Sliding Window", "Set", "O(N) Time"] },
  { id: "c3", type: "coding", difficulty: "Hard", category: "Graphs", question: "Word Ladder: Find shortest transformation sequence.", expectedKeyPoints: ["BFS", "Queue", "O(M^2 * N)"] }
];

// Read all roadmaps to generate targeted technical questions
const files = fs.readdirSync(ROADMAP_DIR).filter(f => f.endsWith('.json'));

files.forEach(file => {
  const roleId = file.replace('.json', '');
  const roadmapData = JSON.parse(fs.readFileSync(path.join(ROADMAP_DIR, file), 'utf-8'));
  
  const technicalQuestions: any[] = [];
  const cheatSheets: any[] = [];
  let qIndex = 1;

  roadmapData.stages.forEach((stage: any) => {
    if (stage.skills) {
      stage.skills.forEach((skill: any) => {
        // Generate technical questions from subtopics
        const diff = skill.difficulty === "Advanced" ? "Hard" : skill.difficulty === "Intermediate" ? "Medium" : "Easy";
        
        technicalQuestions.push({
          id: `t_${roleId}_${qIndex++}`,
          type: "technical",
          difficulty: diff,
          category: skill.name,
          question: `Can you explain the core concepts of ${skill.name} and how it is used in modern applications?`,
          expectedKeyPoints: skill.subtopics || [skill.name, "Use cases", "Performance considerations"]
        });

        if (skill.subtopics && skill.subtopics.length > 0) {
          skill.subtopics.forEach((sub: string) => {
            technicalQuestions.push({
              id: `t_${roleId}_${qIndex++}`,
              type: "technical",
              difficulty: "Medium",
              category: skill.name,
              question: `How does ${sub} work in the context of ${skill.name}?`,
              expectedKeyPoints: ["Definition", "Implementation details", "Pros/Cons"]
            });
          });
        }

        // Generate Cheat Sheet
        cheatSheets.push({
          skill: skill.name,
          content: `# ${skill.name} Cheat Sheet\n\n**Category:** ${skill.category}\n\n**Key Subtopics:**\n${(skill.subtopics || []).map((s: string) => `- ${s}`).join('\n')}\n\n**Common Interview Themes:**\n- Be prepared to discuss how ${skill.name} integrates with your overall stack.\n- Focus on performance and edge cases.`
        });
      });
    }
  });

  const companyTracks = [
    {
      company: "Google",
      pattern: "3-4 Technical Coding Rounds (Data Structures focus), 1 System Design, 1 Googlyness (Behavioral)",
      expectedSkills: ["Data Structures", "Algorithms", "System Design"],
      sampleQuestions: codingBank.concat(behavioralBank.slice(0,2))
    },
    {
      company: "Microsoft",
      pattern: "3 Technical Rounds (Coding + Domain), 1 Hiring Manager (Behavioral)",
      expectedSkills: roadmapData.toolStack?.["Core Technologies"] || [],
      sampleQuestions: technicalQuestions.slice(0, 3).concat(behavioralBank.slice(2, 4))
    }
  ];

  const dataset = {
    roleId,
    title: `${roadmapData.title} Interview Prep`,
    technicalQuestions,
    behavioralQuestions: behavioralBank,
    codingQuestions: codingBank,
    companyTracks,
    cheatSheets
  };

  fs.writeFileSync(path.join(INTERVIEW_DIR, `${roleId}.json`), JSON.stringify(dataset, null, 2));
});

console.log(`Successfully generated Interview Datasets for ${files.length} careers!`);
