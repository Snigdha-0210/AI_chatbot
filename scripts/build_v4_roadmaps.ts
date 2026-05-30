import fs from 'fs';
import path from 'path';

const outDir = path.join(process.cwd(), 'data', 'roadmaps');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Helper to generate a deep skill
function createSkill(name: string, category: string, subtopics: string[], project: string | null = null, hours = 20) {
  return {
    name,
    category,
    difficulty: "Intermediate",
    estimatedHours: hours,
    importanceScore: 10,
    prerequisites: [],
    resources: [
      { name: "Official Documentation", url: "#", type: "docs" },
      { name: "Crash Course", url: "#", type: "video" }
    ],
    subtopics,
    ...(project ? { miniProject: { name: project, description: `Apply your knowledge of ${name} in a practical scenario.` } } : {})
  };
}

const templates: Record<string, any> = {
  data_scientist: {
    roleId: "data_scientist",
    title: "Data Scientist",
    demand: "Very High",
    estimatedMonths: 8,
    toolStack: {
      "Core Technologies": ["Python", "Pandas", "NumPy", "Scikit-Learn", "SQL", "Tableau"],
      "Development Tools": ["VS Code", "Jupyter", "Google Colab", "Kaggle"],
      "AI Tools": ["ChatGPT", "Claude", "Perplexity", "Cursor"],
      "Deployment Tools": ["Streamlit", "Docker", "AWS SageMaker"]
    },
    stages: [
      {
        id: "foundations",
        title: "Foundations",
        description: "Math, Stats, and Programming basics.",
        estimatedWeeks: 4,
        skills: [
          createSkill("Python", "Language", ["Variables", "Data Types", "Loops", "Functions", "OOP"], "Python CLI Tool", 40),
          createSkill("Statistics", "Math", ["Probability", "Distributions", "Hypothesis Testing", "A/B Testing"], null, 30),
          createSkill("SQL", "Database", ["Selects", "Joins", "Aggregations", "Window Functions"], "Store Database Queries", 25)
        ]
      },
      {
        id: "core",
        title: "Data Analysis",
        description: "Manipulating and visualizing data.",
        estimatedWeeks: 6,
        skills: [
          createSkill("Pandas & NumPy", "Data Manipulation", ["Series", "DataFrames", "Filtering", "Grouping", "Vectorization"], "Data Cleaning Pipeline", 40),
          createSkill("Data Visualization", "Visualization", ["Matplotlib", "Seaborn", "Plotly", "Dashboard Design"], "Sales Dashboard", 30)
        ]
      },
      {
        id: "projects",
        title: "Machine Learning",
        description: "Predictive modeling.",
        estimatedWeeks: 8,
        skills: [
          createSkill("Scikit-Learn", "Framework", ["Regression", "Classification", "Clustering", "Cross Validation"], "House Price Predictor", 50),
          createSkill("Model Evaluation", "Metrics", ["Accuracy", "Precision", "Recall", "F1 Score", "ROC-AUC"], null, 15)
        ],
        projects: [
          { name: "Customer Churn Predictor", difficulty: "Intermediate", description: "Predict if a customer will leave.", skillsApplied: ["Pandas", "Scikit-Learn"] }
        ]
      },
      {
        id: "interview",
        title: "Interview Prep",
        description: "Stats and Coding questions.",
        estimatedWeeks: 4,
        topics: ["SQL Window Functions", "Explain P-Value", "Bias-Variance Tradeoff"]
      },
      {
        id: "job",
        title: "Job Readiness",
        description: "Kaggle and Portfolio.",
        estimatedWeeks: 2,
        topics: ["Publish Kaggle Notebooks", "Resume Optimization"]
      }
    ]
  },
  cybersecurity: {
    roleId: "cybersecurity",
    title: "Cybersecurity Analyst",
    demand: "High",
    estimatedMonths: 6,
    toolStack: {
      "Core Technologies": ["Networking", "Linux", "Python", "OWASP"],
      "Development Tools": ["Wireshark", "Burp Suite", "Metasploit", "Nmap", "Kali Linux"],
      "AI Tools": ["ChatGPT", "Claude", "Perplexity"],
      "Deployment Tools": ["Splunk", "AWS Security Hub"]
    },
    stages: [
      {
        id: "foundations",
        title: "Foundations",
        description: "Networking and System Basics.",
        estimatedWeeks: 4,
        skills: [
          createSkill("Networking (TCP/IP)", "Core", ["OSI Model", "TCP vs UDP", "Subnetting", "DNS"], "Network Mapper", 40),
          createSkill("Linux Fundamentals", "OS", ["CLI", "Permissions", "Bash Scripting", "Cron Jobs"], "Automated Backup Script", 30)
        ]
      },
      {
        id: "core",
        title: "Security Fundamentals",
        description: "Understanding vulnerabilities and tools.",
        estimatedWeeks: 6,
        skills: [
          createSkill("OWASP Top 10", "Web Security", ["SQLi", "XSS", "CSRF", "Broken Auth"], "Vulnerable App Exploitation", 30),
          createSkill("Network Analysis", "Tools", ["Wireshark", "Packet Sniffing", "Nmap", "Port Scanning"], "Traffic Analyzer", 25)
        ]
      },
      {
        id: "projects",
        title: "Offensive & Defensive Security",
        description: "Hacking and protecting.",
        estimatedWeeks: 6,
        skills: [
          createSkill("Penetration Testing", "Offensive", ["Reconnaissance", "Exploitation", "Post-Exploitation", "Burp Suite"], "HackTheBox Walkthrough", 40),
          createSkill("SIEM & Monitoring", "Defensive", ["Splunk", "Log Analysis", "Incident Response"], "ELK Stack Setup", 30)
        ],
        projects: [
          { name: "Vulnerability Scanner", difficulty: "Intermediate", description: "Scan open ports and weak headers.", skillsApplied: ["Python", "Nmap"] }
        ]
      },
      {
        id: "interview",
        title: "Interview Prep",
        description: "Preparing for SOC roles.",
        estimatedWeeks: 3,
        topics: ["CIA Triad", "Types of Malware", "Explain XSS and SQLi", "Incident Response Phases"]
      },
      {
        id: "job",
        title: "Job Readiness",
        description: "Certifications and applications.",
        estimatedWeeks: 2,
        topics: ["CompTIA Security+ Prep", "SOC Analyst Preparation", "CTF Platforms (TryHackMe/HackTheBox)"]
      }
    ]
  },
  frontend: {
    roleId: "frontend",
    title: "Frontend Developer",
    demand: "Very High",
    estimatedMonths: 6,
    toolStack: {
      "Core Technologies": ["HTML", "CSS", "JavaScript", "React", "TypeScript", "TailwindCSS"],
      "Development Tools": ["VS Code", "Git", "GitHub", "Chrome DevTools", "Postman", "Figma"],
      "AI Tools": ["ChatGPT", "Claude", "Cursor", "GitHub Copilot", "Lovable", "v0"],
      "Deployment Tools": ["Vercel", "Netlify", "Firebase"]
    },
    stages: [
      {
        id: "foundations",
        title: "Foundations",
        description: "The building blocks of the web.",
        estimatedWeeks: 4,
        skills: [
          createSkill("HTML", "Markup", ["HTML Structure", "Semantic HTML", "Forms", "Tables", "Accessibility", "SEO Basics", "Best Practices"], "Personal Portfolio Page", 10),
          createSkill("CSS", "Styling", ["Box Model", "Flexbox", "Grid", "Animations", "Media Queries"], "Responsive Landing Page", 20),
          createSkill("JavaScript", "Language", ["Variables", "Data Types", "Loops", "Functions", "Objects", "Arrays", "DOM", "ES6", "Async Await", "APIs"], "Weather App", 40)
        ]
      },
      {
        id: "core",
        title: "Core Skills",
        description: "Modern UI engineering.",
        estimatedWeeks: 6,
        skills: [
          createSkill("React", "Framework", ["Components", "Props", "State", "Hooks", "Routing", "API Calls", "Context API", "Performance Optimization"], "Task Management App", 50),
          createSkill("TypeScript", "Language", ["Types", "Interfaces", "Generics", "Utility Types"], "Refactor App to TS", 30)
        ]
      },
      {
        id: "projects",
        title: "Advanced Ecosystem",
        description: "Production ready frameworks.",
        estimatedWeeks: 6,
        skills: [
          createSkill("Next.js", "Framework", ["App Router", "SSR vs SSG", "Server Actions", "API Routes"], "Fullstack Blog", 40),
          createSkill("State Management", "Architecture", ["Zustand", "Redux Toolkit", "React Query"], "E-Commerce Cart", 20)
        ],
        projects: [
          { name: "E-Commerce Frontend", difficulty: "Advanced", description: "Complete store with cart state and API fetching.", skillsApplied: ["React", "TypeScript", "Next.js"] }
        ]
      },
      {
        id: "interview",
        title: "Interview Prep",
        description: "JS questions and UI Design.",
        estimatedWeeks: 4,
        topics: ["Event Loop", "Closures", "React Rendering Cycle", "Frontend System Design"]
      },
      {
        id: "job",
        title: "Job Readiness",
        description: "Portfolio and resumes.",
        estimatedWeeks: 2,
        topics: ["Deploy to Vercel", "Build Personal Brand"]
      }
    ]
  },
  mobile: {
    roleId: "mobile",
    title: "Mobile App Developer",
    demand: "High",
    estimatedMonths: 6,
    toolStack: {
      "Core Technologies": ["Flutter", "Dart", "Firebase", "REST APIs", "SQLite"],
      "Development Tools": ["Android Studio", "VS Code", "Firebase Console", "Xcode"],
      "AI Tools": ["ChatGPT", "Claude", "Cursor", "GitHub Copilot"],
      "Deployment Tools": ["Google Play Console", "App Store Connect", "Codemagic", "Fastlane"]
    },
    stages: [
      {
        id: "foundations",
        title: "Foundations",
        description: "Core mobile concepts and languages.",
        estimatedWeeks: 4,
        skills: [
          createSkill("Dart", "Language", ["Variables", "OOP", "Null Safety", "Async Programming"], "CLI Calculator", 30),
          createSkill("Flutter Basics", "Framework", ["Widgets", "Stateless vs Stateful", "Material/Cupertino"], "Counter App", 20),
          createSkill("UI Fundamentals", "Design", ["Layouts (Row/Column)", "Containers", "Styling", "Responsiveness"], "Profile Screen", 15)
        ]
      },
      {
        id: "core",
        title: "Mobile Development Core",
        description: "Mastering the framework and state.",
        estimatedWeeks: 6,
        skills: [
          createSkill("Navigation", "Framework", ["Navigator 2.0", "GoRouter", "Passing Data"], "Multi-screen App", 20),
          createSkill("State Management", "Architecture", ["Provider", "Riverpod", "Bloc", "Local State"], "Todo App with Riverpod", 35)
        ]
      },
      {
        id: "projects",
        title: "Intermediate Skills & Backend",
        description: "Connecting apps to the cloud.",
        estimatedWeeks: 6,
        skills: [
          createSkill("Firebase Auth & Firestore", "Backend", ["Authentication", "NoSQL", "Realtime Updates"], "Chat App", 40),
          createSkill("REST APIs", "Networking", ["HTTP Package", "JSON Serialization", "Error Handling"], "Weather App (API)", 25),
          createSkill("Device Features", "Hardware", ["Camera", "GPS", "Push Notifications"], "Location Tracker", 20)
        ],
        projects: [
          { name: "Food Delivery App", difficulty: "Advanced", description: "Complex UI, cart state, and external API calls.", skillsApplied: ["REST APIs", "Riverpod", "Firebase"] }
        ]
      },
      {
        id: "interview",
        title: "Interview Preparation",
        description: "App architecture and technical questions.",
        estimatedWeeks: 4,
        topics: ["Flutter Interview Questions", "App Architecture (Clean Architecture)", "Clean Code Principles", "System Design for Mobile"]
      },
      {
        id: "job",
        title: "Job Readiness",
        description: "Deploying to stores.",
        estimatedWeeks: 2,
        topics: ["Publishing to App Store / Play Store", "Portfolio Building", "Resume Optimization"]
      }
    ]
  }
};

const defaultToolStack = {
  "Core Technologies": ["JavaScript", "Python", "SQL", "Git"],
  "Development Tools": ["VS Code", "GitHub", "Docker", "Postman"],
  "AI Tools": ["ChatGPT", "Claude", "Cursor", "GitHub Copilot"],
  "Deployment Tools": ["AWS", "Vercel", "Heroku", "GitHub Actions"]
};

// Roles to generate
const rolesToGenerate = [
  "frontend", "backend", "fullstack", "software_engineer", 
  "data_analyst", "data_scientist", "ai_engineer", "ml_engineer", 
  "deep_learning", "cybersecurity", "cloud", "devops", 
  "mobile", "uiux", "blockchain", "game_dev", "product_manager", "general"
];

rolesToGenerate.forEach(roleId => {
  let template = templates[roleId];
  
  if (!template) {
    // Generate a structured fallback using the frontend/general structure
    template = {
      roleId,
      title: roleId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      demand: "High",
      estimatedMonths: 6,
      toolStack: defaultToolStack,
      stages: [
        {
          id: "foundations",
          title: "Foundations",
          description: `Core concepts for ${roleId}.`,
          estimatedWeeks: 4,
          skills: [
            createSkill("Programming Basics", "Core", ["Variables", "Loops", "Functions", "OOP"], "CLI Tool", 30),
            createSkill("Version Control", "Tools", ["Git", "GitHub", "Branching", "PRs"], "Open Source PR", 10)
          ]
        },
        {
          id: "core",
          title: "Core Skills",
          description: `Mastering the tools of ${roleId}.`,
          estimatedWeeks: 6,
          skills: [
            createSkill("Framework Architecture", "Core", ["Components", "Routing", "State", "APIs"], "Medium Project", 40),
            createSkill("Database Integration", "Data", ["SQL", "NoSQL", "ORMs"], "CRUD App", 30)
          ]
        },
        {
          id: "projects",
          title: "Advanced Projects",
          description: "Building production ready systems.",
          estimatedWeeks: 6,
          skills: [
            createSkill("Deployment & CI/CD", "DevOps", ["Docker", "Actions", "Cloud Hosting"], "Deployed App", 20)
          ],
          projects: [
            { name: "Capstone Project", difficulty: "Advanced", description: `End-to-end ${roleId} system.`, skillsApplied: ["Framework Architecture", "Database Integration"] }
          ]
        },
        {
          id: "interview",
          title: "Interview Prep",
          description: "Technical questions and system design.",
          estimatedWeeks: 4,
          topics: ["LeetCode Practice", "System Design", "Behavioral (STAR)"]
        },
        {
          id: "job",
          title: "Job Readiness",
          description: "Applying and optimizing.",
          estimatedWeeks: 2,
          topics: ["Resume Optimization", "Mock Interviews"]
        }
      ]
    };
  }

  fs.writeFileSync(path.join(outDir, `${roleId}.json`), JSON.stringify(template, null, 2));
});

console.log(`Generated ${rolesToGenerate.length} V4 Roadmaps with Subtopics and ToolStacks!`);
