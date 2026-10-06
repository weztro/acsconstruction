import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  type Firestore,
  type Timestamp,
} from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;
let storage: FirebaseStorage | undefined;

if (typeof window !== "undefined" || isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
  } catch (error) {
    console.warn("Firebase initialization skipped or encountered error:", error);
  }
}

export { app, db, auth, storage };

export interface Lead {
  id?: string;
  name: string;
  email: string;
  phone: string;
  location?: string;
  city?: string;
  budget?: string;
  projectType?: string;
  message: string;
  status: "new" | "contacted" | "in_progress" | "closed";
  createdAt?: Timestamp | Date | string | null;
}

export interface ProjectItem {
  id?: string;
  title: string;
  tagline: string;
  category: string;
  location: string;
  area: string;
  timeline?: string;
  description: string;
  imageUrl: string;
  galleryImages?: string[];
  keyFeatures?: string[];
  createdAt?: Timestamp | Date | string | null;
}

// ----------------------------------------------------
// Firestore Leads Services
// ----------------------------------------------------

export async function saveLeadToFirestore(lead: Omit<Lead, "id" | "status" | "createdAt">): Promise<{ success: boolean; id?: string }> {
  if (!db) {
    console.log("Firebase not configured: simulating lead save", lead);
    return { success: true, id: "simulated-" + Date.now() };
  }

  try {
    const docRef = await addDoc(collection(db, "leads"), {
      ...lead,
      status: "new",
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving lead to Firestore:", error);
    return { success: false };
  }
}

export async function fetchLeadsFromFirestore(): Promise<Lead[]> {
  if (!db) return [];

  try {
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Lead[];
  } catch (error) {
    console.error("Error fetching leads from Firestore:", error);
    return [];
  }
}

export async function updateLeadStatusInFirestore(
  leadId: string,
  status: Lead["status"]
): Promise<boolean> {
  if (!db) return true;

  try {
    const leadRef = doc(db, "leads", leadId);
    await updateDoc(leadRef, { status });
    return true;
  } catch (error) {
    console.error("Error updating lead status:", error);
    return false;
  }
}

// ----------------------------------------------------
// Firestore Projects Services
// ----------------------------------------------------

export async function fetchProjectsFromFirestore(): Promise<ProjectItem[]> {
  if (!db) return [];

  try {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as ProjectItem[];
  } catch (error) {
    console.error("Error fetching projects from Firestore:", error);
    return [];
  }
}

export async function saveProjectToFirestore(
  project: Omit<ProjectItem, "id" | "createdAt">
): Promise<{ success: boolean; id?: string }> {
  if (!db) {
    return { success: false };
  }

  try {
    const docRef = await addDoc(collection(db, "projects"), {
      ...project,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving project to Firestore:", error);
    return { success: false };
  }
}

export async function deleteProjectFromFirestore(projectId: string): Promise<boolean> {
  if (!db) return false;

  try {
    await deleteDoc(doc(db, "projects", projectId));
    return true;
  } catch (error) {
    console.error("Error deleting project from Firestore:", error);
    return false;
  }
}

// ----------------------------------------------------
// Firebase Storage Services (Image Upload)
// ----------------------------------------------------

export async function uploadImageToStorage(file: File, folder = "projects"): Promise<string> {
  if (!storage) {
    throw new Error("Firebase Storage is not configured. Please add your Firebase Storage Bucket in .env.local.");
  }

  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const storageRef = ref(storage, `${folder}/${timestamp}_${sanitizedName}`);

  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}
