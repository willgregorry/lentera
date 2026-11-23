import {
  AiDigest,
  AiMatchResult,
  AiTriageBrief,
  AppNotification,
  CareJob,
  CareLog,
  ElderlyProfile,
  JobApplication,
  SosAlert,
  UserProfile,
  UserRole,
} from "@/types";

export interface StreamEvent {
  type: string;
  data: unknown;
}

export interface ILenteraApiService {
  loginUser(payload: {
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<{ user: UserProfile; token: string; isDemoFallback?: boolean }>;

  registerUser(payload: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    city?: string;
    skills?: string[];
  }): Promise<{ user: UserProfile; token: string; isDemoFallback?: boolean }>;

  getCurrentProfile(): Promise<UserProfile | null>;
  getElderlyProfile(id?: string): Promise<ElderlyProfile>;
  getCareLogs(elderlyId?: string): Promise<CareLog[]>;
  createCareLog(
    payload:
      | FormData
      | {
          elderly_id: string;
          heart_rate: number;
          systolic: number;
          diastolic: number;
          meal_portion: CareLog["meal_portion"];
          medication_taken: boolean;
          mood: CareLog["mood"];
          notes: string;
          photo_url?: string;
        }
  ): Promise<CareLog>;

  getJobs(): Promise<CareJob[]>;
  createJob(payload: {
    title: string;
    elderly_name: string;
    elderly_age: number;
    location: string;
    schedule: string;
    salary_display: string;
    medical_notes: string;
    required_skills: string[];
  }): Promise<CareJob>;
  applyToJob(
    jobId: string,
    payload: {
      caregiver_name: string;
      caregiver_city: string;
      experience_years: number;
      skills: string[];
      cover_note: string;
    }
  ): Promise<JobApplication>;
  updateApplicationStatus(
    applicationId: string,
    status: "accepted" | "rejected"
  ): Promise<{ id: string; status: "accepted" | "rejected" }>;

  sendInterviewInvite(caregiver: { id: string; name: string }): Promise<void>;
  hireCaregiverDirectly(caregiver: {
    id: string;
    name: string;
    skills?: string[];
  }): Promise<void>;

  getSosAlerts(elderlyId?: string): Promise<SosAlert[]>;
  triggerSosAlert(payload: {
    elderly_id: string;
    reason: string;
  }): Promise<SosAlert>;
  resolveSosAlert(sosId: string): Promise<SosAlert>;

  getNotifications(): Promise<AppNotification[]>;
  postAnnouncement(payload: {
    title: string;
    message: string;
  }): Promise<AppNotification>;

  generateAiDailyDigest(payload: {
    elderly_id: string;
    logs?: CareLog[];
  }): Promise<AiDigest>;
  matchCaregiverWithAi(payload: {
    job: CareJob;
    caregiver: {
      id: string;
      name: string;
      experience_years: number;
      skills: string[];
    };
  }): Promise<AiMatchResult>;
  generateAiTriageBrief(payload: {
    elderly_id: string;
    reason: string;
  }): Promise<AiTriageBrief>;

  subscribeToStream(onEvent: (event: StreamEvent) => void): () => void;
}
