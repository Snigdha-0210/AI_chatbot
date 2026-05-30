import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roleId = searchParams.get("roleId");
    const topicSlug = searchParams.get("topicSlug");

    if (!roleId || !topicSlug) {
      return NextResponse.json(
        { success: false, error: "roleId and topicSlug are required" },
        { status: 400 }
      );
    }

    const topicFile = path.join(process.cwd(), "data", "interviews_v2", roleId, "topics", `${topicSlug}.json`);
    
    if (!fs.existsSync(topicFile)) {
      console.error(`[api/interview-topic] Not found: ${topicFile}`);
      return NextResponse.json(
        { success: false, error: "Topic not found" },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(topicFile, "utf-8");
    return NextResponse.json({
      success: true,
      data: JSON.parse(fileContent)
    });
  } catch (err) {
    console.error("[api/interview-topic]", err);
    return NextResponse.json(
      { success: false, error: "Unexpected error" },
      { status: 500 }
    );
  }
}
