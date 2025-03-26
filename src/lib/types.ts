// משותף למספר קומפוננטות
export type Answer = {
  questionId: string;
  answer: string;
};

// מידע התקשרות למשתמש
export interface ContactInfo {
  name?: string;
  email: string;
  phone: string;
  comments?: string;
}

// סטטוס משתמש
export interface UserStatus {
  isNew: boolean;
  hasProgress: boolean;
  currentPage?: number;
}

// תגובת שגיאה מה-API
export interface ApiError {
  message: string;
  code?: string;
  details?: string;
} 