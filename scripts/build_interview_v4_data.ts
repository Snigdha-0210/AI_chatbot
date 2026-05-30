import fs from 'fs';
import path from 'path';

const ROADMAP_DIR = path.join(process.cwd(), 'data', 'roadmaps');
const V3_DIR = path.join(process.cwd(), 'data', 'interviews_v2'); 

if (!fs.existsSync(V3_DIR)) {
  fs.mkdirSync(V3_DIR, { recursive: true });
}

// -------------------------------------------------------------
// V4/V5 Resource Mapping Dictionary
// -------------------------------------------------------------
const RESOURCE_MAP: Record<string, { docs: string; video: string; practice: string; article?: string }> = {
  // Frontend
  "html": { docs: "https://developer.mozilla.org/en-US/docs/Web/HTML", video: "https://www.youtube.com/watch?v=kUMe1FH4CGY", practice: "https://www.frontendmentor.io/challenges?types=html" },
  "css": { docs: "https://developer.mozilla.org/en-US/docs/Web/CSS", video: "https://www.youtube.com/watch?v=OXGznpKZ_sA", practice: "https://cssbattle.dev/" },
  "javascript": { docs: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", video: "https://www.youtube.com/watch?v=W6NZfCO5SIk", practice: "https://leetcode.com/study-plan/javascript-30-days/" },
  "react": { docs: "https://react.dev/", video: "https://www.youtube.com/watch?v=bMknfKXIFA8", practice: "https://react-tutorial.app/" },
  "next.js": { docs: "https://nextjs.org/docs", video: "https://www.youtube.com/watch?v=wm5gMKuwSYk", practice: "https://nextjs.org/learn" },
  
  // Backend & Core SWE
  "dbms": { docs: "https://www.geeksforgeeks.org/dbms/", video: "https://www.youtube.com/watch?v=kBdlM6hNDAE", practice: "https://sqlbolt.com/" },
  "sql": { docs: "https://www.w3schools.com/sql/", video: "https://www.youtube.com/watch?v=HXV3zeJZ1EQ", practice: "https://leetcode.com/study-plan/sql/" },
  "oops": { docs: "https://www.geeksforgeeks.org/object-oriented-programming-in-cpp/", video: "https://www.youtube.com/watch?v=pTB0EiLXUC8", practice: "https://www.hackerrank.com/domains/cpp" },
  "system design": { docs: "https://github.com/donnemartin/system-design-primer", video: "https://www.youtube.com/watch?v=bUHFg8Cj-Ro", practice: "https://www.hellointerview.com/" },
  
  // Data Science & AI
  "python": { docs: "https://docs.python.org/3/", video: "https://www.youtube.com/watch?v=_uQrJ0TkZlc", practice: "https://www.kaggle.com/learn/python" },
  "machine learning": { docs: "https://scikit-learn.org/stable/", video: "https://www.youtube.com/watch?v=i_LwzRmAizo", practice: "https://www.kaggle.com/learn/intro-to-machine-learning" },
};

function getResource(topicName: string, subjectName: string) {
  const key = topicName.toLowerCase();
  const subKey = subjectName.toLowerCase();
  let mapped = RESOURCE_MAP[key] || RESOURCE_MAP[subKey];
  if (mapped) {
    return [
      { title: `${topicName} Official Docs`, url: mapped.docs, type: `docs` },
      { title: `Full ${topicName} Course`, url: mapped.video, type: `video` },
      { title: `${topicName} Practice Labs`, url: mapped.practice, type: `practice` }
    ];
  }
  return [
    { title: `${topicName} Documentation`, url: `https://www.google.com/search?q=${encodeURIComponent(topicName)}+documentation`, type: `docs` },
    { title: `${topicName} Crash Course`, url: `https://youtube.com/results?search_query=${encodeURIComponent(topicName)}+crash+course`, type: `video` },
    { title: `${topicName} Interview Questions`, url: `https://www.google.com/search?q=${encodeURIComponent(topicName)}+interview+questions`, type: `practice` }
  ];
}

// -------------------------------------------------------------
// V5 Dynamic Subject Rewriter
// -------------------------------------------------------------
function rewriteSubject(skill: any, roleId: string) {
  const nameLower = skill.name.toLowerCase();
  let rewritten = { ...skill };

  if (nameLower === "version control" || nameLower === "git") {
    if (roleId === "data_scientist" || roleId === "ml_engineer") {
      rewritten.subtopics = ["Git", "Notebook Versioning", "DVC (Data Version Control)", "Model Checkpointing"];
      rewritten.description = "Learn to version both your codebase and massive datasets/models.";
    } else if (roleId === "devops" || roleId === "sre_engineer") {
      rewritten.subtopics = ["GitFlow", "Infrastructure as Code Versioning", "CI/CD Release Branches", "Deployment Rollbacks"];
      rewritten.description = "Master robust branching strategies for continuous delivery and zero-downtime rollouts.";
    } else if (roleId === "embedded_systems" || roleId === "iot_engineer") {
      rewritten.subtopics = ["Firmware Versioning", "Hardware Release Tracking", "Embedded Build Pipelines"];
      rewritten.description = "Track binary artifacts, firmware versions, and cross-compiled releases effectively.";
    } else {
      rewritten.subtopics = ["Git Basics", "GitHub Collaboration", "Branching", "Pull Requests"];
      rewritten.description = "Essential version control for collaborating with engineering teams.";
    }
  }

  return rewritten;
}


// -------------------------------------------------------------
// V5 Real LeetCode 7-Stage Database
// -------------------------------------------------------------
const V5_LEETCODE_DB = [
  // Stage 1: Arrays & Strings
  { id: "lc_1", title: "Two Sum", difficulty: "Easy", topic: "Arrays & Strings", stage: "Stage 1", url: "https://leetcode.com/problems/two-sum/", companies: ["Google", "Amazon", "Microsoft", "Meta"] },
  { id: "lc_121", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", topic: "Arrays & Strings", stage: "Stage 1", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", companies: ["Amazon", "Microsoft", "Bloomberg"] },
  { id: "lc_217", title: "Contains Duplicate", difficulty: "Easy", topic: "Arrays & Strings", stage: "Stage 1", url: "https://leetcode.com/problems/contains-duplicate/", companies: ["Google", "Apple", "Uber"] },
  { id: "lc_238", title: "Product of Array Except Self", difficulty: "Medium", topic: "Arrays & Strings", stage: "Stage 1", url: "https://leetcode.com/problems/product-of-array-except-self/", companies: ["Amazon", "Microsoft", "Meta"] },
  { id: "lc_53", title: "Maximum Subarray", difficulty: "Medium", topic: "Arrays & Strings", stage: "Stage 1", url: "https://leetcode.com/problems/maximum-subarray/", companies: ["Google", "Amazon", "Apple"] },
  { id: "lc_15", title: "3Sum", difficulty: "Medium", topic: "Arrays & Strings", stage: "Stage 1", url: "https://leetcode.com/problems/3sum/", companies: ["Meta", "Amazon", "Microsoft"] },
  
  // Stage 2: Linked Lists, Stacks, Queues
  { id: "lc_206", title: "Reverse Linked List", difficulty: "Easy", topic: "Linked Lists", stage: "Stage 2", url: "https://leetcode.com/problems/reverse-linked-list/", companies: ["Amazon", "Microsoft", "Apple"] },
  { id: "lc_21", title: "Merge Two Sorted Lists", difficulty: "Easy", topic: "Linked Lists", stage: "Stage 2", url: "https://leetcode.com/problems/merge-two-sorted-lists/", companies: ["Amazon", "Google", "Microsoft"] },
  { id: "lc_141", title: "Linked List Cycle", difficulty: "Easy", topic: "Linked Lists", stage: "Stage 2", url: "https://leetcode.com/problems/linked-list-cycle/", companies: ["Microsoft", "Amazon", "Bloomberg"] },
  { id: "lc_20", title: "Valid Parentheses", difficulty: "Easy", topic: "Stacks", stage: "Stage 2", url: "https://leetcode.com/problems/valid-parentheses/", companies: ["Amazon", "Google", "Meta"] },
  { id: "lc_155", title: "Min Stack", difficulty: "Medium", topic: "Stacks", stage: "Stage 2", url: "https://leetcode.com/problems/min-stack/", companies: ["Amazon", "Bloomberg"] },

  // Stage 3: Trees & Heaps
  { id: "lc_104", title: "Maximum Depth of Binary Tree", difficulty: "Easy", topic: "Trees", stage: "Stage 3", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", companies: ["Amazon", "Microsoft"] },
  { id: "lc_226", title: "Invert Binary Tree", difficulty: "Easy", topic: "Trees", stage: "Stage 3", url: "https://leetcode.com/problems/invert-binary-tree/", companies: ["Google", "Amazon", "Meta"] },
  { id: "lc_102", title: "Binary Tree Level Order Traversal", difficulty: "Medium", topic: "Trees", stage: "Stage 3", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/", companies: ["Amazon", "Microsoft", "LinkedIn"] },
  { id: "lc_230", title: "Kth Smallest Element in a BST", difficulty: "Medium", topic: "Trees", stage: "Stage 3", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/", companies: ["Amazon", "Google", "Meta"] },
  { id: "lc_347", title: "Top K Frequent Elements", difficulty: "Medium", topic: "Heaps", stage: "Stage 3", url: "https://leetcode.com/problems/top-k-frequent-elements/", companies: ["Amazon", "Google", "Meta"] },

  // Stage 4: Graphs
  { id: "lc_200", title: "Number of Islands", difficulty: "Medium", topic: "Graphs", stage: "Stage 4", url: "https://leetcode.com/problems/number-of-islands/", companies: ["Amazon", "Microsoft", "Google"] },
  { id: "lc_133", title: "Clone Graph", difficulty: "Medium", topic: "Graphs", stage: "Stage 4", url: "https://leetcode.com/problems/clone-graph/", companies: ["Meta", "Amazon"] },
  { id: "lc_207", title: "Course Schedule", difficulty: "Medium", topic: "Graphs", stage: "Stage 4", url: "https://leetcode.com/problems/course-schedule/", companies: ["Amazon", "Google", "Meta"] },
  { id: "lc_417", title: "Pacific Atlantic Water Flow", difficulty: "Medium", topic: "Graphs", stage: "Stage 4", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/", companies: ["Google", "Amazon"] },

  // Stage 5: Greedy & Backtracking
  { id: "lc_55", title: "Jump Game", difficulty: "Medium", topic: "Greedy", stage: "Stage 5", url: "https://leetcode.com/problems/jump-game/", companies: ["Amazon", "Microsoft", "Google"] },
  { id: "lc_39", title: "Combination Sum", difficulty: "Medium", topic: "Backtracking", stage: "Stage 5", url: "https://leetcode.com/problems/combination-sum/", companies: ["Amazon", "Google", "Meta"] },
  { id: "lc_46", title: "Permutations", difficulty: "Medium", topic: "Backtracking", stage: "Stage 5", url: "https://leetcode.com/problems/permutations/", companies: ["Amazon", "Microsoft", "Google"] },

  // Stage 6: Dynamic Programming
  { id: "lc_70", title: "Climbing Stairs", difficulty: "Easy", topic: "Dynamic Programming", stage: "Stage 6", url: "https://leetcode.com/problems/climbing-stairs/", companies: ["Amazon", "Microsoft", "Google"] },
  { id: "lc_322", title: "Coin Change", difficulty: "Medium", topic: "Dynamic Programming", stage: "Stage 6", url: "https://leetcode.com/problems/coin-change/", companies: ["Amazon", "Google", "Meta"] },
  { id: "lc_300", title: "Longest Increasing Subsequence", difficulty: "Medium", topic: "Dynamic Programming", stage: "Stage 6", url: "https://leetcode.com/problems/longest-increasing-subsequence/", companies: ["Amazon", "Google", "Meta"] },
  { id: "lc_1143", title: "Longest Common Subsequence", difficulty: "Medium", topic: "Dynamic Programming", stage: "Stage 6", url: "https://leetcode.com/problems/longest-common-subsequence/", companies: ["Amazon", "Google", "Microsoft"] },

  // Stage 7: System Design & Advanced Data Structures
  { id: "lc_146", title: "LRU Cache", difficulty: "Medium", topic: "System Design", stage: "Stage 7", url: "https://leetcode.com/problems/lru-cache/", companies: ["Amazon", "Google", "Microsoft"] },
  { id: "lc_208", title: "Implement Trie (Prefix Tree)", difficulty: "Medium", topic: "Advanced DS", stage: "Stage 7", url: "https://leetcode.com/problems/implement-trie-prefix-tree/", companies: ["Google", "Amazon", "Microsoft"] },
  { id: "lc_295", title: "Find Median from Data Stream", difficulty: "Hard", topic: "Advanced DS", stage: "Stage 7", url: "https://leetcode.com/problems/find-median-from-data-stream/", companies: ["Amazon", "Google", "Microsoft"] }
];

// -------------------------------------------------------------
// V5 Companies Database
// -------------------------------------------------------------
const V5_COMPANIES_DB = [
  {
    company: "Google",
    overview: "Google is known for hard algorithmic and graph problems.",
    interviewPattern: "1 Phone Screen, 4-5 Onsite (3 Tech, 1 System Design, 1 Googlyness)",
    rounds: ["Phone Screen", "Coding 1", "Coding 2", "System Design", "Behavioral"],
    frequentlyAskedQuestions: ["Graphs (DFS/BFS)", "Dynamic Programming", "Trees"],
    expectedSkills: ["Advanced DSA", "System Design", "Scalability", "Problem Solving"],
    difficultyLevel: "Very Hard",
    preparationStrategy: "Focus heavily on LeetCode Hard problems, especially Graphs and DP. Study the system design primer deeply.",
    salaryRange: "$150k - $300k+"
  },
  {
    company: "Amazon",
    overview: "Amazon heavily weights their Leadership Principles (LPs) alongside technical skills.",
    interviewPattern: "1 Online Assessment (OA), 4 Onsite (Coding + LPs, System Design)",
    rounds: ["OA", "Coding + LP", "Coding + LP", "System Design", "Bar Raiser"],
    frequentlyAskedQuestions: ["Arrays & Strings", "Trees", "Object Oriented Design"],
    expectedSkills: ["Data Structures", "Leadership Principles", "OOD", "System Design"],
    difficultyLevel: "Hard",
    preparationStrategy: "Prepare STAR method stories for all 16 Leadership Principles. Practice standard LeetCode Mediums.",
    salaryRange: "$130k - $250k+"
  },
  {
    company: "Microsoft",
    overview: "Microsoft focuses on clean code, testing, and practical problem solving.",
    interviewPattern: "1 Codility OA, 3-4 Onsite Rounds (Technical + System Design)",
    rounds: ["OA", "Technical 1", "Technical 2", "System Design / Hiring Manager"],
    frequentlyAskedQuestions: ["Linked Lists", "Arrays", "String Manipulation", "System Design"],
    expectedSkills: ["Clean Code", "Testing", "System Design", "Communication"],
    difficultyLevel: "Hard",
    preparationStrategy: "Focus on writing production-ready code. Practice Strings and Arrays.",
    salaryRange: "$120k - $220k+"
  },
  {
    company: "Meta",
    overview: "Meta asks very standard LeetCode questions but expects bug-free code extremely fast.",
    interviewPattern: "1 Phone Screen, 4 Onsite (2 Coding, 1 System Design, 1 Behavioral)",
    rounds: ["Phone Screen", "Ninja (Coding 1)", "Ninja (Coding 2)", "Pirate (System Design)", "Jedi (Behavioral)"],
    frequentlyAskedQuestions: ["Arrays", "Hash Maps", "Binary Trees", "Two Pointers"],
    expectedSkills: ["Speed", "Accuracy", "System Design", "Product Sense"],
    difficultyLevel: "Very Hard",
    preparationStrategy: "Solve top 50 Meta tagged questions on LeetCode. Speed is critical.",
    salaryRange: "$160k - $320k+"
  }
];

// -------------------------------------------------------------
// V4 Deep Project Viva Generator
// -------------------------------------------------------------
function generateViva(projName: string, desc: string, roleId: string) {
  const isEcom = projName.toLowerCase().includes('commerce') || projName.toLowerCase().includes('shop');
  
  return {
    projectName: projName || `Enterprise ${roleId} System`,
    description: desc || `A scalable platform engineered to solve core business problems in the ${roleId} space.`,
    businessUseCase: isEcom ? "To provide a highly available and scalable platform for online retail operations, increasing conversion rates and managing inventory." : `A robust solution designed to streamline operations and solve core business problems related to ${projName || roleId}.`,
    architectureDiagramDesc: "Client -> Load Balancer -> API Gateway -> Microservices (Auth, Core, Notification) -> Database / Cache (Redis)",
    techStack: ["React/Next.js", "Node.js/Spring Boot", "PostgreSQL/MongoDB", "Redis", "Docker", "AWS/GCP"],
    expectedFeatures: ["Authentication (JWT)", "Role Based Access Control", "Rate Limiting", "Data Caching", "Responsive UI"],
    deploymentStrategy: "Containerized deployment using Docker, orchestrated with Kubernetes or ECS. CI/CD pipelines via GitHub Actions deploying to AWS.",
    scalabilityDiscussion: "Horizontal scaling of stateless API servers. Read replicas for the database. Caching heavy read queries using Redis.",
    databaseDesign: "Normalized schema for core transactional data, heavily indexed on foreign keys. NoSQL fallback for unstructured logs.",
    apiDesign: "RESTful architecture with standard HTTP methods, paginated responses, and API versioning (e.g., /v1/).",
    securityConsiderations: "Input validation (prevent SQLi/XSS), secure cookie flags, HTTPS enforcement, and bcrypt for password hashing.",
    performanceOptimizations: "Lazy loading components, CDN for static assets, debouncing API calls, and caching DB queries.",
    testingStrategy: "Unit tests with Jest, integration tests for critical API paths, and end-to-end tests using Cypress.",
    futureImprovements: "Implement real-time features using WebSockets, add machine learning for recommendations, and transition to a fully serverless architecture.",
    questions: {
      basic: [`What does ${projName} do?`, "Which tech stack did you choose and why?", "How long did it take to build?"],
      intermediate: ["How did you handle state management?", "How is authentication implemented?", "How do you handle errors and retries?"],
      advanced: ["Explain a memory leak you encountered.", "How would you migrate the database with zero downtime?", "How do you handle race conditions?"],
      systemDesign: ["Draw the architecture if we had 1 Million users.", "Where are the single points of failure?", "How do you partition the database?"],
      optimization: ["How did you reduce API latency?", "What caching strategies did you use?", "How do you optimize bundle size?"],
      deployment: ["Explain your CI/CD pipeline.", "Why Docker?", "How do you manage environment variables safely?"],
      security: ["How do you prevent XSS?", "How is data encrypted at rest?", "Explain your JWT strategy."],
      database: ["Why SQL over NoSQL (or vice versa)?", "How are your tables indexed?", "Write a complex JOIN query for this app."],
      architecture: ["Why monolithic vs microservices for this?", "How do services communicate?", "Explain your API gateway."],
      behavioral: ["What was the hardest bug you fixed?", "How did you resolve conflicts?", "What would you do differently?"]
    }
  };
}

// -------------------------------------------------------------
// MAIN GENERATOR
// -------------------------------------------------------------
const files = fs.readdirSync(ROADMAP_DIR).filter(f => f.endsWith('.json'));

files.forEach(file => {
  const roleId = file.replace('.json', '');
  const roadmapData = JSON.parse(fs.readFileSync(path.join(ROADMAP_DIR, file), 'utf-8'));
  
  const roleDir = path.join(V3_DIR, roleId);
  if (!fs.existsSync(roleDir)) fs.mkdirSync(roleDir, { recursive: true });

  const subjects: any[] = [];
  const vivaGuides: any[] = [];
  
  roadmapData.stages.forEach((stage: any) => {
    
    // Process Subjects & Topics
    if (stage.skills) {
      const topics = stage.skills.map((rawSkill: any) => {
        const skill = rewriteSubject(rawSkill, roleId); // V5 dynamic rewrite
        
        const topicSlug = skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const detailedTopic = {
          roleId,
          subjectName: stage.title,
          topicName: skill.name,
          topicOverview: skill.description || `An in-depth deep dive into ${skill.name}. Mastering this is critical for passing technical interviews for ${roadmapData.title} roles.`,
          whyItMatters: `${skill.name} is a core foundation of modern engineering. Interviewers use it as a proxy to test your deeper understanding of systems, performance, and best practices.`,
          concepts: skill.subtopics || [`Basic ${skill.name}`, `Advanced ${skill.name}`, `Internal architecture of ${skill.name}`],
          examples: [`Implementing ${skill.name} in a real-world scenario`, `Handling edge cases in ${skill.name}`],
          practiceQuestions: [`Write a program demonstrating ${skill.name}.`, `Fix the bug in the given ${skill.name} snippet.`],
          interviewQuestions: [`Explain ${skill.name} to a 5-year-old.`, `What are the pros and cons of ${skill.name}?`, `How does ${skill.name} handle memory management?`],
          miniProjects: [skill.miniProject?.name || `Build a ${skill.name} App`, `Advanced ${skill.name} Simulator`],
          advancedProjects: [`Integrate ${skill.name} into a microservice`, `Scale ${skill.name} for 10k concurrent users`],
          resources: getResource(skill.name, stage.title),
          companyQuestions: [`How Google tests ${skill.name}`, `How Amazon asks about ${skill.name}`],
          expectedDifficulty: skill.difficulty || "Intermediate",
          estimatedPreparationTime: `${skill.estimatedHours || 15} Hours`
        };
        
        const topicsDir = path.join(roleDir, 'topics');
        if (!fs.existsSync(topicsDir)) fs.mkdirSync(topicsDir, { recursive: true });
        fs.writeFileSync(path.join(topicsDir, `${topicSlug}.json`), JSON.stringify(detailedTopic, null, 2));

        return {
          name: skill.name,
          theory: skill.subtopics || [skill.name, `${skill.name} Internals`, `Advanced ${skill.name}`],
          miniProjects: detailedTopic.miniProjects,
          interviewQuestions: detailedTopic.interviewQuestions,
          estimatedHours: skill.estimatedHours || 15,
          slug: topicSlug
        };
      });

      subjects.push({
        name: stage.title,
        description: stage.description,
        whyItMatters: `${stage.title} is absolutely fundamental to succeeding in technical interviews. It forms the backbone of how systems scale and operate under pressure.`,
        difficulty: ["Beginner", "Intermediate", "Advanced"][Math.floor(Math.random() * 3)],
        resources: getResource(stage.title, stage.title),
        quizzes: [
          { question: `Which of the following is a key characteristic of ${stage.title}?`, options: ["Scalability", "Syntax errors", "Memory leaks", "Deprecation"], answer: "Scalability" },
          { question: `When should you NOT use ${stage.title}?`, options: ["When speed matters", "When data is small", "When deploying to cloud", "Never"], answer: "When data is small" }
        ],
        topics
      });
    }

    // Process Viva (with fallback robustness)
    if (stage.projects && stage.projects.length > 0) {
      stage.projects.forEach((proj: any) => {
        vivaGuides.push(generateViva(proj.name, proj.description, roleId));
      });
    }
  });

  // If a career has NO projects defined in its roadmap, automatically inject two robust enterprise projects so Viva isn't empty!
  if (vivaGuides.length === 0) {
    vivaGuides.push(generateViva(`Enterprise ${roadmapData.title} System`, `A scalable platform engineered to solve core business problems in the ${roadmapData.title} space.`, roleId));
    vivaGuides.push(generateViva(`Distributed ${roadmapData.title} Engine`, `A high-performance processing engine tailored for ${roadmapData.title} workloads.`, roleId));
  }

  // Write Main Summaries
  fs.writeFileSync(path.join(roleDir, 'subjects.json'), JSON.stringify(subjects, null, 2));
  fs.writeFileSync(path.join(roleDir, 'viva.json'), JSON.stringify(vivaGuides, null, 2));
  fs.writeFileSync(path.join(roleDir, 'coding.json'), JSON.stringify(V5_LEETCODE_DB, null, 2));
  fs.writeFileSync(path.join(roleDir, 'companies.json'), JSON.stringify(V5_COMPANIES_DB, null, 2));
});

console.log(`Successfully generated V5 Interview Datasets (Real LeetCode, Dynamic Subjects, Robust Vivas, Companies) for ${files.length} careers!`);
