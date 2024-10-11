export interface Question {
  id: string;
  question: string;
  type: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  additionalInfo?: {
    type: string;
    question: string;
    placeholder: string;
  };
}

export interface FormData {
  [key: string]: string | number | boolean;
}
