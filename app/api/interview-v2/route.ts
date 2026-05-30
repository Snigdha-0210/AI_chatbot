import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const roleId = body.roleId as string;
    const type = body.type as "subjects" | "coding" | "viva" | "companies" | "all";

    if (!roleId?.trim()) {
      return NextResponse.json(
        { success: false, error: "RoleId is required" },
        { status: 400 }
      );
    }

    const dataDir = path.join(process.cwd(), "data", "interviews_v2");
    let targetDir = path.join(dataDir, roleId);

    if (!fs.existsSync(targetDir)) {
      console.warn(`[api/interview-v2] Missing dataset for role: ${roleId}. Falling back to general.`);
      targetDir = path.join(dataDir, `general`);
    }

    if (!fs.existsSync(targetDir)) {
      return NextResponse.json(
        { success: false, error: "Interview datasets missing from server" },
        { status: 500 }
      );
    }

    if (type && type !== "all") {
      const fileContent = fs.readFileSync(path.join(targetDir, `${type}.json`), "utf-8");
      return NextResponse.json({ success: true, data: JSON.parse(fileContent) });
    }

    // Load all
    const subjects = JSON.parse(fs.readFileSync(path.join(targetDir, `subjects.json`), "utf-8"));
    const coding = JSON.parse(fs.readFileSync(path.join(targetDir, `coding.json`), "utf-8"));
    const viva = JSON.parse(fs.readFileSync(path.join(targetDir, `viva.json`), "utf-8"));
    const companies = JSON.parse(fs.readFileSync(path.join(targetDir, `companies.json`), "utf-8"));

    // V6 Global DSA Roadmap
    let dsaRoadmap = null;
    try {
      dsaRoadmap = JSON.parse(fs.readFileSync(path.join(dataDir, `dsa_roadmap.json`), "utf-8"));
    } catch (e) {
      console.warn("dsa_roadmap.json not found yet.");
    }

    return NextResponse.json({
      success: true,
      data: { subjects, coding, viva, companies, dsaRoadmap }
    });
  } catch (err) {
    console.error("[api/interview-v2]", err);
    return NextResponse.json(
      { success: false, error: "Unexpected error" },
      { status: 500 }
    );
  }
}
