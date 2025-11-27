export type InputType = 'radio' | 'text' | 'email' | 'tel';

export interface StepConfig {
  id: string;
  type: InputType;
  question: string;
  sub?: string;
  options?: string[]; // For radio
  placeholder?: string; // For text inputs
}

export interface Submission {
  timestamp: string;
  [key: string]: string; // Dynamic keys based on step IDs
}

export interface FormState {
  [key: string]: string;
}
