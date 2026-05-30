import { NextResponse } from "next/server";
import { getAdminApp, getAdminDb } from "@/utils/firebase-admin";

export const runtime = "nodejs";

export async function GET() {
  try {
    const app = getAdminApp();
    const db = getAdminDb();
    
    // Mask private key if it exists
    const hasPrivateKey = !!process.env.FIREBASE_PRIVATE_KEY || !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

    return NextResponse.json({
      success: true,
      status: "Firebase Admin Initialized: true",
      projectId: app.options.projectId || process.env.FIREBASE_PROJECT_ID || "Unknown (might be inside JSON)",
      hasPrivateKey,
      firestoreConnectionStatus: db ? "Connected" : "Disconnected",
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      status: "Firebase Admin Initialized: false",
      error: error.message || "Unknown Initialization Error",
    }, { status: 500 });
  }
}
