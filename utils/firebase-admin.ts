import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";

let adminApp: App;
let adminAuth: Auth;
let adminDb: Firestore;
let adminStorage: Storage;

function getServiceAccount() {
  // Option 1: Single JSON string
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (json) {
    return JSON.parse(json) as Record<string, string>;
  }

  // Option 2: Individual variables
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    return {
      projectId,
      clientEmail,
      privateKey,
    };
  }

  throw new Error("Firebase Admin credentials missing. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY, or FIREBASE_SERVICE_ACCOUNT_JSON.");
}

export function getAdminApp(): App {
  if (!adminApp) {
    adminApp = getApps().length
      ? getApps()[0]!
      : initializeApp({
          credential: cert(getServiceAccount()),
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        });
  }
  return adminApp;
}

export function getAdminAuth(): Auth {
  if (!adminAuth) adminAuth = getAuth(getAdminApp());
  return adminAuth;
}

export function getAdminDb(): Firestore {
  if (!adminDb) adminDb = getFirestore(getAdminApp());
  return adminDb;
}

export function getAdminStorage(): Storage {
  if (!adminStorage) adminStorage = getStorage(getAdminApp());
  return adminStorage;
}
