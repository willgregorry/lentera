export type UserRole = "family" | "caregiver";

export type LenteraStatus = "aman" | "waspada" | "darurat";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  city?: string;
  verified?: boolean;
  skills?: string[];
  experience_years?: number;
  bio?: string;
}

export interface ElderlyProfile {
  id: string;
  name: string;
  age: number;
  family_id: string;
  conditions: string[];
  allergies: string[];
  routine_meds: string[];
  address: string;
  nearest_hospital: string;
  nearest_hospital_phone: string;
  status: LenteraStatus;
}

export interface CareLog {
  id: string;
  elderly_id: string;
  caregiver_id: string;
  caregiver_name?: string;
  heart_rate: number;
  systolic: number;
  diastolic: number;
  meal_portion: "habis" | "setengah" | "sedikit" | "tidak_makan";
  medication_taken: boolean;
  mood: "cerah" | "tenang" | "lelah" | "gelisah";
  notes: string;
  photo_url?: string;
  logged_at: string;
}

export interface AiDigest {
  id?: string;
  elderly_id: string;
  status: LenteraStatus;
  summary: string;
  meal_suggestion: string;
  hydration_activity_tip: string;
  anomaly_alert: string | null;
  generated_at: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  caregiver_id: string;
  caregiver_name: string;
  caregiver_city: string;
  experience_years: number;
  skills: string[];
  verified: boolean;
  cover_note: string;
  status: "pending" | "accepted" | "rejected";
  ai_match_score?: number;
  ai_match_reason?: string;
  applied_at: string;
}

export interface CareJob {
  id: string;
  family_id: string;
  family_name: string;
  elderly_name: string;
  elderly_age: number;
  title: string;
  location: string;
  schedule: string;
  salary_display: string;
  medical_notes: string;
  required_skills: string[];
  status: "open" | "filled";
  created_at: string;
  applications?: JobApplication[];
}

export interface AiMatchResult {
  caregiver_id: string;
  match_score: number;
  reason: string;
  highlights?: string[];
}

export interface AiTriageBrief {
  patient_summary: string;
  allergies: string[];
  routine_meds: string[];
  last_24h_vitals: string;
  immediate_actions: string[];
  emergency_note: string;
}

export interface SosAlert {
  id: string;
  elderly_id: string;
  elderly_name?: string;
  triggered_by: string;
  reason: string;
  status: "active" | "resolved";
  triage_brief?: AiTriageBrief;
  nearest_hospital?: string;
  created_at: string;
  resolved_at?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "emergency" | "announcement";
  created_at: string;
  read?: boolean;
}
