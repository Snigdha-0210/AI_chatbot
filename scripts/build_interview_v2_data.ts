import fs from 'fs';
import path from 'path';

const ROADMAP_DIR = path.join(process.cwd(), 'data', 'roadmaps');
const V2_DIR = path.join(process.cwd(), 'data', 'interviews_v2');

if (!fs.existsSync(V2_DIR)) {
  fs.mkdirSync(V2_DIR, { recursive: true });
}

// Fixed Data for V2
const COMPANY_TRACKS = [
  {
    company: "Google",
    interviewPattern: "3-4 Technical Rounds, 1 System Design, 1 Googlyness",
    rounds: ["Phone Screen (DSA)", "Onsite 1 (DSA)", "Onsite 2 (DSA/Domain)", "Onsite 3 (System Design)", "Googlyness"],
    frequentlyAskedQuestions: ["Why Google?", "Tell me about a time you failed.", "Design YouTube."],
    expectedSkills: ["Advanced DSA", "System Design", "Leadership"],
    difficultyLevel: "Very Hard",
    preparationStrategy: "Focus entirely on LeetCode Hard and Grokking the System Design Interview."
  },
  {
    company: "Amazon",
    interviewPattern: "1 OA, 3 Technical, 1 Bar Raiser",
    rounds: ["Online Assessment", "Technical 1", "Technical 2", "System Design", "Bar Raiser (Behavioral)"],
    frequentlyAskedQuestions: ["Tell me about a time you disagreed with your manager.", "Design Amazon Locker.", "Two Sum."],
    expectedSkills: ["DSA", "Amazon Leadership Principles", "OOD"],
    difficultyLevel: "Hard",
    preparationStrategy: "Memorize the 14 Leadership Principles. Every answer must use the STAR method."
  },
  {
    company: "TCS",
    interviewPattern: "1 Aptitude, 1 Technical, 1 HR",
    rounds: ["NQT / Aptitude", "Technical Interview", "HR Interview"],
    frequentlyAskedQuestions: ["What are ACID properties?", "What is OOPs?", "Are you willing to relocate?"],
    expectedSkills: ["Aptitude", "Core CS Subjects (DBMS, OS, CN)", "Basic Coding"],
    difficultyLevel: "Medium",
    preparationStrategy: "Focus on theory. DBMS, OOPs, and SQL queries are highly tested."
  }
];

function generateCodingBank(roleId: string) {
  const bank = [];
  const topics = ["Arrays", "Strings", "Linked Lists", "Trees", "Graphs", "Dynamic Programming"];
  
  // Generate 60 questions (10 per topic) to simulate the massive bank
  for (let i = 0; i < topics.length; i++) {
    for (let j = 0; j < 10; j++) {
      const diff = j < 3 ? "Easy" : j < 8 ? "Medium" : "Hard";
      bank.push({
        id: `c_${roleId}_${topics[i]}_${j}`,
        question: `Solve the ${topics[i]} problem variant ${j} for ${roleId}`,
        difficulty: diff,
        topic: topics[i],
        solution: `function solve() { return 'optimized ${diff} solution'; }`,
        explanation: `This uses an optimized approach for ${topics[i]} running in O(N) time.`,
        companiesAsked: ["Google", "Amazon", "Microsoft"].sort(() => 0.5 - Math.random()).slice(0, 2)
      });
    }
  }
  return bank;
}

const files = fs.readdirSync(ROADMAP_DIR).filter(f => f.endsWith('.json'));

files.forEach(file => {
  const roleId = file.replace('.json', '');
  const roadmapData = JSON.parse(fs.readFileSync(path.join(ROADMAP_DIR, file), 'utf-8'));
  
  const roleDir = path.join(V2_DIR, roleId);
  if (!fs.existsSync(roleDir)) fs.mkdirSync(roleDir, { recursive: true });

  // 1. Generate Subjects
  const subjects: any[] = [];
  roadmapData.stages.forEach((stage: any) => {
    if (stage.skills) {
      const topics = stage.skills.map((skill: any) => ({
        name: skill.name,
        theory: skill.subtopics || [skill.name],
        miniProjects: [skill.miniProject?.name || `Build a ${skill.name} App`],
        interviewQuestions: [`Explain ${skill.name}`, `What are the pros and cons of ${skill.name}?`],
        estimatedHours: skill.estimatedHours || 10
      }));
      subjects.push({
        name: stage.title,
        description: stage.description,
        topics
      });
    }
  });
  fs.writeFileSync(path.join(roleDir, 'subjects.json'), JSON.stringify(subjects, null, 2));

  // 2. Generate Coding Bank
  const codingBank = generateCodingBank(roleId);
  fs.writeFileSync(path.join(roleDir, 'coding.json'), JSON.stringify(codingBank, null, 2));

  // 3. Generate Viva
  const vivaGuides: any[] = [];
  roadmapData.stages.forEach((stage: any) => {
    if (stage.projects) {
      stage.projects.forEach((proj: any) => {
        vivaGuides.push({
          projectName: proj.name,
          description: proj.description,
          architectureQuestions: ["How did you structure the folders?", "Why did you choose this tech stack?"],
          designQuestions: ["How did you handle state management?", "How is the database schema designed?"],
          optimizationQuestions: ["How would you scale this to 10k users?", "What are the bottlenecks?"],
          deploymentQuestions: ["How is this deployed?", "Did you use CI/CD?"],
          challenges: ["What was the hardest bug you fixed?", "How did you handle CORS?"]
        });
      });
    }
  });
  fs.writeFileSync(path.join(roleDir, 'viva.json'), JSON.stringify(vivaGuides, null, 2));

  // 4. Generate Companies
  fs.writeFileSync(path.join(roleDir, 'companies.json'), JSON.stringify(COMPANY_TRACKS, null, 2));
});

console.log(`Successfully generated V2 Interview Datasets for ${files.length} careers!`);
