import { NextRequest, NextResponse } from "next/server";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS } from "@/utils/constants";
import type { BulletImproverDoc } from "@/types";

export const runtime = "nodejs";

const WEAK_VERBS = ["made", "did", "worked on", "helped", "used", "created", "built", "coded", "handled", "was responsible for", "managed", "fixed", "wrote"];
const STRONG_VERBS = ["Developed", "Engineered", "Executed", "Collaborated on", "Leveraged", "Designed", "Architected", "Spearheaded", "Optimized", "Implemented", "Orchestrated"];

const TECH_CONTEXT: Record<string, string> = {
  "react": "responsive web application using React.js with reusable component architecture",
  "node": "scalable backend services utilizing Node.js",
  "node.js": "scalable backend services utilizing Node.js",
  "python": "robust application leveraging Python for data processing",
  "java": "enterprise-grade application using Java",
  "mongodb": "NoSQL database solution using MongoDB for flexible data storage",
  "firebase": "real-time serverless application backed by Firebase",
  "aws": "cloud-native infrastructure deployed on AWS",
  "docker": "containerized application environment utilizing Docker",
  "next.js": "server-side rendered web application utilizing Next.js",
  "nextjs": "server-side rendered web application utilizing Next.js",
  "typescript": "type-safe application using TypeScript for maintainable code",
  "postgresql": "relational database system using PostgreSQL"
};

const PROJECT_TYPES: Record<string, string> = {
  "website": "web application",
  "app": "application",
  "chatbot": "intelligent conversational chatbot solution",
  "model": "machine learning model for predictive analytics",
  "dashboard": "interactive analytics dashboard for real-time visualization",
  "portfolio": "professional portfolio interface",
  "api": "RESTful API service",
  "database": "database architecture system"
};

function normalize(text: string) {
  return text.toLowerCase().replace(/[^\w\s\.-]/g, " ");
}

export async function POST(req: NextRequest) {
  try {
    const { bullet, userId } = await req.json();

    if (!bullet || !userId) {
      return NextResponse.json({ success: false, error: "Missing bullet or userId" }, { status: 400 });
    }

    const text = normalize(bullet);
    
    // 1. Detect Technologies
    const detectedTechnologies: string[] = [];
    const lowerText = text.toLowerCase();
    for (const tech of Object.keys(TECH_CONTEXT)) {
      if (lowerText.includes(tech)) {
        detectedTechnologies.push(tech);
      }
    }

    // 2. Score Bullet
    let atsScore = 0;
    
    // Check Strong Verbs vs Weak Verbs
    const hasWeakVerb = WEAK_VERBS.some(v => text.includes(v));
    const hasStrongVerb = STRONG_VERBS.some(v => text.includes(v.toLowerCase()));
    if (hasStrongVerb) atsScore += 25;
    else if (!hasWeakVerb && text.split(" ").length > 3) atsScore += 15; // Unrecognized but not obviously weak

    if (detectedTechnologies.length > 0) atsScore += 25;

    // Check Impact
    const hasImpact = /([0-9]+\s?%|\$[0-9]+|[0-9]+\+|improved|reduced|increased by)/i.test(bullet);
    if (hasImpact) atsScore += 25;

    // Specificity (length & detail)
    if (bullet.split(" ").length > 8) atsScore += 25;
    else if (bullet.split(" ").length > 4) atsScore += 10;

    // 3. Quality Level
    let qualityLevel: "Weak" | "Average" | "Strong" | "Excellent" = "Weak";
    if (atsScore >= 86) qualityLevel = "Excellent";
    else if (atsScore >= 71) qualityLevel = "Strong";
    else if (atsScore >= 41) qualityLevel = "Average";

    // 4. Generate Variations
    let variations: string[] = [];
    
    // Detect project type
    let projectContext = "solution";
    for (const [key, val] of Object.entries(PROJECT_TYPES)) {
      if (text.includes(key)) {
        projectContext = val;
        break;
      }
    }

    // Determine tech suffix
    let techSuffix = "";
    if (detectedTechnologies.length > 0) {
      techSuffix = ` utilizing ${detectedTechnologies.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(", ")}`;
      // If we have a specific advanced template, use the first one found
      for (const tech of detectedTechnologies) {
        if (TECH_CONTEXT[tech]) {
          techSuffix = ` leveraging ${TECH_CONTEXT[tech]}`;
          break;
        }
      }
    }

    // Variation 1: Direct translation
    const v1Verb = "Developed";
    let v1 = `${v1Verb} a ${projectContext}${techSuffix}.`;
    
    // Variation 2: Engineering focus
    const v2Verb = "Engineered";
    let v2 = `${v2Verb} an optimized ${projectContext}${techSuffix} to streamline operations.`;

    // Variation 3: Design/Architecture focus
    const v3Verb = "Designed and implemented";
    let v3 = `${v3Verb} a comprehensive ${projectContext}${techSuffix}.`;

    // If the original already had impact metrics, append them back so we don't lose data
    if (hasImpact) {
      const metricMatch = bullet.match(/([0-9]+\s?%|\$[0-9]+|[0-9]+\+)/i);
      const metricStr = metricMatch ? metricMatch[0] : "significant metrics";
      v1 = v1.replace(".", `, achieving ${metricStr} improvement in performance.`);
      v2 = v2.replace(".", `, driving ${metricStr} efficiency gains.`);
      v3 = v3.replace(".", `, directly impacting user growth by ${metricStr}.`);
    }

    // Only apply heavy transformations if the bullet is weak or average. 
    // If it's Excellent, we just polish it slightly.
    if (qualityLevel === "Excellent" || qualityLevel === "Strong") {
      variations = [
        bullet.replace(/^[a-z]/, (match: string) => match.toUpperCase()), // capitalize
        `Successfully ${bullet.toLowerCase()}`,
        `Spearheaded the initiative that ${bullet.toLowerCase()}`
      ];
    } else {
      variations = [v1, v2, v3];
    }

    // 5. Suggestions
    const suggestions: string[] = [];
    if (!hasImpact) {
      suggestions.push("Consider adding metrics such as users served, response time improvements, accuracy gains, or performance increases.");
    }
    if (detectedTechnologies.length === 0) {
      suggestions.push("Include specific technologies, frameworks, or tools used to pass ATS keyword filters.");
    }
    if (hasWeakVerb) {
      suggestions.push("Avoid weak verbs like 'made' or 'worked on'. Start with strong action verbs like 'Engineered' or 'Spearheaded'.");
    }

    if (suggestions.length === 0) suggestions.push("Great bullet point! It contains strong action verbs, technical keywords, and measurable impact.");

    const docData = {
      userId,
      originalBullet: bullet,
      improvedVersions: variations,
      atsScore,
      qualityLevel,
      detectedTechnologies: Array.from(new Set(detectedTechnologies)),
      suggestions,
      createdAt: serverTimestamp(),
    };

    // Save to Firestore
    // Note: ensure we have a 'bullet_improvements' collection in constants if we want, or just use literal
    const newDocRef = await addDoc(collection(db, "bullet_improvements"), docData);

    const data: BulletImproverDoc = {
      id: newDocRef.id,
      ...docData,
      createdAt: new Date(), // for client
    };

    return NextResponse.json({ success: true, data });

  } catch (err) {
    console.error("[api/improve-bullet]", err);
    return NextResponse.json(
      { success: false, error: "Unexpected error during bullet improvement" },
      { status: 500 }
    );
  }
}
