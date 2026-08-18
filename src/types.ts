export type AppView =
  | 'landing'
  | 'dashboard'
  | 'documents'
  | 'viewer'
  | 'chat'
  | 'summarizer'
  | 'ocr'
  | 'translate'
  | 'tools'
  | 'search'
  | 'favorites'
  | 'shared'
  | 'trash'
  | 'settings'
  | 'help';

export type AuthMode = 'login' | 'signup' | 'forgot' | 'verify' | null;

export type FileType = 'pdf' | 'docx' | 'pptx' | 'xlsx' | 'png' | 'jpg';

export type ProcessingStatus = 'uploading' | 'processing' | 'indexing' | 'ready' | 'error';

export interface DocumentPage {
  pageNumber: number;
  title?: string;
  content: string;
  highlights?: string[];
  tables?: { headers: string[]; rows: string[][] }[];
}

export interface DocumentItem {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  fileSizeBytes: number;
  fileType: FileType;
  totalPages: number;
  uploadDate: string;
  lastModified: string;
  status: ProcessingStatus;
  isFavorite: boolean;
  isShared?: boolean;
  isTrash?: boolean;
  owner?: string;
  permission?: 'view' | 'comment' | 'edit';
  category: 'Financial' | 'Legal' | 'Technical' | 'Research' | 'General';
  pages: DocumentPage[];
  summary?: string;
  rawText?: string;
}

export interface PageCitation {
  page: number;
  text?: string;
  documentId?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: PageCitation[];
  documentId?: string;
  documentTitle?: string;
}

export interface SummaryResult {
  summary: string;
  keyPoints: string[];
  importantFindings: string[];
  conclusion: string;
  citations?: PageCitation[];
}

export interface OCRResult {
  extractedText: string;
  confidence: number;
  pagesDetected: number;
  language: string;
}

export interface TranslationResult {
  translatedText: string;
  sourceLanguageDetected: string;
  targetLanguage: string;
}

export type PDFToolId =
  | 'merge'
  | 'split'
  | 'compress'
  | 'pdf-to-word'
  | 'pdf-to-excel'
  | 'pdf-to-ppt'
  | 'image-to-pdf'
  | 'ocr'
  | 'translate'
  | 'extract-text';

export interface PDFToolMeta {
  id: PDFToolId;
  name: string;
  description: string;
  iconName: string;
  category: 'convert' | 'optimize' | 'ai' | 'organize';
}

export interface SearchMatchResult {
  docId: string;
  docTitle: string;
  page: number;
  matchScore: number;
  snippet: string;
  category: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  type?: 'success' | 'info' | 'alert';
  actionTarget?: AppView;
  targetDocId?: string;
  docId?: string;
}

export interface UserSettings {
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
  theme: 'light' | 'dark' | 'system';
  aiResponseStyle: 'concise' | 'balanced' | 'detailed';
  showCitationsByDefault: boolean;
  ocrDefaultLanguage: string;
  notifications: {
    docProcessing: boolean;
    aiCompletion: boolean;
    securityAlerts: boolean;
    weeklyDigest: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    activeSessions: { device: string; location: string; lastActive: string; current?: boolean }[];
  };
  storageUsedBytes: number;
  storageLimitBytes: number;
}
