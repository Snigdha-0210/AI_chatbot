import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { personalizeRoadmap } from "@/utils/roadmapPersonalizer";
import type { CareerRoadmap } from "@/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const roleId = body.roleId as string;
    const year = body.year as string || "1st Year";
    const level = body.level as string || "Beginner";

    console.log(`[api/roadmap] Generating Roadmap: Role=${roleId}, Year=${year}, Level=${level}`);

    if (!roleId?.trim()) {
      return NextResponse.json(
        { success: false, error: "RoleId is required" },
        { status: 400 }
      );
    }

    const roadmapsDir = path.join(process.cwd(), "data", "roadmaps");
    
    // 1. Try to load specific role roadmap
    let targetFile = path.join(roadmapsDir, `${roleId}.json`);
    let isFallback = false;

    if (!fs.existsSync(targetFile)) {
      console.warn(`[api/roadmap] Missing dataset for role: ${roleId}. Falling back to general.json`);
      targetFile = path.join(roadmapsDir, `general.json`);
      isFallback = true;
    }

    if (!fs.existsSync(targetFile)) {
      console.error(`[api/roadmap] CRITICAL: Even general.json is missing!`);
      return NextResponse.json(
        { success: false, error: "Roadmap datasets missing from server" },
        { status: 500 }
      );
    }

    const fileContent = fs.readFileSync(targetFile, "utf-8");
    let baseRoadmap: CareerRoadmap = JSON.parse(fileContent);

    // If it's a fallback, override the title so it doesn't just say "Software Engineer"
    if (isFallback) {
      baseRoadmap.title = `${roleId.charAt(0).toUpperCase() + roleId.slice(1)} (General Path)`;
    }

    // 2. Personalize it based on Year and Level
    const personalized = personalizeRoadmap(baseRoadmap, year, level);
    
    console.log(`[api/roadmap] Success. Generated ${personalized.stages.length} stages.`);

    return NextResponse.json({
      success: true,
      data: personalized
    });
  } catch (err) {
    console.error("[api/roadmap]", err);
    return NextResponse.json(
      { success: false, error: "Unexpected error" },
      { status: 500 }
    );
  }
}
