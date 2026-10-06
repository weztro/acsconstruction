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
  getDoc,
  setDoc,
  serverTimestamp,
  limit,
  type Firestore,
  type Timestamp,
} from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, type FirebaseStorage } from "firebase/storage";

import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDor1_DWKz5nYDH_1TeqY8h06fYZuU_TIE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "acs-construction-web.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "acs-construction-web",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "acs-construction-web.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "160112151298",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:160112151298:web:64905f824c8869e597501b",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-8X70JRMFN5",
};

export const isFirebaseConfigured = true;

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;
let storage: FirebaseStorage | undefined;
let analytics: Analytics | undefined;

if (typeof window !== "undefined") {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);

    // Initialize Analytics if supported in browser environment
    isSupported().then((supported) => {
      if (supported && app) {
        analytics = getAnalytics(app);
      }
    });
  } catch (error) {
    console.warn("Firebase initialization encountered error:", error);
  }
} else {
  // Server-side initialization
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
  } catch (error) {
    console.warn("Firebase server initialization encountered error:", error);
  }
}

export { app, db, auth, storage, analytics };

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

// ----------------------------------------------------
// Base64 Image Compression & Converter (Zero Bucket Dep)
// ----------------------------------------------------

export function fileToBase64(file: File, maxDimension = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (typeof window === "undefined") {
        resolve(result);
        return;
      }
      const img = new (window as unknown as { Image: new () => HTMLImageElement }).Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(result);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => resolve(result);
      img.src = result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ----------------------------------------------------
// Site Visitors Analytics Services
// ----------------------------------------------------

export interface SiteVisit {
  id?: string;
  path: string;
  referrer: string;
  device: "Mobile" | "Desktop" | "Tablet";
  browser: string;
  os: string;
  sessionId: string;
  createdAt?: unknown;
}

export async function logSiteVisit(
  visit: Omit<SiteVisit, "id" | "createdAt">
): Promise<void> {
  if (!db) return;
  try {
    await addDoc(collection(db, "site_visits"), {
      ...visit,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    // Fail silently so visitor experience is never affected
    console.debug("Site visit log skipped:", error);
  }
}

export async function fetchSiteVisitsFromFirestore(
  limitCount = 150
): Promise<SiteVisit[]> {
  if (!db) return [];
  try {
    const q = query(
      collection(db, "site_visits"),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as SiteVisit[];
  } catch (error) {
    console.error("Error fetching site visits from Firestore:", error);
    return [];
  }
}

// ----------------------------------------------------
// Dynamic Project Types Services
// ----------------------------------------------------

export interface DynamicProjectType {
  id?: string;
  title: string;
  tagline?: string;
  description?: string;
  imageUrl?: string;
  keyElements?: string[];
  createdAt?: unknown;
}

export async function fetchProjectTypesFromFirestore(): Promise<DynamicProjectType[]> {
  if (!db) return [];
  try {
    const q = query(collection(db, "project_types"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as DynamicProjectType[];
  } catch (error) {
    console.error("Error fetching project types from Firestore:", error);
    return [];
  }
}

export async function saveProjectTypeToFirestore(
  data: Omit<DynamicProjectType, "id" | "createdAt">
): Promise<{ success: boolean; id?: string }> {
  if (!db) return { success: false };
  try {
    const docRef = await addDoc(collection(db, "project_types"), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving project type to Firestore:", error);
    return { success: false };
  }
}

export async function deleteProjectTypeFromFirestore(id: string): Promise<boolean> {
  if (!db) return false;
  try {
    await deleteDoc(doc(db, "project_types", id));
    return true;
  } catch (error) {
    console.error("Error deleting project type:", error);
    return false;
  }
}

export async function updateProjectTypeInFirestore(
  id: string,
  data: Partial<Omit<DynamicProjectType, "id" | "createdAt">>
): Promise<boolean> {
  if (!db) return false;
  try {
    await updateDoc(doc(db, "project_types", id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating project type:", error);
    return false;
  }
}

// ----------------------------------------------------
// Dynamic Estimated Budget Ranges Services
// ----------------------------------------------------

export interface DynamicBudgetRange {
  id?: string;
  range: string;
  createdAt?: unknown;
}

export async function fetchBudgetRangesFromFirestore(): Promise<DynamicBudgetRange[]> {
  if (!db) return [];
  try {
    const q = query(collection(db, "budget_ranges"), orderBy("createdAt", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as DynamicBudgetRange[];
  } catch (error) {
    console.error("Error fetching budget ranges from Firestore:", error);
    return [];
  }
}

export async function saveBudgetRangeToFirestore(
  range: string
): Promise<{ success: boolean; id?: string }> {
  if (!db) return { success: false };
  try {
    const docRef = await addDoc(collection(db, "budget_ranges"), {
      range,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving budget range to Firestore:", error);
    return { success: false };
  }
}

export async function updateBudgetRangeInFirestore(
  id: string,
  range: string
): Promise<boolean> {
  if (!db) return false;
  try {
    await updateDoc(doc(db, "budget_ranges", id), {
      range,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating budget range:", error);
    return false;
  }
}

export async function deleteBudgetRangeFromFirestore(id: string): Promise<boolean> {
  if (!db) return false;
  try {
    await deleteDoc(doc(db, "budget_ranges", id));
    return true;
  } catch (error) {
    console.error("Error deleting budget range:", error);
    return false;
  }
}

// ----------------------------------------------------
// Dynamic Engineers & Mesthris Services
// ----------------------------------------------------

export interface EngineerMesthri {
  id?: string;
  name: string;
  role: string;
  experience: string;
  specialization: string;
  bio?: string;
  phone?: string;
  imageUrl?: string;
  createdAt?: unknown;
}

export async function fetchEngineersFromFirestore(): Promise<EngineerMesthri[]> {
  if (!db) return [];
  try {
    const q = query(collection(db, "engineers_mesthri"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as EngineerMesthri[];
  } catch (error) {
    console.error("Error fetching engineers and mesthris from Firestore:", error);
    return [];
  }
}

export async function saveEngineerToFirestore(
  data: Omit<EngineerMesthri, "id" | "createdAt">
): Promise<{ success: boolean; id?: string }> {
  if (!db) return { success: false };
  try {
    const docRef = await addDoc(collection(db, "engineers_mesthri"), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving engineer/mesthri to Firestore:", error);
    return { success: false };
  }
}

export async function updateEngineerInFirestore(
  id: string,
  data: Partial<Omit<EngineerMesthri, "id" | "createdAt">>
): Promise<boolean> {
  if (!db) return false;
  try {
    await updateDoc(doc(db, "engineers_mesthri", id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating engineer/mesthri:", error);
    return false;
  }
}

export async function deleteEngineerFromFirestore(id: string): Promise<boolean> {
  if (!db) return false;
  try {
    await deleteDoc(doc(db, "engineers_mesthri", id));
    return true;
  } catch (error) {
    console.error("Error deleting engineer/mesthri:", error);
    return false;
  }
}

// ----------------------------------------------------
// Studio Settings: Defaults Visibility (Hidden Defaults)
// ----------------------------------------------------

export interface HiddenDefaultsConfig {
  hiddenStyles: string[];
  hiddenBudgets: string[];
  hiddenEngineers: string[];
}

export async function fetchHiddenDefaults(): Promise<HiddenDefaultsConfig> {
  if (!db) return { hiddenStyles: [], hiddenBudgets: [], hiddenEngineers: [] };
  try {
    const docRef = doc(db, "studio_settings", "hidden_defaults");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        hiddenStyles: Array.isArray(data.hiddenStyles) ? data.hiddenStyles : [],
        hiddenBudgets: Array.isArray(data.hiddenBudgets) ? data.hiddenBudgets : [],
        hiddenEngineers: Array.isArray(data.hiddenEngineers) ? data.hiddenEngineers : [],
      };
    }
    return { hiddenStyles: [], hiddenBudgets: [], hiddenEngineers: [] };
  } catch (e) {
    console.warn("Could not fetch hidden defaults:", e);
    return { hiddenStyles: [], hiddenBudgets: [], hiddenEngineers: [] };
  }
}

export async function saveHiddenDefaults(
  config: Partial<HiddenDefaultsConfig>
): Promise<boolean> {
  if (!db) return false;
  try {
    const docRef = doc(db, "studio_settings", "hidden_defaults");
    await setDoc(docRef, config, { merge: true });
    return true;
  } catch (e) {
    console.error("Error saving hidden defaults:", e);
    return false;
  }
}

