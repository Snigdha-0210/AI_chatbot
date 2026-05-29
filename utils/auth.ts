import { getAdminAuth } from "@/utils/firebase-admin";

export async function verifyBearerToken(
  header: string | null
): Promise<string> {
  if (!header?.startsWith("Bearer ")) {
    throw new Error("Missing or invalid Authorization header");
  }
  const token = header.slice(7);
  const decoded = await getAdminAuth().verifyIdToken(token);
  return decoded.uid;
}
