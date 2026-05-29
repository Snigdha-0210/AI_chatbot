import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";

let adminApp: App;
let adminAuth: Auth;
let adminDb: Firestore;
let adminStorage: Storage;

function getServiceAccount() {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!json) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not set");
  }
  return JSON.parse(json) as Record<string, string>;
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
