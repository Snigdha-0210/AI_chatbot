import { NextRequest, NextResponse } from "next/server";
import { COLLECTIONS } from "@/utils/constants";
import pdf from "pdf-parse";
import mammoth from "mammoth";
import type { AtsAnalysis } from "@/types";
import { detectRole, SYNONYMS, ROLES } from "@/lib/ats/roles";

export const runtime = "nodejs";

const STOP_WORDS = new Set(["and", "the", "with", "for", "to", "in", "a", "of", "on", "is", "as", "at", "by", "or", "an", "be", "this", "that", "it", "are", "from", "will", "can", "your", "we", "you", "our", "about"]);

const TECH_KEYWORDS = [
  "react", "angular", "vue", "node.js", "java", "python", "aws", "docker", 
  "kubernetes", "git", "mongodb", "postgresql", "mysql", "typescript", 
  "javascript", "next.js", "express", "rest api", "graphql", "sql", "nosql", 
  "azure", "gcp", "html", "css", "c++", "c#", "ruby", "php", "swift", "kotlin", 
  "spring boot", "django", "flask", "fastapi", "terraform", "ci/cd", "linux",
  "machine learning", "tensorflow", "pytorch", "pandas", "numpy"
];

function normalize(text: string) {
  return text.toLowerCase().replace(/[^\w\s\.\+#-]/g, "");
}

function extractKeywords(text: string): string[] {
  const words = normalize(text).split(/\s+/);
  const keywords = new Set<string>();
  
  const lowerText = text.toLowerCase();
  
  // Custom multi-word extraction (e.g., "machine learning", "node.js")
  for (const tech of TECH_KEYWORDS) {
    if (lowerText.includes(tech)) keywords.add(tech);
  }

  // Single word extraction with synonym mapping
  for (let word of words) {
    if (word.length > 2 && !STOP_WORDS.has(word) && !Number.isInteger(Number(word))) {
      // Map synonym if exists
      if (SYNONYMS[word]) word = SYNONYMS[word];
      keywords.add(word);
    }
  }
  return Array.from(keywords);
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const jobDescription = form.get("jobDescription") as string | null;
    const userId = form.get("userId") as string | null;

    if (!file || !jobDescription || !userId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (file, jobDescription, userId)" },
        { status: 400 }
      );
    }

    let resumeText = "";
    const buffer = Buffer.from(await file.arrayBuffer());

    if (file.type === "application/pdf") {
      const parsed = await pdf(buffer);
      resumeText = parsed.text;
    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const parsed = await mammoth.extractRawText({ buffer });
      resumeText = parsed.value;
    } else {
      return NextResponse.json({ success: false, error: "Only PDF/DOCX allowed" }, { status: 400 });
    }

    if (!resumeText.trim()) {
      return NextResponse.json({ success: false, error: "Could not extract text" }, { status: 400 });
    }

    const lowerResume = resumeText.toLowerCase();

    // 1. Detect Role
    const { role: targetRole, debugScores } = detectRole(jobDescription);
    
    // --- 100 Point Engine ---
    let totalScore = 0;

    // A. Role Alignment (30 Points)
    // Check how many of the target role's required skills exist in the resume
    let coveredSkills: string[] = [];
    let missingSkills: string[] = [];
    
    targetRole.requiredSkills.forEach(skill => {
      const normalizedSkill = SYNONYMS[skill] || skill;
      if (lowerResume.includes(normalizedSkill)) {
        coveredSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    const roleAlignmentRatio = targetRole.requiredSkills.length > 0 
      ? coveredSkills.length / targetRole.requiredSkills.length 
      : 1;
    const roleAlignmentScore = Math.round(roleAlignmentRatio * 30);
    totalScore += roleAlignmentScore;

    // Bonus Skills
    let bonusSkills: string[] = [];
    targetRole.bonusSkills.forEach(skill => {
      const normalizedSkill = SYNONYMS[skill] || skill;
      if (lowerResume.includes(normalizedSkill)) bonusSkills.push(skill);
    });

    // B. Keyword Match (20 Points)
    const jdKeywords = extractKeywords(jobDescription);
    const resumeKeywords = extractKeywords(resumeText);
    const resumeKeySet = new Set(resumeKeywords);
    
    const matchedKeywords: string[] = [];
    const missingKeywords: string[] = [];
    
    jdKeywords.forEach(kw => {
      if (resumeKeySet.has(kw)) matchedKeywords.push(kw);
      else missingKeywords.push(kw);
    });

    let keywordScore = jdKeywords.length > 0 
      ? Math.round((matchedKeywords.length / jdKeywords.length) * 20)
      : 20;
    totalScore += keywordScore;

    // C. Experience Relevance (15 Points)
    let experienceScore = 0;
    const hasExperience = /\b(experience|work history|employment)\b/i.test(resumeText);
    if (hasExperience) {
      experienceScore += 5; // Base points for having section
      // Check for strong verbs near tech
      const strongExpVerbs = /\b(built|developed|designed|implemented|created|optimized|deployed|maintained|integrated)\b/gi;
      const matchCount = (resumeText.match(strongExpVerbs) || []).length;
      if (matchCount >= 3) experienceScore += 10;
      else if (matchCount > 0) experienceScore += 5;
    }
    totalScore += experienceScore;

    // D. Projects (10 Points)
    let projectScore = 0;
    const hasProjects = /\b(projects|portfolio)\b/i.test(resumeText);
    if (hasProjects) {
      projectScore += 5; // Base
      // Look for complex stacks (commas and multiple techs in close proximity)
      // Heuristic: Check if multiple tech keywords appear
      let techCount = 0;
      TECH_KEYWORDS.forEach(tech => {
        if (lowerResume.includes(tech)) techCount++;
      });
      if (techCount >= 4) projectScore += 5;
      else if (techCount >= 2) projectScore += 3;
    }
    totalScore += projectScore;

    // E. Skills Coverage (10 Points)
    // Mathematical differential
    let skillsScore = Math.round((roleAlignmentRatio) * 10);
    totalScore += skillsScore;

    // F. ATS Formatting (5 Points)
    let formattingScore = 5;
    // Deduct for tables or weird unicode symbols
    if (resumeText.includes('\t\t\t') || /[\u25A0\u25CF]/.test(resumeText)) {
      // It's a heuristic for columns/tables. For now, assume good formatting unless glaring issues.
    }
    totalScore += formattingScore;

    // G. Impact (5 Points)
    let impactScore = 0;
    const impactRegex = /([0-9]+\s?%|\$[0-9]+|improved|reduced|increased by)/i;
    if (impactRegex.test(resumeText)) impactScore = 5;
    totalScore += impactScore;

    // H. Professional Presence (5 Points)
    let presenceScore = 0;
    const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
    const hasPhone = /(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/.test(resumeText);
    const hasLinks = /(linkedin\.com|github\.com)/i.test(resumeText);
    if (hasEmail) presenceScore += 2;
    if (hasPhone) presenceScore += 2;
    if (hasLinks) presenceScore += 1;
    totalScore += presenceScore;

    // --- Advanced Metrics ---

    // Strength
    let resumeStrength: "Weak" | "Average" | "Strong" | "Excellent" = "Weak";
    if (totalScore >= 85) resumeStrength = "Excellent";
    else if (totalScore >= 70) resumeStrength = "Strong";
    else if (totalScore >= 50) resumeStrength = "Average";

    // Completeness
    const sections = [
      hasEmail, hasPhone, hasLinks, hasExperience, hasProjects, 
      /\b(education|academic)\b/i.test(resumeText),
      /\b(skills|technologies)\b/i.test(resumeText)
    ];
    const completeness = Math.round((sections.filter(Boolean).length / sections.length) * 100);

    // Tech Depth
    let technicalDepthScore = 0;
    TECH_KEYWORDS.forEach(tech => {
      if (lowerResume.includes(tech)) technicalDepthScore++;
    });

    // Seniority
    let seniority: "Fresher" | "Junior" | "Mid-Level" | "Senior" = "Fresher";
    const yearMatch = lowerResume.match(/\b([1-9]|1[0-9])\s*(\+?\s*years?)\b/i);
    let years = 0;
    if (yearMatch) years = parseInt(yearMatch[1]);
    
    if (years >= 5 || lowerResume.includes("architected") || lowerResume.includes("led a team")) seniority = "Senior";
    else if (years >= 3) seniority = "Mid-Level";
    else if (years >= 1 || hasExperience) seniority = "Junior";

    // Industry Readiness
    let industryReadiness: "Internship" | "Entry-Level" | "Mid-Level" | "Senior" = "Internship";
    if (totalScore >= 80 && seniority === "Senior") industryReadiness = "Senior";
    else if (totalScore >= 70 && (seniority === "Mid-Level" || seniority === "Senior")) industryReadiness = "Mid-Level";
    else if (totalScore >= 50) industryReadiness = "Entry-Level";

    // Recommendations Engine
    const recommendations = missingSkills.map(skill => ({
      skill,
      // Rough heuristic: how much points they get if they add this
      estimatedPointValue: Math.round((30 / targetRole.requiredSkills.length) + 2)
    }));

    const feedback = {
      roleDetected: targetRole.title,
      roleAlignmentScore,
      technicalDepthScore,
      resumeStrength,
      industryReadiness,
      completeness,
      seniority,
      coveredSkills,
      missingSkills,
      bonusSkills,
      recommendations,
      matchedKeywords,
      missingKeywords,
      checklist: {
        email: hasEmail,
        phone: hasPhone,
        links: hasLinks,
        actionVerbs: experienceScore > 5,
        quantifiedMetrics: impactScore > 0
      },
      sectionsFound: [],
      sectionsMissing: [],
      suggestions: [],
      radarMetrics: {
        keywordMatch: keywordScore, // /20
        experience: experienceScore, // /15
        projects: projectScore, // /10
        skills: skillsScore, // /10
        formatting: formattingScore, // /5
        impact: impactScore, // /5
      },
      debugScores,
    };

    // Save to Firestore
    const { db } = await import("@/lib/firebase");
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");

    const newDocRef = await addDoc(collection(db, COLLECTIONS.resumes), {
      userId,
      score: totalScore,
      fileName: file.name,
      feedback,
      createdAt: serverTimestamp(),
    });

    const data: AtsAnalysis & { resumeId: string } = {
      score: totalScore,
      ...feedback,
      resumeId: newDocRef.id,
    };

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[api/ats]", err);
    return NextResponse.json(
      { success: false, error: "Unexpected error during ATS V2 scan" },
      { status: 500 }
    );
  }
}
