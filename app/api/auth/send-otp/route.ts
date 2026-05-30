import { NextRequest, NextResponse } from "next/server";
import { sendOtpEmail } from "@/lib/email";
import crypto from "crypto";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    
    if (!email || !email.includes("@")) {
      return NextResponse.json({ success: false, error: "Valid email is required" }, { status: 400 });
    }

    const { db } = await import("@/lib/firebase");
    const { collection, addDoc, query, where, getDocs } = await import("firebase/firestore");

    const otpsRef = collection(db, "email_otps");

    // Validate Email Config
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD || !process.env.EMAIL_FROM) {
      return NextResponse.json(
        { success: false, error: "Email service not configured. Missing environment variables." },
        { status: 500 }
      );
    }

    // Rate Limiting: Max 3 requests in the last 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const q = query(
      otpsRef,
      where("email", "==", email.toLowerCase())
    );
    const recentOtpsQuery = await getDocs(q);
    
    // Filter by createdAt in memory to avoid needing a Firestore Composite Index
    let recentRequestCount = 0;
    recentOtpsQuery.forEach(doc => {
      const data = doc.data();
      if (data.createdAt && data.createdAt.toMillis() >= fifteenMinutesAgo.getTime()) {
        recentRequestCount++;
      }
    });

    if (recentRequestCount >= 3) {
      return NextResponse.json(
        { success: false, error: "Too many OTP requests. Please try again later." },
        { status: 429 }
      );
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    console.log("Email:", email);
    console.log("OTP Generated:", otp);
    console.log("Sending Email...");

    // Send email
    try {
      await sendOtpEmail(email, otp);
      console.log("Email Success");
    } catch (e: any) {
      console.log("Email Failed:", e);
      return NextResponse.json(
        { success: false, error: "SMTP authentication failed or Email delivery failed: " + e.message },
        { status: 500 }
      );
    }

    // Store in Firestore
    await addDoc(otpsRef, {
      email: email.toLowerCase(),
      otp, // In production, we could hash this. Storing plaintext for easy lookup as per request.
      createdAt: new Date(),
      expiresAt,
      verified: false,
      attempts: 0
    });

    return NextResponse.json({ success: true, message: "OTP sent successfully" });

  } catch (error: any) {
    console.error("[send-otp]", error);
    return NextResponse.json({ success: false, error: "OTP generation failed: " + error.message }, { status: 500 });
  }
}
