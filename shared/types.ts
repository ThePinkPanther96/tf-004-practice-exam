export const TOPICS = [
  "Infrastructure as Code",
  "Terraform fundamentals",
  "Core workflow",
  "Terraform configuration",
  "Terraform modules",
  "State management",
  "Maintain infrastructure",
  "HCP Terraform",
] as const;
export type Question = {
  id: string;
  type: "single" | "multiple" | "boolean";
  topic: number;
  prompt: string;
  options: { id: string; text: string }[];
  correct: string[];
  selectCount: number;
  explanation: string;
  references: { label: string; url: string }[];
  source: {
    kind: "markdown" | "screenshot";
    file: string;
    number: string;
    permission: string;
  };
  status: "ready" | "needs-review";
  notes: string[];
  duplicateOf?: string;
  sourceAnswer?: string[];
};
export type PublicQuestion = Omit<
  Question,
  "correct" | "explanation" | "references" | "sourceAnswer"
>;
export type Response = {
  selected: string[];
  flagged: boolean;
  checked?: boolean;
};
export type Attempt = {
  demo?: "pink-floyd-v1";
  id: string;
  mode: "exam" | "study";
  status: "active" | "submitted";
  createdAt: number;
  deadline: number | null;
  submittedAt: number | null;
  count: number;
  passThreshold: number;
  questions: (PublicQuestion | Question)[];
  responses: Record<string, Response>;
  score: number | null;
  correctCount: number | null;
  passed: boolean | null;
  submissionReason: "manual" | "timeout" | null;
  serverNow: number;
};
export type AttemptSummary = Pick<
  Attempt,
  | "demo"
  | "id"
  | "mode"
  | "status"
  | "createdAt"
  | "deadline"
  | "submittedAt"
  | "count"
  | "score"
  | "passed"
  | "correctCount"
  | "submissionReason"
>;
export type Dashboard = {
  sourceUrl?: string;
  total: number;
  ready: number;
  unique: number;
  review: number;
  markdown: number;
  screenshots: number;
  topics: {
    id: number;
    name: string;
    total: number;
    ready: number;
    accuracy: number | null;
    answered: number;
  }[];
  history: AttemptSummary[];
  active: AttemptSummary[];
};
