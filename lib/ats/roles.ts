export type RoleProfile = {
  title: string;
  requiredSkills: string[];
  bonusSkills: string[];
};

export const SYNONYMS: Record<string, string> = {
  "js": "javascript",
  "ts": "typescript",
  "node": "node.js",
  "nodejs": "node.js",
  "react.js": "react",
  "reactjs": "react",
  "next": "next.js",
  "nextjs": "next.js",
  "aws ec2": "aws",
  "amazon web services": "aws",
  "google cloud": "gcp",
  "google cloud platform": "gcp",
  "k8s": "kubernetes",
  "postgres": "postgresql",
  "mongo": "mongodb",
  "vue.js": "vue",
  "vuejs": "vue",
};

export const ROLES: Record<string, RoleProfile> = {
  frontend: {
    title: "Frontend Developer",
    requiredSkills: ["react", "javascript", "typescript", "html", "css", "next.js"],
    bonusSkills: ["redux", "tailwind", "vite", "jest", "cypress", "webpack"]
  },
  backend: {
    title: "Backend Developer",
    requiredSkills: ["node.js", "express", "java", "python", "rest api", "postgresql", "mongodb"],
    bonusSkills: ["spring boot", "django", "graphql", "redis", "docker", "microservices"]
  },
  fullstack: {
    title: "Full Stack Developer",
    requiredSkills: ["react", "javascript", "node.js", "typescript", "rest api", "html", "css", "postgresql", "mongodb"],
    bonusSkills: ["next.js", "docker", "aws", "graphql", "redis", "tailwind"]
  },
  devops: {
    title: "DevOps Engineer",
    requiredSkills: ["docker", "kubernetes", "aws", "terraform", "ci/cd", "linux"],
    bonusSkills: ["jenkins", "ansible", "bash", "python", "github actions", "prometheus", "grafana"]
  },
  data_scientist: {
    title: "Data Scientist",
    requiredSkills: ["python", "sql", "machine learning", "pandas", "numpy", "statistics"],
    bonusSkills: ["tensorflow", "pytorch", "r", "tableau", "scikit-learn", "nlp"]
  },
  ml_engineer: {
    title: "Machine Learning Engineer",
    requiredSkills: ["python", "machine learning", "tensorflow", "pytorch", "aws", "sql"],
    bonusSkills: ["docker", "kubernetes", "mlops", "nlp", "computer vision"]
  },
  cybersecurity: {
    title: "Cybersecurity Analyst",
    requiredSkills: ["linux", "network security", "python", "wireshark", "vulnerability assessment"],
    bonusSkills: ["penetration testing", "siem", "firewalls", "cissp", "cryptography"]
  },
  cloud: {
    title: "Cloud Engineer",
    requiredSkills: ["aws", "azure", "gcp", "cloud architecture", "serverless", "docker"],
    bonusSkills: ["kubernetes", "terraform", "linux", "networking"]
  },
  ui_ux: {
    title: "UI/UX Designer",
    requiredSkills: ["figma", "wireframing", "prototyping", "user research", "ui design", "ux design"],
    bonusSkills: ["adobe xd", "sketch", "invision", "html", "css"]
  },
  mobile: {
    title: "Mobile Developer",
    requiredSkills: ["swift", "kotlin", "react native", "ios", "android", "mobile development"],
    bonusSkills: ["flutter", "dart", "objective-c", "java", "sqlite"]
  },
  general: {
    title: "General Software Engineer",
    requiredSkills: ["javascript", "python", "java", "c++", "git", "sql", "api", "agile"],
    bonusSkills: ["aws", "docker", "ci/cd", "linux"]
  }
};

/**
 * Detects the target role based on job description keywords with strict thresholds
 */
export function detectRole(jobDescription: string): { role: RoleProfile; debugScores: Record<string, number> } {
  const text = jobDescription.toLowerCase().replace(/[^\w\s-]/g, " ");
  
  const frontendKeywords = ["frontend", "front-end", "front end", "react", "javascript", "typescript", "html", "css", "redux", "nextjs", "next.js", "ui", "ux"];
  const backendKeywords = ["backend", "back-end", "back end", "node", "nodejs", "node.js", "express", "java", "spring", "django", "flask", "api", "rest"];
  const fullstackKeywords = ["fullstack", "full-stack", "full stack"];

  let frontendMatches = 0;
  let backendMatches = 0;
  
  frontendKeywords.forEach(kw => { if (text.includes(kw)) frontendMatches += 1; });
  backendKeywords.forEach(kw => { if (text.includes(kw)) backendMatches += 1; });

  let bestRole = ROLES.general;
  let maxScore = 0;
  
  const debugScores: Record<string, number> = {};

  for (const [key, profile] of Object.entries(ROLES)) {
    if (key === "general") continue;

    let score = 0;
    
    // Explicit title match = huge boost
    if (text.includes(profile.title.toLowerCase())) {
      score += 15; 
    }

    if (key === "frontend") score += frontendMatches * 2;
    if (key === "backend") score += backendMatches * 2;

    profile.requiredSkills.forEach(skill => {
      if (text.includes(skill)) score += 2;
    });

    debugScores[profile.title] = score;

    if (score > maxScore) {
      maxScore = score;
      bestRole = profile;
    }
  }

  // Full Stack Conditional Logic
  const hasFullstackExplicit = fullstackKeywords.some(kw => text.includes(kw));
  if (hasFullstackExplicit && frontendMatches > 0 && backendMatches > 0) {
    bestRole = ROLES.fullstack;
    debugScores["Full Stack Developer"] = maxScore + 10;
  } else if (bestRole.title === "Full Stack Developer") {
    // If it won just on generic skills but missing the explicit combo, demote it.
    if (!hasFullstackExplicit) {
      bestRole = ROLES.general;
    }
  }

  // Confidence Threshold
  if (maxScore < 5 && bestRole.title !== "Full Stack Developer") {
    bestRole = ROLES.general;
  }

  return { role: bestRole, debugScores };
}
