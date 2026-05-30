import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: "Email and OTP are required" }, { status: 400 });
    }

    const otpsRef = collection(db, "email_otps");
    
    // Find the latest OTP for this email
    const q = query(
      otpsRef,
      where("email", "==", email.toLowerCase())
    );
    const otpDocs = await getDocs(q);

    if (otpDocs.empty) {
      return NextResponse.json({ success: false, error: "No OTP request found for this email" }, { status: 404 });
    }

    // Get the most recent one (we could also sort by createdAt but where + orderBy needs an index)
    // For simplicity, find the one with the latest createdAt in memory
    let latestDoc: any = null;
    otpDocs.forEach(doc => {
      if (!latestDoc || doc.data().createdAt.toMillis() > latestDoc.data().createdAt.toMillis()) {
        latestDoc = doc;
      }
    });

    const otpData = latestDoc.data();

    // Check expiration
    if (new Date() > otpData.expiresAt.toDate()) {
      return NextResponse.json({ success: false, error: "OTP has expired" }, { status: 400 });
    }

    // Check attempts to prevent brute force
    if (otpData.attempts >= 5) {
      return NextResponse.json({ success: false, error: "Too many failed attempts. Please request a new OTP." }, { status: 429 });
    }

    // Verify OTP
    if (otpData.otp !== otp) {
      // Increment attempts
      await updateDoc(latestDoc.ref, { attempts: otpData.attempts + 1 });
      return NextResponse.json({ success: false, error: "Invalid OTP" }, { status: 400 });
    }

    // Mark as verified
    await updateDoc(latestDoc.ref, { verified: true });

    // Note: We bypass updating Firebase Auth `emailVerified` here because we removed the Admin SDK.
    // The frontend will set `emailVerified: true` in the `users` collection instead!

    return NextResponse.json({ 
      success: true, 
      message: "OTP verified successfully"
    });

  } catch (error: any) {
    console.error("[verify-otp]", error);
    return NextResponse.json({ success: false, error: "Failed to verify OTP: " + error.message }, { status: 500 });
  }
}
