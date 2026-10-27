export type LabTopic = 'archimedes' | 'lever' | 'reflection';

export type UserRole = 'student' | 'teacher' | 'demo';

export interface ArchimedesData {
  P1: number; // Force in air (N)
  P2: number; // Force in liquid (N)
  V: number;  // Displaced volume (mL)
  liquid: 'water' | 'saltwater' | 'oil' | 'alcohol';
  g: number;  // Acceleration due to gravity (10 or 9.8 N/kg)
  objectVolume?: number;
  dynamometerResolution?: number; // ĐCNN e.g. 0.1 N
  measuringCylinderResolution?: number; // ĐCNN e.g. 2 mL
  isSubmerged: boolean;
  isNotTouchingWalls: boolean;
}

export interface LeverData {
  F1: number; // Left force (N)
  d1: number; // Left arm distance (cm)
  F2: number; // Right force (N)
  d2: number; // Right arm distance (cm)
}

export interface ReflectionData {
  i: number; // Angle of incidence (degrees) from normal
  r: number; // Angle of reflection (degrees) from normal
  measuredFromNormal: boolean;
}

export interface CerSubmission {
  id: string;
  topic: LabTopic;
  studentId: string;
  studentName: string;
  classCode: string;
  timestamp: string;
  prediction: string;
  data: any;
  claim: string;
  evidence: string;
  reasoning: string;
  revisedClaim?: string;
  revisedEvidence?: string;
  revisedReasoning?: string;
  aiEvaluation?: {
    claimScore: number;
    evidenceScore: number;
    reasoningScore: number;
    totalScore: number;
    claimFeedback: string;
    evidenceFeedback: string;
    reasoningFeedback: string;
    overallAssessment: string;
    pedagogicalQuestion: string;
  };
  teacherScore?: {
    claimScore: number;
    evidenceScore: number;
    reasoningScore: number;
    totalScore: number;
    teacherNotes: string;
    gradedAt: string;
  };
  isDemo?: boolean;
}

export interface Question {
  id: string;
  grade: 7 | 8;
  topic: LabTopic;
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  type: 'multiple_choice' | 'open_ended';
  question: string;
  options?: string[];
  correctIndex?: number;
  sampleAnswer?: string;
  explanation: string;
  relatedConcept: string;
}

export interface StudentProfile {
  studentId: string;
  studentName: string;
  classCode: string;
  preTestScore: number;
  postTestScore: number;
  completedLabs: LabTopic[];
  cerSubmissions: CerSubmission[];
  identifiedMisconceptions: string[];
  needSupport: boolean;
  supportReason?: string;
  recommendedActivity?: string;
  isDemo?: boolean;
}

export interface SystemStatus {
  hasGeminiKey: boolean;
  firebaseConfigured: boolean;
  serverTime: string;
  version: string;
  appTitle: string;
  author: string;
}
